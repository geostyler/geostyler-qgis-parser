const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
require("@babel/polyfill");

module.exports = {
  entry: [
    "@babel/polyfill",
    path.join(__dirname, "src", "QGISStyleParser.ts")
  ],
  mode: 'production',
  output: {
    filename: "qgisStyleParser.js",
    path: path.join(__dirname, "browser"),
    library: "GeoStylerQGISParser"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".js", ".json"]
  },
  optimization: {
    minimizer: [
      new TerserPlugin()
    ]
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: path.join(__dirname, 'src'),
      use: [
        {
          loader: require.resolve('babel-loader')
        }
      ]
    }]
  }
};
