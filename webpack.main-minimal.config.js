const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/main/main-minimal.ts',
  target: 'electron-main',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'tsconfig.main.json'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, '.webpack/main-minimal'),
    filename: 'index.js'
  },
  externals: {
    electron: 'commonjs2 electron'
  },
  node: {
    __dirname: false,
    __filename: false
  }
};
