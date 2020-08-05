const utils = require("./utils")
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
exports.ServerReadableStream = async (call, grpcCallback, callback) => {
  console.log(call)
  const itr = utils.stream.call(call)
  for await (const i of itr) {
    console.log(i.body)
  }

  // // process incoming messages
  // call.on("data", (request) => {
  //   const req = new Request({ request })
  //   console.log(req.body)
  // })

  // call.on("end", () => {
  //   callback(
  //     new Request({ request }),
  //     new Response(grpcCallback),
  //     () => { } // next execution function
  //   )
  // })
}

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
