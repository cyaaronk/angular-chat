const path = require("path");

module.exports = {
  entry: path.join(__dirname, "intermediates", "app", "main.js"),
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js"
  },
  mode: "development"
}