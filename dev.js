#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const walkSync = (d, fn1, fn2) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map((f) => walkSync(path.join(d, f), fn1, fn2)) && fn1(d) : fn2(d);
if (fs.existsSync(path.join(__dirname, "intermediates"))) walkSync(path.join(__dirname, "intermediates"), (d) => fs.rmdirSync(d), (d) => fs.unlinkSync(d));
fs.mkdirSync(path.join(__dirname, "intermediates"));
walkSync(path.join(__dirname, "src"), (d) => d, (d) => d);
walkSync(path.join(__dirname, "src"), (d) => d, (d) => {
  if (d.substr(d.length - 4) == ".css" || d.substr(d.length - 5) == ".html") {
    fs.mkdirSync(path.join(__dirname, "intermediates", d.substr(0, d.indexOf(path.parse(d).base)).substr(d.search(/(\\|\/)src(\\|\/)/))), {recursive: true});
    fs.copyFileSync(d, path.join(__dirname, "intermediates", d.substr(d.search(/(\\|\/)src(\\|\/)/))));
  }
});

//require("typescript/bin/tsc");
const child = require("child_process").execSync;

child("node " + path.join(__dirname, "/node_modules/typescript/bin/tsc"), {stdio: ["pipe", "inherit", "pipe"]});
walkSync(path.join(__dirname, "intermediates"), (d) => d, (d) => d.substr(d.length - 3) == ".js" && fs.renameSync(d, d + ".tsc"));

const atl = require("angular2-template-loader");

walkSync(path.join(__dirname, "intermediates"), (d) => d, (d) => d.substr(d.length - 4) == ".tsc" && fs.writeFileSync(d.substring(0, d.length - 4), Buffer.from(atl(fs.readFileSync(d).toString()))));

require("webpack/bin/webpack.js");

// const vfs = require("vinyl-fs");
// const map = require("map-stream");
const pug = require("pug");

// vfs.src("src/**/*.pug")
//   .pipe(map((data, callback) => {
//     data.contents = Buffer.from(pug.renderFile(data.path));
//     data.path = data.path.substring(0, data.path.length - 3) + "html";
//     callback(null, data);
//   }))
//   .pipe(vfs.dest("public"));
walkSync(path.join(__dirname, "src"), (d) => d, (d) => d.substr(d.length - 4) == ".pug" && fs.writeFileSync(path.join(__dirname, "public", path.parse(d).base.slice(0,-3) + "html"), Buffer.from(pug.renderFile(d))));