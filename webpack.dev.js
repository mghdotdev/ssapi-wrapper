const merge = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
	devtool: 'cheap-module-eval-source-map',
	mode: 'development',
	performance: {
		hints: false,
	},
	output: {
		publicPath: '/dist/'
	},
	devServer: {
		contentBase: path.join(__dirname, 'demo')
	}
});