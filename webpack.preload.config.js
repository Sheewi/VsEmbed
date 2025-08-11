const path = require('path');

module.exports = {
  target: 'electron-preload',
  mode: process.env.NODE_ENV || 'development',
  entry: './src/preload/preload.ts',
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: 'tsconfig.main.json'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, '.webpack/preload'),
    filename: 'preload.js',
    clean: true
  },
  externals: {
    electron: 'commonjs2 electron'
  }
};
