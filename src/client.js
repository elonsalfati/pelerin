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
   * Send unary request to the server.
   *
   * @param {string} path - The endpoint path.
   * @param {object} value - Serialized object request.
   */
  _sendUnaryRequest(path, value) {
    // get target names
    const [, , handlerName] = path.split("/")

    // return new promise with the results
    return new Promise((resolve, reject) => {
      // execute grpc request and promisify callback
      this.client[handlerName](value, (err, response) => {
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
   */
  _sendServerStreamRequest(path, value) {
    // get target names
    const [, , handlerName] = path.split("/")

    // execute request
    const call = this.client[handlerName](value)

    // resolve stream
    return Promise.resolve(
      utils.stream.call(call)
    )
  }

  _sendClientStreamRequest(path, value) {}

  _sendBidirectionalStreamRequest(path, value) {}

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
      return this._sendUnaryRequest(path, value)

    // server stream
    else if (_options.requestStream === false && _options.responseStream === true)
      return this._sendServerStreamRequest(path, value)

    // client stream
    else if (_options.requestStream === true && _options.responseStream === false)
      return this._sendClientStreamRequest(path, value)

    // bidirectional stream
    else if (_options.requestStream === true && _options.responseStream === true)
      return this._sendBidirectionalStreamRequest(path, value)

    // unexpected request type
    else
      throw new Error("unexpected request type")
  }
}

module.exports = PelerinClient
