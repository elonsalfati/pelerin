// export default Pelerin server
const Pelerin = module.exports = require("./server")

// export client
const PelerinClient = require("./client")
Pelerin.client = (opt = {}) => new PelerinClient(opt)

// export router
Pelerin.Router = require("./router")
