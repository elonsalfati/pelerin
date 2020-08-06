const grpc = require("grpc")
const utils = require("./utils")
const serializers = require("./serializers")

/**
 * Define the pelerin client.
 */
class PelerinClient {
  /**
   * Initialize the client definition
   */
  constructor(options = {}) {
    // load client options
    this.options = {
      ...utils.getDefaultOptions(),
      ...options
    }

    // internal client description
    this._description = {}

    // set tmp call
    this._call = null
    this._bidi = null
    this.client = null
    this._promise = null
  }

  /**
   * Define the gRPC client.
   *
   * @param {string} path - The service and handler path.
   * @param {object} options - The custom options.
   * @returns {object} - client
   */
  _loadClient(path, options) {
    // split path and veify length
    const splittedPath = path.split("/")

    // verify length
    if (splittedPath.length === 3) {
      // get service and handler name
      const [host, serviceName, handlerName] = splittedPath

      if (!this._description[handlerName])
        this._description[handlerName] = {}

      // push to description
      this._description[handlerName] = {
        ...utils.getDefaultServiceDefinition(),
        path: `/${this.options.protoName}.${serviceName}/${handlerName}`,
        ...options
      }

      // set grpc client & return it
      const Client = grpc.makeGenericClientConstructor(this._description)
      this.client = new Client(host, grpc.credentials.createInsecure())
      return this.client
    } else {
      throw new Error("unexpected path format, should be {serviceName}/{handlerName}")
    }
  }

  /**
   * Generate metadata object.
   *
   * @param {object} headers - Headers object.
   * @returns {object} - Metadata
   */
  _genMetadata(headers) {
    // create new metadata instance
    const metadata = new grpc.Metadata()

    // append each header
    for (const [key, value] of Object.entries(headers)) {
      metadata.set(key, value)
    }

    return metadata
  }

  /**
   * Send unary request to the server.
   *
   * @param {string} path - The endpoint path.
   * @param {object} value - Serialized object request.
   * @param {object} options - External options.
   */
  _sendUnaryRequest(path, value, options) {
    // get target names
    const [, , handlerName] = path.split("/")

    // generate metadata
    const metadata = this._genMetadata(options.headers)

    // return new promise with the results
    return new Promise((resolve, reject) => {
      // execute grpc request and promisify callback
      this.client[handlerName](value, metadata, (err, response) => {
        if (response) {
          resolve(response.toJavaScript())
        }

        reject(err)
      })
    })
  }

  /**
   * Send server stream request to the server.
   *
   * @param {string} path - The endpoint path.
   * @param {object} value - Serialized object request.
   * @param {object} options - External options.
   */
  _sendServerStreamRequest(path, value, options) {
    // get target names
    const [, , handlerName] = path.split("/")

    // generate metadata
    const metadata = this._genMetadata(options.headers)

    // execute request
    const call = this.client[handlerName](value, metadata)

    // resolve stream
    return Promise.resolve(
      utils.stream.call(call)
    )
  }

  /**
   * Send server stream request to the server.
   *
   * @param {string} path - The endpoint path.
   * @param {object} value - Serialized object request.
   * @param {object} options - External options.
   * @returns {object} - this
   */
  _sendClientStreamRequest(path, value, options) {
    // get target names
    const [, , handlerName] = path.split("/")

    // generate metadata
    const metadata = this._genMetadata(options.headers)

    // execute request
    if (!this._call) {
      this._promise = new Promise((resolve, reject) => {
        this._call = this.client[handlerName](metadata, (err, response) => {
          if (response) {
            resolve(response.toJavaScript())
          }

          reject(err)
        })
      })
    }

    this._call.write(value)
    return this
  }

  /**
   * Send bidirectional stream request to the server.
   *
   * @param {string} path - The endpoint path.
   * @param {object} value - Serialized object request.
   * @param {object} options - External options.
   * @returns {object} - this
   */
  _sendBidirectionalStreamRequest(path, value, options) {
    // get target names
    const [, , handlerName] = path.split("/")

    // generate metadata
    const metadata = this._genMetadata(options.headers)

    // execute request
    if (!this._call) {
      this._call = this.client[handlerName](metadata)
      this._bidi = utils.stream.call(this._call)
    }

    this._call.write(value)
    return this
  }

  /**
   * Returns the bidi stream.
   */
  get bidiStream() {
    return this._bidi
  }

  /**
   * Finish stream requests
   *
   * @returns {Promise}
   */
  finish() {
    // check for call
    if (this._call) {
      // close stream
      this._call.end()

      // return promise
      if (this._promise)
        return this._promise

      if (this._bidi)
        return Promise.resolve(this._bidi)
    }

    return Promise.reject("unavailable response")
  }

  /**
   * Sends a dynamic value to a dynamic server.
   *
   * @param {string} path - The path of the service.
   * @param {object} obj - Data to send.
   * @param {object} options - Custom request settings.
   * @returns {Promise}
   */
  send(path, obj, options = {}) {
    // set options
    const _options = {
      headers: {},
      requestStream: false,
      responseStream: false,
      ...options
    }

    // define client service
    this._loadClient(path, _options)

    // convert the object to a dynamic value
    const value = serializers.valueFromJs(obj)

    // choose request type
    // unary request
    if (_options.requestStream === false && _options.responseStream === false)
      return this._sendUnaryRequest(path, value, _options)

    // server stream
    else if (_options.requestStream === false && _options.responseStream === true)
      return this._sendServerStreamRequest(path, value, _options)

    // client stream
    else if (_options.requestStream === true && _options.responseStream === false)
      return this._sendClientStreamRequest(path, value, _options)

    // bidirectional stream
    else if (_options.requestStream === true && _options.responseStream === true)
      return this._sendBidirectionalStreamRequest(path, value, _options)

    // unexpected request type
    else
      throw new Error("unexpected request type")
  }
}

module.exports = PelerinClient
