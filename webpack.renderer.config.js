const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: './src/renderer/index.tsx',
	target: 'electron-renderer',
	devtool: isProduction ? false : 'source-map',
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
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							sourceMap: !isProduction
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: !isProduction
						}
					}
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 3,
							sourceMap: !isProduction
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: !isProduction
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: !isProduction
						}
					}
				]
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
		...(isProduction ? [
			new MiniCssExtractPlugin({
				filename: 'styles/[name].[contenthash].css',
				chunkFilename: 'styles/[id].[contenthash].css',
			})
		] : [])
	],
	externals: {
		'vscode': 'commonjs2 vscode'
	},
	optimization: {
		minimize: process.env.NODE_ENV === 'production',
		minimizer: [
			'...',
			...(isProduction ? [new CssMinimizerPlugin()] : [])
		],
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				},
				styles: {
					name: 'styles',
					type: 'css/mini-extract',
					chunks: 'all',
					enforce: true,
				},
			}
		}
	},
	performance: {
		hints: process.env.NODE_ENV === 'production' ? 'warning' : false
	},
	devServer: {
		port: 3000,
		hot: true,
		static: {
			directory: path.join(__dirname, '.webpack/renderer'),
		},
		compress: true,
		open: false,
		historyApiFallback: true,
		allowedHosts: 'all',
	}
};
