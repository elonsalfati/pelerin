// import pelerin
const Pelerin = require("../../")

// initialize the server
const server = new Pelerin()

// set service and handler
server.chain("Greeter/SayHello", (req, res) => res.send({ message: `Hello, ${req.body.name}` }))

// bind the server
server.bind(3000).then(() => console.log("server is running on port 3000"))
