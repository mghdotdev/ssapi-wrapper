const merge = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common.js');
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );

module.exports = merge(commonConfig, {
	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				extractComments: false,
				sourceMap: true,
				uglifyOptions: {
					mangle: {
						keep_fnames: true
					}
				}
			})
		]
	}
});