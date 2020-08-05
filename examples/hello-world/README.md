

To start the server:
```shell
node index.js
```

On another terminal, run the grpcurl request:
```shell
grpcurl \
  -plaintext \
  -import-path . \
  -proto helloworld.proto \
  -d '{"name":"elon"}' \
  localhost:3000 \
  pelerin.Greeter.SayHello
```
