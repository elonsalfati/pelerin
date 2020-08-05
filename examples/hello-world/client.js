// var services = require("./proto/helloworld_grpc_pb")
// var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');

// var grpc = require('grpc');

// function main() {
//   var client = new services.GreeterClient('localhost:3000', grpc.credentials.createInsecure());

//   const request = google_protobuf_struct_pb.Value.fromJavaScript({ name: "foo" })
//   client.sayHello(request, function (err, response) {
//     console.log("error", err)
//     console.log('Greeting:', response.toJavaScript());
//   });
// }

// main();

// import pelerin client
const { PelerinClient } = require("../../")

// send dynamic data
const client = () => new PelerinClient()

client()
  .send("Greeter/SayHello", { name: "pelerin" })
  .then((response) => console.log(response))
  .catch((err) => console.error(err))

