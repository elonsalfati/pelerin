const googleProtobufStructPb = require("google-protobuf/google/protobuf/struct_pb.js")

/**
 * Serialzie dynamic values.
 *
 * @param {googleProtobufStructPb.Value} arg - google.protobuf.Value instance.
 * @returns {Buffer} - Buffer value.
 * @throws {Error}
 */
exports.serializeDynamicValue = (arg) => {
  if (arg instanceof googleProtobufStructPb.Value) {
    return Buffer.from(arg.serializeBinary())
  }

  throw new Error("expected argument of type google.protobuf.Value")
}

/**
 * Deserialize dynamic values.
 *
 * @param {Buffer} buffer - Buffer instance.
 * @returns {googleProtobufStructPb.Value} - google.protobuf.Value instance.
 */
exports.deserializeDynamicValue = (buffer) => googleProtobufStructPb.Value.deserializeBinary(new Uint8Array(buffer))

/**
 * Converts javascript object to google.protobuf.Value.
 *
 * @param {object} obj - Object that will be converted to google.protobuf.Value instance.
 * @returns {googleProtobufStructPb.Value} - google.protobuf.Value instance
 */
exports.valueFromJs = (obj) => googleProtobufStructPb.Value.fromJavaScript(obj)
