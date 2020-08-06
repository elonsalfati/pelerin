// import pelerin client
const { client } = require("../../")

// send request to server
client()
  .send("localhost:3000/Greeter/SayHelloResStream", { name: "pelerin" }, { responseStream: true })
  .then(async (response) => {
    for await (const data of response) {
      console.log(data.body)
    }
  })
