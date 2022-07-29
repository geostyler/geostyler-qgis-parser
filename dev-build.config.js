const webpack = require("webpack");
const path = require('path');
require("@babel/polyfill");

module.exports = {
  entry: [
    path.join(__dirname, "src", "QGISStyleParser.ts")
  ],
  output: {
    filename: "qgisStyleParser.js",
    path: path.join(__dirname, "browser"),
    library: "GeoStylerQGISParser"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.ts$/,
        include: path.join(__dirname, "src"),
        loader: "awesome-typescript-loader"
      },
    ]
  },
  plugins: [
  ]
};
