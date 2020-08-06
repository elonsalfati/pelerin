// import pelerin
const Pelerin = require("../../")

// initialize server
const server = new Pelerin()

// set service and handler
server.chain("Greeter/SayHelloReqStream", { requestStream: true }, async (req, res) => {
  let names = []

  // process incoming messages
  for await (const data of req.body) {
    names.push(data.body.name)
  }

  // send response
  res.send({ message: names.map((n) => `Hello, ${n}`) })
})


// bind the server
server.bind(3000).then(() => console.log("server is running on port 3000"))
