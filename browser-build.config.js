const TerserPlugin = require('terser-webpack-plugin');
require("@babel/polyfill");

module.exports = {
  entry: [
    "@babel/polyfill",
    "./src/QGISStyleParser.ts"
  ],
  mode: 'production',
  output: {
    filename: "qgisStyleParser.js",
    path: __dirname + "/browser",
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
      include: __dirname + '/src',
      use: [{
        loader: require.resolve('ts-loader'),
      }]
    }]
  }
};
