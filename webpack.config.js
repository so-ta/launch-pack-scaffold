'use strict';

const path = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  webpack = require('webpack');

const workDirectory = path.join(__dirname);

// 開発環境がproductionの場合はproductionモードで起動
const isProduction = process.env.NODE_ENV === 'production';

module.exports = [{
  mode: isProduction ? 'production' : 'development',
  entry: {
    'index': ["@babel/polyfill", path.join(workDirectory, 'src', 'scripts', 'entry.js')]
  },
  output: {
    path: path.join(workDirectory, 'public', 'scripts'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            compact: isProduction
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}, {
  mode: isProduction ? 'production' : 'development',
  entry: {
    'style': path.join(workDirectory, 'src', 'styles', 'entry.scss')
  },
  output: {
    path: path.join(workDirectory, 'public', 'styles'),
    filename: '[name].css'
  },
  devtool: isProduction ? '' : 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
                url: false,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction,
                plugins: [
                  require('cssnano')({
                    preset: 'default',
                  })
                ]
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
              }
            }
          ],
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.join(workDirectory, 'src', 'images'),
        to: path.join(workDirectory, 'public', 'images')
      }]
    }),
    // new CopyWebpackPlugin([{
    //   from: path.join(workDirectory, 'src', 'favicon.ico'),
    //   to: path.join(workDirectory, 'public', 'favicon.ico')
    // }]),
  ]
}];
