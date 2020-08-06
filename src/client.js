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

      // initialize service and handlers if missing
      // if (!this._description[serviceName])
      //   this._description[serviceName] = {}

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
   * Sends a dynamic value to a dynamic server.
   *
   * @param {string} path - The path of the service.
   * @param {object} obj - Data to send.
   * @param {object} options - Custom request settings.
   * @returns {Promise}
   */
  send(path, obj, options = {}) {
    // define server
    const client = this._loadClient(path, options)

    // convert the object to a dynamic value
    const value = serializers.valueFromJs(obj)

    // get target names
    const [, , handlerName] = path.split("/")

    // return new promise with the results
    return new Promise((resolve, reject) => {
      // execute grpc request and promisify callback
      client[handlerName](value, (err, response) => {
        if (response) {
          resolve(response.toJavaScript())
        }

        reject(err)
      })
    })
  }
}

module.exports = PelerinClient
