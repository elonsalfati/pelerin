// import pelerin client
const { client } = require("../../")

// send dynamic data
client()
  .send(
    "localhost:3000/Greeter/SayHello",
    {
      name: "pelerin"
    },
    {
      headers: {
        Authorization: `Basic 123456`
      }
    }
  )
  .then((response) => console.log(response))
  .catch((err) => console.error(err))

