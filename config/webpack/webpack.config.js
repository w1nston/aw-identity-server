const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  const isProd = String(env.NODE_ENV) === 'production';
  return {
    context: path.join(__dirname, '../../'),
    devtool: isProd ? null : 'source-map',
    devServer: {
      contentBase: path.join(__dirname, '../../public'),
      compress: true,
      port: 3000,
    },
    entry: {
      app: ['./src/client/index.js'],
    },
    output: {
      path: path.join(__dirname, '../../public'),
      publicPath: '/',
      filename: '[name].[contenthash].js',
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
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin('public'),
      new HtmlWebpackPlugin({
        title: 'Login',
        template: './view/index.html',
      }),
    ],
  };
};
