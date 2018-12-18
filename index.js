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
  else if (req.url == "/bundle.js") {
    console.log("bundle.js found！");
    fs.createReadStream(path.join(__dirname, "public", "bundle.js")).pipe(res);
  }
  else {
    res.writeHead(404);
    res.end();
  }
}).listen(2043);