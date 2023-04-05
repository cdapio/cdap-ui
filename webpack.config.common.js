/* eslint-disable node/no-unpublished-require */
/*
 * Copyright © 2016 Cask Data, Inc.
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
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const PnpWebpackPlugin = require('pnp-webpack-plugin');

// the clean options to use
const cleanOptions = {
  verbose: true,
  dry: false,
};
const mode = process.env.NODE_ENV || 'production';
const isModeProduction = (mode) =>
  mode === 'production' || mode === 'non-optimized-production';

const loaderExclude = [
  /node_modules/,
  /bower_components/,
  /packaged\/public\/dist/,
  /packaged\/public\/cdap_dist/,
  /packaged\/public\/common_dist/,
  /lib/,
];

const loaderExcludeStrings = [
  '/node_modules/',
  '/bower_components/',
  '/packaged/public/dist/',
  '/packaged/public/cdap_dist/',
  '/packaged/public/common_dist/',
  '/lib/',
];

const plugins = [
  new LodashModuleReplacementPlugin({
    shorthands: true,
    collections: true,
    caching: true,
    flattening: true,
  }),
  new NodePolyfillPlugin(),
  new CleanWebpackPlugin(cleanOptions),
  new CaseSensitivePathsPlugin(),
  // by default minify it.
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isModeProduction(mode)
        ? JSON.stringify('production')
        : JSON.stringify('development'),
    },
  }),
  new ESLintPlugin({
    extensions: ['js', 'jsx'],
    exclude: loaderExcludeStrings,
  }),
];

if (!isModeProduction(mode)) {
  plugins.push(
    new ForkTsCheckerWebpackPlugin({
      async: true,
      typescript: {
        configFile: __dirname + '/tsconfig.json',
        memoryLimit: 4096,
      },
    })
  );
}

const rules = [
  {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  },
  {
    test: /\.(sa|sc|c)ss$/,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
  },
  {
    test: /\.ya?ml$/,
    use: 'yml-loader',
  },
  {
    // Match js, jsx, ts & tsx files
    test: /\.[jt]sx?$/,
    loader: 'esbuild-loader',
    options: {
      // JavaScript version to compile to
      target: 'chrome88',
    },
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
    ],
  },
  {
    test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: 'url-loader',
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: 'webpack5-svg-sprite-loader',
      },
    ],
  },
];
const webpackConfig = {
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  mode: isModeProduction(mode) ? 'production' : 'development',
  context: __dirname + '/app/common',
  optimization: {
    splitChunks: {
      minChunks: Infinity,
    },
  },
  entry: {
    'common-new': ['./cask-shared-components.js'],
    'common-lib-new': [
      '@babel/polyfill',
      'classnames',
      // 'react',
      // 'react-dom',
      // 'bootstrap',
      // 'reactstrap',
      'i18n-react',
      'sockjs-client',
      'react-dropzone',
      'react-redux',
      'svg4everybody',
      'numeral',
    ],
  },
  module: {
    rules,
  },
  stats: {
    assets: false,
    children: false,
    chunkGroups: false,
    chunkModules: false,
    chunkOrigins: false,
    chunks: false,
    modules: false,
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
    path: __dirname + '/packaged/public/common_dist',
    library: { name: 'CaskCommon', type: 'umd' },
    publicPath: '/common_assets/',
    globalObject: 'window',
  },
  // externals: {
  //   react: {
  //     root: 'React',
  //     commonjs2: 'react',
  //     commonjs: 'react',
  //     amd: 'react',
  //   },
  //   'react-dom': {
  //     root: 'ReactDOM',
  //     commonjs2: 'react-dom',
  //     commonjs: 'react-dom',
  //     amd: 'react-dom',
  //   },
  //   'react-addons-css-transition-group': {
  //     commonjs: 'react-addons-css-transition-group',
  //     commonjs2: 'react-addons-css-transition-group',
  //     amd: 'react-addons-css-transition-group',
  //     root: ['React', 'addons', 'CSSTransitionGroup'],
  //   },
  // },
  resolve: {
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.svg'],
    alias: {
      components: path.resolve(__dirname + '/app/cdap/components'),
      services: path.resolve(__dirname + '/app/cdap/services'),
      api: path.resolve(__dirname + '/app/cdap/api'),
      wrangler: path.resolve(__dirname + '/app/wrangler'),
      styles: path.resolve(__dirname + '/app/cdap/styles'),
    },
    plugins: [PnpWebpackPlugin],
  },
  plugins,
};

// if (!isModeProduction(mode)) {
  webpackConfig.devtool = 'source-map';
// }

if (isModeProduction(mode)) {
  webpackConfig.optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        cache: false,
        parallel: true,
        sourceMap: true,
        extractComments: true,
        output: {
          comments: false,
        },
        ie8: false,
        safari10: false,
      },
    }),
  ];
}

module.exports = webpackConfig;
