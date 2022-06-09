const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
	mode: 'production',
	entry: [
		'./src/index.js'
	],
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'ssapi-wrapper.js',
		library: 'SSAPI',
		libraryTarget: 'umd',
		globalObject: 'this'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [/src/],
				use: {
					loader: 'babel-loader',
					options: {
						plugins: [
							'@babel/plugin-proposal-optional-chaining',
							'@babel/plugin-proposal-class-properties'
						],
						presets: [['@babel/preset-env']]
					}
				}
			}
		]
	},

	stats: {
		colors: true
	},
	devtool: 'source-map'
};