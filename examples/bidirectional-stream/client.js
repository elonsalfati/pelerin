// import pelerin client
const { client } = require("../../")

// init clients
const instance = client()

// send requests
instance.send("localhost:3000/Greeter/SayHelloBidi", { name: "pelerin_1" }, { requestStream: true, responseStream: true })
instance.send("localhost:3000/Greeter/SayHelloBidi", { name: "pelerin_2" }, { requestStream: true, responseStream: true })
instance.send("localhost:3000/Greeter/SayHelloBidi", { name: "pelerin_3" }, { requestStream: true, responseStream: true })

// read incoming messages
// NOTE: THIS MUST COME AFTER THE FIRST CALL INITIALIZE
void async function () {
  for await (const data of instance.bidiStream) {
    console.log("got this result", data.body)
  }
}()

// finish stream
setTimeout(() => { instance.finish() }, 200)
