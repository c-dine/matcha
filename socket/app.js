// const io = require("socket.io")(httpServer, {
//   cors: {
//     origin: "ws://localhost/socket",
//     methods: ["GET", "POST"]
//   }
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//     io.emit("chat message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3002, () => {
  console.log('Server started on port 3002');
});


