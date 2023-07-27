//command: npx webpack
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './content_scripts/main.js',
    background: './background.js',
    popup: './popup/popup.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  resolve: {
    fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    })
  ],
  devtool: 'cheap-module-source-map'
};