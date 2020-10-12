'use strict';

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        sideEffects: true,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules'],
                data: `
                  $feature-flags: (
                    enable-css-custom-properties: true,
                  );
                `,
              },
            },
          },
        ],
      },
    ],
  },
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
		}),
	],
};
