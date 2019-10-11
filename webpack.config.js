var path = require('path');

module.exports = {
  mode: 'development',
  entry: './js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }, 
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: false,
    port: 9000
  }
};