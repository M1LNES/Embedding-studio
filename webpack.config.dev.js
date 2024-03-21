const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.config')
const path = require('path')
module.exports = merge(commonConfig, {
	entry: [
		path.resolve(__dirname, './client/src/index.js'),
		'webpack-hot-middleware/client?quiet=true',
	],
	mode: 'development',
	devtool: 'source-map',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
	],
})
