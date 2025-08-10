const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: './src/renderer/index.tsx',
	target: 'electron-renderer',
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
							configFile: 'tsconfig.renderer.json'
						}
					}
				]
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.(png|jpe?g|gif|svg|ico)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/images/[name][ext]'
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]'
				}
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
		alias: {
			'@renderer': path.resolve(__dirname, 'src/renderer'),
			'@shared': path.resolve(__dirname, 'src/shared'),
			'@ai': path.resolve(__dirname, 'src/ai'),
			'@core': path.resolve(__dirname, 'src/core')
		}
	},
	output: {
		path: path.resolve(__dirname, '.webpack/renderer'),
		filename: '[name].bundle.js',
		publicPath: './'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/renderer/index.html',
			minify: process.env.NODE_ENV === 'production'
		}),
	],
	externals: {
		'vscode': 'commonjs2 vscode'
	},
	optimization: {
		minimize: process.env.NODE_ENV === 'production',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},
	performance: {
		hints: process.env.NODE_ENV === 'production' ? 'warning' : false
	},
	devServer: {
		port: 3000,
		hot: true,
	}
};
