/* eslint-disable node/no-unpublished-require */
/*
 * Copyright © 2020 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const cleanOptions = {
  verbose: false,
  dry: false,
};

const webpackConfig = {
  context: __dirname,
  mode: 'development',
  entry: {
    server: ['@babel/polyfill', './server.js'],
  },
  output: {
    filename: 'index.js',
    path: __dirname + '/packaged/server_dist/',
    publicPath: '/packaged/server_dist/',
  },
  plugins: [
    new CleanWebpackPlugin(cleanOptions),
    new CaseSensitivePathsPlugin(),
    new CopyWebpackPlugin([
      {
        from: './graphql/schema',
        to: './graphql/schema',
      },
      {
        from: './server/config/**/*.json',
        to: '.',
      },
      {
        from: './server/config/**/*.key',
        to: '.',
      },
    ]),
  ],
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this, __dirname
    __filename: false, // and __filename return blank or /
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.m?js/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  optimization: {
    nodeEnv: false, // without this, webpack will replace all the process.env.NODE_ENV value to the mode of the build
  },
  stats: {
    warnings: false,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.json'],
    alias: {
      server: __dirname + '/server',
      gql: __dirname + '/graphql',
    },
  },
};

module.exports = webpackConfig;
