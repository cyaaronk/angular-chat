const environment = require("./environment.json");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: environment["mode"],
  entry: {
    polyfills: path.join(__dirname, "intermediates", "src", "polyfills.js"),
    app: path.join(__dirname, "intermediates", "src", "main.js")
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.join(__dirname, "/intermediates"),
        loader: "raw-loader"
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, "/intermediates"),
        loader: "raw-loader"
      }
    ]
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "[name].bundle.js"
  },
  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // if you have anymore problems tweet me at @gdi2290
      // The (\\|\/) piece accounts for path separators for Windows and MacOS
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'intermediates'), // location of your src
      {} // a map of your routes 
    )
  ]
}