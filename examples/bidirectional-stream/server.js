// import pelerin
const Pelerin = require("../../")

// initialize server
const server = new Pelerin()

// set service and handler
server.chain("Greeter/SayHelloBidi", { requestStream: true, responseStream: true }, async (req, res) => {
  let names = []

  // process incoming messages
  for await (const data of req.body) {
    console.log("got data", data.body)

    // append names
    names.push(data.body.name)

    // send response
    res.send({ message: `Got ${names.length} names` })
  }

  res.finish()
})


// bind the server
server.bind(3000).then(() => console.log("server is running on port 3000"))
