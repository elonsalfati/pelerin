// import pelerin
const Pelerin = require("../../")

// initialize server
const server = new Pelerin()

// set service and handler
server.chain("Greeter/SayHelloResStream", { responseStream: true }, (req, res) => {
  // send to client 5 hellos
  for (let i = 0; i < 5; i++) {
    res.send({ message: `Hello ${req.body.name}` })
  }

  // finish stream
  res.finish()
})

// bind the server
server.bind(3000).then(() => console.log("server is running on port 3000"))
