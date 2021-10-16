const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
   devServer: {
    static: {
      directory: path.join(__dirname, ''),
    },
    compress: true,
    port: 9090,
  },
  plugins: [
     new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ]
};