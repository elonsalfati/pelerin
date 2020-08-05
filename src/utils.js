const serializers = require("./serializers")
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
