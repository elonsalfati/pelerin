const grpc = require("grpc")
const utils = require("./utils")
const Request = require("./request")
const Response = require("./response")

/**
 * Pelerin server provides an HTTP/2 and gRPC based
 * web server that is easy to use and secure by default.
 */
class Pelerin {
  /**
   * Initialize the pelerin server
   */
  constructor(opts = {}) {
    // set the server options
    this.options = utils.getDefaultOptions(opts)

    // initialize the grpc server
    this.server = new grpc.Server()

    // internal server description
    this._description = {}

    // internal chains
    this._globalchains = []
  }

  /**
   * Returns the handler.
   *
   * @param {Function} - User's callback.
   * @returns {Function} - Handler.
   */
  _generateHandler(callback) {
    return async (call, grpcCallback) => {
      return callback(
        new Request(call),
        new Response(call, grpcCallback),
        () => { } // next execution function
      )
    }
  }

  /**
   * Adds a global middleware to the chain.
   *
   * @param {Function} callback - middleware function.
   * @returns {object} - this
   */
  _chainGlobalMiddleware(callback) {
    // generate the handler
    const handler = this._generateHandler(callback)

    // push to global chains for future embedding
    this._globalchains.push(handler)

    // chain to existing definitions
    for (const [serviceName, handlers] of Object.entries(this._description)) {
      for (const handlerName of Object.keys(handlers)) {
        this._description[serviceName][handlerName].chains.push(handler)
      }
    }
  }

  /**
   * Add a service and a handler to the description.
   *
   * @param {string} path - The path to the service and handler.
   * @param {Function} callback - Handler.
   * @returns {object} - this
   */
  _chainHandlerWithCallback(path, callback) {
    // generate the handler
    const handler = this._generateHandler(callback)

    // split the service path
    const splittedPath = path.split("/")

    // check if provided path is valid
    if (splittedPath.length === 2) {
      // get service and handler names
      const [serviceName, handlerName] = splittedPath

      // create service and handlers if missing
      if (!this._description[serviceName]) this._description[serviceName] = {}
      if (!this._description[serviceName][handlerName]) this._description[serviceName][handlerName] = {
        chains: [],
        options: {}
      }

      // append global chains
      if (this._globalchains.length) {
        this._description[serviceName][handlerName].chains.push(...this._globalchains)
        this._globalchains = []
      }

      // chain handler
      this._description[serviceName][handlerName].chains.push(handler)
    } else {
      throw new Error("path must be of the following structure {serviceName}/{handlerName}")
    }
  }

  /**
   * Add an handler with special settings.
   *
   * @param {string} path - THe path to the service and handler.
   * @param {object} settings - Endpoint settings.
   * @param {Function} callback - Handler.
   * @returns {object} - this
   */
  _chainHandlerWithSettings(path, settings, callback) {
    // chain handler
    this._chainHandlerWithCallback(path, callback)

    // get service and handler name
    const [serviceName, handlerName] = path.split("/")

    // append settings
    this._description[serviceName][handlerName].options = {
      ...this._description[serviceName][handlerName].options,
      ...settings
    }
  }

  /**
   * Chain another middleware or service to the server.
   */
  chain() {
    // get the amount of arguments
    const argumentsLen = arguments.length

    // recieve only callback - global middleware
    if (argumentsLen === 1 && utils.isFunction(arguments[0]))
      return this._chainGlobalMiddleware(...arguments)

    // receive path and callback
    else if (argumentsLen === 2 && arguments[0].constructor === String && utils.isFunction(arguments[1]))
      return this._chainHandlerWithCallback(...arguments)

    // receive path, settings, and callback
    else if (argumentsLen === 3 && arguments[0].constructor === String && arguments[1].constructor === Object && utils.isFunction(arguments[2]))
      return this._chainHandlerWithSettings(...arguments)

    // unexpected attributes
    throw new Error("unexpected values to chain function")
  }

  /**
   * Sign the services and handlers.
   */
  _signServices() {
    // map services
    for (const [serviceName, handlers] of Object.entries(this._description)) {
      const service = {}
      const executions = {}

      // for each handler define the service and executions
      for (const [handlerName, handlerDef] of Object.entries(handlers)) {
        // define the service definition
        service[handlerName] = {
          ...utils.getDefaultServiceDefinition(),
          ...this._description[serviceName][handlerName].options,
          path: `/${this.options.protoName}.${serviceName}/${handlerName}`
        }

        // set execution map
        executions[handlerName] = (call, callback) => {
          for (const cb of handlerDef.chains) {
            cb(call, callback)
          }
        }
      }

      // add service
      this.server.addService(service, executions)
    }
  }

  /**
   * Bind the host and port.
   *
   * @param {Number} port - The port number.
   * @param {string} host - The host.
   */
  bind(port, host = "0.0.0.0") {
    // sign the services
    this._signServices()

    // bind the server
    this.server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure())
    this.server.start()

    // resolve the bind
    return Promise.resolve({ port, host })
  }
}

// export pelerin class
module.exports = Pelerin
