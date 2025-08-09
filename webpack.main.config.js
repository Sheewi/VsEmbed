const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: './src/main/main.ts',
	target: 'electron-main',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
	},
	node: {
		__dirname: false,
		__filename: false,
	},
	externals: {
		'electron': 'commonjs2 electron',
		'dockerode': 'commonjs2 dockerode',
	},
};
