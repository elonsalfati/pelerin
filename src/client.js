const serializers = require("./serializers")

/**
 * Define the pelerin client.
 */
class PelerinClient {
  /**
   * Sends a dynamic value to a dynamic server.
   *
   * @param {string} path - The path of the service.
   * @param {object} obj - Data to send.
   * @returns {Promise}
   */
  send(obj) {
    // convert the object to a dynamic value
    const value = serializers.valueFromJs(obj)

    // return new promise with the results
    return new Promise((resolve, reject) => {

    })
  }
}

module.exports = PelerinClient
