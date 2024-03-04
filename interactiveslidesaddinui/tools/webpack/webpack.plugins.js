const webpack = require('webpack');
const { inDev } = require('./webpack.helpers');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const {publicPath} = require("./webpack.helpers");

const variables = {
  'process.env.ASSET_PATH': JSON.stringify(publicPath()),
}

for (const key in process.env) {
  if (key.startsWith('REACT_APP_')) {
    variables[`process.env.${key}`] = JSON.stringify(process.env[key])
  }
}

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  inDev() && new webpack.HotModuleReplacementPlugin(),
  inDev() && new ReactRefreshWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: inDev() ? 'src/dev.html' : 'src/index.html',
    favicon: 'assets/images/favicon.ico',
    inject: true,
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    chunkFilename: '[name].[chunkhash].chunk.css',
  }),
  new WebpackManifestPlugin({
    publicPath: publicPath(),
  }),
  new webpack.DefinePlugin(variables),

].filter(Boolean);
