const Request = require("./request")
const Response = require("./response")

/**
 * Handler ServerUnaryCall requests.
 *
 * @param {object} call - gRPC call object.
 * @param {Function} grpcCallback - The callback from the gRPC server.
 * @param {Function} callback - The user's callback.
 */
exports.ServerUnaryCall = (call, grpcCallback, callback) => {
  return callback(
    new Request(call),
    new Response(grpcCallback),
    () => { } // next execution function
  )
}

/**
 * Handler ServerReadableStream requests.
 *
 * @param {object} call - gRPC call object.
 * @param {Function} grpcCallback - The callback from the gRPC server.
 * @param {Function} callback - The user's callback.
 */
exports.ServerReadableStream = (call, grpcCallback, callback) => {}

/**
 * Handler ServerWritableStream requests.
 *
 * @param {object} call - gRPC call object.
 * @param {Function} grpcCallback - The callback from the gRPC server.
 * @param {Function} callback - The user's callback.
 */
exports.ServerWritableStream = (call, grpcCallback, callback) => {}

/**
 * Handler ServerDuplexStream requests.
 *
 * @param {object} call - gRPC call object.
 * @param {Function} grpcCallback - The callback from the gRPC server.
 * @param {Function} callback - The user's callback.
 */
exports.ServerDuplexStream = (call, grpcCallback, callback) => {}
