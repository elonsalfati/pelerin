
/**
 * Define the pelerin request built
 * from the grpc call.request
 */
class Request {
  /**
   * Initialize the pelerin request.
   *
   * @param {object} grpcCall - gRPC Call.
   */
  constructor(grpcCall) {
    // raw request
    this._rawCall = grpcCall
    this._rawReq = grpcCall.request
  }

  /**
   * Returns the javascript object
   * from the gRPC request.
   */
  get body() {
    return this._rawReq.toJavaScript()
  }
}

module.exports = Request
