const baseConfig = require('./webpack.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
require("@babel/polyfill");

module.exports = {
  ...baseConfig,
  mode: 'production',
  entry: ["@babel/polyfill", "./src/QGISStyleParser.ts"],
  plugins: [
    new UglifyJsPlugin()
  ]
};
