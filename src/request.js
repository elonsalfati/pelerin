const utils = require("./utils")

/**
 * Define the pelerin request built
 * from the grpc call.request
 */
class Request {
  /**
   * Initialize the pelerin request.
   *
   * @param {object} call - gRPC Call.
   */
  constructor(call) {
    // raw request
    this._call = call
  }

  /**
   * Returns the metadata as headers
   *
   * @returns {object} - Headers.
   */
  get headers() {
    return this._call.metadata
  }

  /**
   * Returns the javascript object
   * from the gRPC request.
   *
   * @returns {object|EventIterator} - Body.
   */
  get body() {
    const { name } = this._call.constructor

    switch (name) {
      case "ServerUnaryCall":
      case "ServerWritableStream":
        return this._call.request.toJavaScript()

      case "ServerReadableStream":
      case "ServerDuplexStream":
        return utils.stream.call(this._call)

      default:
        if (this._call.toJavaScript)
          return this._call.toJavaScript()
    }
  }
}

module.exports = Request
