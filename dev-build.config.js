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
    extensions: [".ts", ".js", ".json"],
    fallback: {
      buffer: false,
      fs: false,
      path: false
    }
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
  },
  plugins: [
  ]
};
