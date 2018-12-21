#!/usr/bin/env node

const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  console.log("Request received from " + req.headers.host);
  if (req.url == "/" || req.url == "/index.html") {
    console.log("index.html found！");
    fs.createReadStream(path.join(__dirname, "public", "index.html")).pipe(res);
  }
  else if (req.url == "/index.css") {
    console.log("index.css found！");
    fs.createReadStream(path.join(__dirname, "public", "index.css")).pipe(res);
  }
  else if (req.url == "/polyfills.bundle.js") {
    console.log("polyfills.bundle.js found！");
    fs.createReadStream(path.join(__dirname, "public", "polyfills.bundle.js")).pipe(res);
  }
  else if (req.url == "/app.bundle.js") {
    console.log("app.bundle.js found！");
    fs.createReadStream(path.join(__dirname, "public", "app.bundle.js")).pipe(res);
  }
  else {
    res.writeHead(404);
    res.end();
  }
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("a user connected to socket.io!");
  socket.on("chat message", (msg) => {
    console.log("a user sent a message to socket.io. Broadcast it to everyone: " + msg);
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => console.log("a user disconnected from socket.io!"));
});

server.listen(2043);