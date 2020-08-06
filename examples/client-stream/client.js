// import pelerin client
const { client } = require("../../")

// init clients
const instance = client()

// send requests
instance.send("localhost:3000/Greeter/SayHelloReqStream", { name: "pelerin_1" }, { requestStream: true })
instance.send("localhost:3000/Greeter/SayHelloReqStream", { name: "pelerin_2" }, { requestStream: true })
instance.send("localhost:3000/Greeter/SayHelloReqStream", { name: "pelerin_3" }, { requestStream: true })

// finish stream
instance
  .finish()
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
