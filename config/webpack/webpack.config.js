const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const webpack = require('webpack');

module.exports = env => {
  const isProd = String(env.NODE_ENV) === 'production';
  return {
    context: path.join(__dirname, '../../'),
    devtool: isProd ? null : 'source-map',
    entry: {
      app: [
        isProd ? null : 'webpack-hot-middleware/client',
        './src/client/index.jsx',
      ].filter(Boolean),
    },
    output: {
      path: path.join(__dirname, '../../public'),
      publicPath: '/',
      filename: '[name].[hash].js',
    },
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /.(js|jsx)$/,
          include: [path.join(__dirname, '../../src/client')],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['react-hot-loader/babel'],
            },
          },
        },
        {
          test: /\.js?$/,
          include: /node_modules/,
          use: ['react-hot-loader/webpack'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin('public'),
      new HtmlWebpackPlugin({
        title: 'Login',
        template: './view/index.html',
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackHarddiskPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };
};
