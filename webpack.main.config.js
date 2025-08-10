const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: './src/main/main.ts',
	target: 'electron-main',
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
			},
			{
				test: /\.node$/,
				use: 'node-loader'
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@ai': path.resolve(__dirname, 'src/ai'),
			'@core': path.resolve(__dirname, 'src/core'),
			'@main': path.resolve(__dirname, 'src/main'),
			'@shared': path.resolve(__dirname, 'src/shared')
		}
	},
	output: {
		path: path.resolve(__dirname, '.webpack/main'),
		filename: 'index.js'
	},
	node: {
		__dirname: false,
		__filename: false,
	},
	externals: {
		'electron': 'commonjs2 electron',
		'dockerode': 'commonjs2 dockerode',
		'node-pty': 'commonjs2 node-pty',
		'vscode': 'commonjs2 vscode'
	},
	optimization: {
		minimize: process.env.NODE_ENV === 'production'
	}
};
