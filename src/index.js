// export default Pelerin server
const Pelerin = module.exports = require("./server")

// export client
const PelerinClient = require("./client")
Pelerin.client = (opt = {}) => new PelerinClient(opt)
