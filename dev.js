#!/usr/bin/env node

//require("typescript/bin/tsc");
const fs = require("fs");
const path = require("path");
const child = require("child_process").execSync;

const walkSync = (d) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map((f) => walkSync(path.join(d, f))) && fs.rmdirSync(d) : fs.unlinkSync(d);
walkSync(path.join(__dirname, "intermediates"));
fs.mkdirSync(path.join(__dirname, "intermediates"));
child("node " + path.join(__dirname, "/node_modules/typescript/bin/tsc"),
  (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    if (error) console.error("[child process] error: " + error);
  }
);

require("webpack/bin/webpack.js");

const vfs = require("vinyl-fs");
const map = require("map-stream");
const pug = require("pug");

vfs.src("src/**/*.pug")
  .pipe(map((data, callback) => {
    data.contents = new Buffer.from(pug.renderFile(data.path));
    data.path = data.path.substring(0, data.path.length - 3) + "html";
    callback(null, data);
  }))
  .pipe(vfs.dest("public"));