// import pelerin client
const { client } = require("../../")

// send dynamic data
client()
  .send("localhost:3000/Greeter/SayHello", { name: "pelerin" })
  .then((response) => console.log(response))
  .catch((err) => console.error(err))

