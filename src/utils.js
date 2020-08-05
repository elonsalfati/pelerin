const Request = require("./request")
const serializers = require("./serializers")
const { EventIterator } = require("event-iterator")
const googleProtobufStructPb = require("google-protobuf/google/protobuf/struct_pb.js")

/**
 * Get default and extended options.
 *
 * @param {object} opts - Extended options.
 * @returns {object} - Server options.
 */
exports.getDefaultOptions = (opts = {}) => ({
  protoName: "pelerin",
  ...opts
})

/**
 * Check if argument is a function or async function.
 *
 * @param {*} arg - Argument to check.
 * @returns {boolean}
 */
exports.isFunction = (arg) => {
  if (arg && arg.constructor) {
    return ["Function", "AsyncFunction"].includes(arg.constructor.name)
  }

  return false
}

/**
 * Convert event emitter to itreator.
 */
function stream() {
  return new EventIterator(
    queue => {
      // add push request
      queue.pushRequest = (call) => queue.push(new Request(call))

      this.addListener("data", queue.pushRequest)
      this.addListener("end", queue.stop)
      this.addListener("error", queue.fail)

      queue.on("highWater", () => this.pause())
      queue.on("lowWater", () => this.resume())

      return () => {
        this.removeListener("data", queue.pushRequest)
        this.removeListener("close", queue.stop)
        this.removeListener("end", queue.stop)
        this.removeListener("error", queue.fail)
        this.destroy()
      }
    }
  )
}

// export stream
exports.stream = stream

/**
 * Returns the default service definition.
 *
 * @returns {object} - Default service definition.
 */
exports.getDefaultServiceDefinition = () => ({
  requestStream: false,
  responseStream: false,
  requestType: googleProtobufStructPb.Value,
  responseType: googleProtobufStructPb.Value,
  requestSerialize: serializers.serializeDynamicValue,
  requestDeserialize: serializers.deserializeDynamicValue,
  responseSerialize: serializers.serializeDynamicValue,
  responseDeserialize: serializers.deserializeDynamicValue,
})
