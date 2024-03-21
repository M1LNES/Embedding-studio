const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: path.resolve(__dirname, './client/src/index.js'),
	target: 'web',
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: { presets: ['@babel/env', '@babel/preset-react'] },
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
					},
				],
			},
		],
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/',
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: 'initial',
					name: 'vendor',
					test: /node_modules/,
					enforce: true,
				},
			},
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, './client/public/index.html'),
		}),
		new webpack.DefinePlugin({
			'process.env.ENVIRONMENT_NAME': JSON.stringify(
				process.env.ENVIRONMENT_NAME
			),
		}),
	],
}

