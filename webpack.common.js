const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
	mode: 'production',
	entry: [
		'./src/index.js'
	],
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'SSAPI.min.js',
		library: 'SSAPI',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [/src/],
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									targets: {
										ie: '11'
									}
								}
							]
						],
						plugins: [
							['@babel/plugin-transform-regenerator', {
								asyncGenerators: false,
								generators: false,
								async: true
							}]
							
						]
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