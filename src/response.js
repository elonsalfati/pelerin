const serializers = require("./serializers")

/**
 * Define the pelerin response object,
 * from the callback data
 */
class Response {
  /**
   * Initialize pelerin response.
   *
   * @param {object} call - The gRPC call.
   * @param {Function} grpcCallback - gRPC callback.
   */
  constructor(call, grpcCallback) {
    this._call = call
    this._grpcCallback = grpcCallback
  }

  /**
   * Responde with the object to the gRPC call.
   *
   * @param {object} obj - Data to send.
   */
  send(obj) {
    const { name } = this._call.constructor
    const value = serializers.valueFromJs(obj)

    switch (name) {
      case "ServerUnaryCall":
      case "ServerReadableStream":
        return this._grpcCallback(
          null,
          value
        )

      case "ServerWritableStream":
      case "ServerDuplexStream":
        return this._call.write(value)

      default:
        break
    }
  }

  /**
   * Finish write stream.
   */
  finish() {
    const { name } = this._call.constructor

    if (["ServerWritableStream", "ServerDuplexStream"].includes(name)) {
      this._call.end()
    }
  }
}

module.exports = Response
