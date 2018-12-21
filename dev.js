#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const pug = require("pug");

const walkSync = (dir, fn1, fn2, minDepth, maxDepth) => {
  if (!Number.isInteger(maxDepth) || maxDepth >= 0) {
    if (fs.statSync(dir).isDirectory()) {
      fs.readdirSync(dir).map((f) => walkSync(path.join(dir, f), fn1, fn2, Number.isInteger(minDepth)? minDepth-1 : null, Number.isInteger(maxDepth)? maxDepth-1 : null));
      if (!Number.isInteger(minDepth) || minDepth <= 0) fn1(dir);
    }
    else if (!Number.isInteger(minDepth) || minDepth <= 0) fn2(dir);
  }
}
//Delete and create new ./intermediates
if (fs.existsSync(path.join(__dirname, "intermediates"))) walkSync(path.join(__dirname, "intermediates"), (d) => fs.rmdirSync(d), (d) => fs.unlinkSync(d));
fs.mkdirSync(path.join(__dirname, "intermediates"));
walkSync(path.join(__dirname, "src"), (d) => d, (d) => {
  // Copy non-root(source root = ./src) css and html files to ./intermediates
  if (d.substr(d.length - 4) == ".css" || d.substr(d.length - 5) == ".html") {
    fs.mkdirSync(path.join(__dirname, "intermediates", d.substr(0, d.indexOf(path.parse(d).base)).substr(d.search(/(\\|\/)src(\\|\/)/))), {recursive: true});
    fs.copyFileSync(d, path.join(__dirname, "intermediates", d.substr(d.search(/(\\|\/)src(\\|\/)/))));
  }
  // Process non-root(source root = ./src) pug files and save its html format in ./intermediates
  else if (d.substr(d.length - 4) == ".pug") {
    fs.mkdirSync(path.join(__dirname, "intermediates", d.substr(0, d.indexOf(path.parse(d).base)).substr(d.search(/(\\|\/)src(\\|\/)/))), {recursive: true});
    fs.writeFileSync(path.join(__dirname, "intermediates", d.substr(0, d.length - 3).substr(d.search(/(\\|\/)src(\\|\/)/)) + "html"), Buffer.from(pug.renderFile(d)));
  }
}, 2);

const sass = require('sass/sass.dart.js');

// Process non-root(source root = ./src) scss files and save its css format in ./intermediates
walkSync(path.join(__dirname, "src"), (d) => {
  fs.mkdirSync(path.join(__dirname, "intermediates", "src", path.parse(d).base), {recursive: true});
  sass.run_([d + ":" + path.join(__dirname, "intermediates", "src", path.parse(d).base), "--no-source-map"]);
}, (d) => d, 1, 1);

//require("typescript/bin/tsc");
const child = require("child_process").execSync;

// Process ts files in ./src and save its js format in ./intermediates, the resulting file has extension .js.tsc.
child("node " + path.join(__dirname, "/node_modules/typescript/bin/tsc"), {stdio: ["pipe", "inherit", "pipe"]});
walkSync(path.join(__dirname, "intermediates"), (d) => d, (d) => d.substr(d.length - 3) == ".js" && fs.renameSync(d, d + ".tsc"));

const atl = require("angular2-template-loader");

// Process .js.tsc files in ./intermediates for angular 2 templates, save the result as .js.
walkSync(path.join(__dirname, "intermediates"), (d) => d, (d) => d.substr(d.length - 4) == ".tsc" && fs.writeFileSync(d.substring(0, d.length - 4), Buffer.from(atl(fs.readFileSync(d).toString()))));

require("webpack/bin/webpack.js");

// Process ./src root scss files and save its css format in ./public 
walkSync(path.join(__dirname, "src"), (d) => d, (d) => d.substr(d.length - 5) == ".scss" && sass.run_([d + ":" + path.join(__dirname, "public", path.parse(d).base.slice(0, -4)) + "css", "--no-source-map"]), null, 1);

// const vfs = require("vinyl-fs");
// const map = require("map-stream");
// const pug = require("pug");

// vfs.src("src/**/*.pug")
//   .pipe(map((data, callback) => {
//     data.contents = Buffer.from(pug.renderFile(data.path));
//     data.path = data.path.substring(0, data.path.length - 3) + "html";
//     callback(null, data);
//   }))
//   .pipe(vfs.dest("public"));

// Process ./src root pug files and save its html format in ./public 
walkSync(path.join(__dirname, "src"), (d) => d, (d) => d.substr(d.length - 4) == ".pug" && fs.writeFileSync(path.join(__dirname, "public", path.parse(d).base.slice(0,-3) + "html"), Buffer.from(pug.renderFile(d))), null, 1);