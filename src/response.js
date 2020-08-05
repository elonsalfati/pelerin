const serializers = require("./serializers")

/**
 * Define the pelerin response object,
 * from the callback data
 */
class Response {
  /**
   * Initialize pelerin response.
   *
   * @param {Function} grpcCallback - gRPC callback.
   */
  constructor(grpcCallback) {
    this._grpcCallback = grpcCallback
  }

  /**
   * Responde with the object to the gRPC call.
   *
   * @param {object} obj - Data to send.
   */
  send(obj) {
    // responde to the request
    this._grpcCallback(
      null,
      serializers.valueFromJs(obj)
    )
  }
}

module.exports = Response
