// import pelerin
const Pelerin = require("../../")
const handlers = require("./handlers")

// initialize the server
const server = new Pelerin()

// set service and handler
server.service("Greeter", handlers)

// bind the server
server.bind(3000).then(() => console.log("server is running on port 3000"))
