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
}).listen(2043);