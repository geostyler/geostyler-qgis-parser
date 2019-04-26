const baseConfig = require('./webpack.config');
const TerserPlugin = require('terser-webpack-plugin');
require("@babel/polyfill");

module.exports = {
  ...baseConfig,
  mode: 'production',
  entry: ["@babel/polyfill", "./src/QGISStyleParser.ts"],
  plugins: [
    new TerserPlugin()
  ]
};
