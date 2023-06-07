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
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const uuidV4 = require('uuid/v4');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
// const angular = require('angular');

// the clean options to use
const cleanOptions = {
  verbose: true,
  dry: true,
};

const loaderExclude = [
  /node_modules/,
  /bower_components/,
  /packaged\/public\/dist/,
  /packaged\/public\/cdap_dist/,
  /packaged\/public\/common_dist/,
  /packaged/,
  /lib/,
  /cask-sharedcomponents.js/,
];

const loaderExcludeStrings = [
  '/node_modules/',
  '/bower_components/',
  '/packaged/public/dist/',
  '/packaged/public/cdap_dist/',
  '/packaged/public/common_dist/',
  '/packaged/',
  '/lib/',
  '/cask-shared-components.js',
];

const mode = process.env.NODE_ENV || 'production';
const isModeProduction = (mode) =>
  mode === 'production' || mode === 'non-optimized-production';
const getWebpackDllPlugins = (mode) => {
  let sharedDllManifestFileName = 'shared-vendor-manifest.json';
  let cdapDllManifestFileName = 'cdap-vendor-manifest.json';
  if (mode === 'development') {
    sharedDllManifestFileName = 'shared-vendor-development-manifest.json';
    cdapDllManifestFileName = 'cdap-vendor-development-manifest.json';
  }
  return [
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, 'packaged', 'public', 'dll'),
      manifest: require(path.join(
        __dirname,
        'packaged',
        'public',
        'dll',
        sharedDllManifestFileName
      )),
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, 'packaged', 'public', 'dll'),
      manifest: require(path.join(
        __dirname,
        'packaged',
        'public',
        'dll',
        cdapDllManifestFileName
      )),
    }),
  ];
};

const plugins = [
  new NodePolyfillPlugin(),
  new CleanWebpackPlugin(cleanOptions),
  new CaseSensitivePathsPlugin(),
  ...getWebpackDllPlugins(mode),
  new LodashModuleReplacementPlugin({
    shorthands: true,
    collections: true,
    caching: true,
    flattening: true,
  }),
  new CopyWebpackPlugin(
    [
      {
        from: './styles/fonts',
        to: './fonts/',
      },
      {
        from: path.resolve(__dirname, 'node_modules', 'font-awesome', 'fonts'),
        to: './fonts/',
      },
      {
        from: './styles/img',
        to: './img/',
      },
      {
        from: './**/*-web-worker.js',
        to: './web-workers/',
        flatten: true,
      },
    ],
    {
      copyUnmodified: true,
    }
  ),
  new StyleLintPlugin({
    syntax: 'scss',
    files: ['**/*.scss'],
  }),
  new ESLintPlugin({
    extensions: ['js', 'jsx'],
    exclude: loaderExcludeStrings,
  }),
  new HtmlWebpackPlugin({
    title: 'CDAP',
    template: './cdap.html',
    filename: 'cdap.html',
    hash: true,
    inject: false,
    hashId: uuidV4(),
    mode: isModeProduction(mode) ? '' : 'development.',
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
    test: /\.json$/,
    loader: 'json-loader',
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
    test: /\.m?js/,
    type: 'javascript/auto',
  },
  {
    test: /\.m?jsx?$/,
    resolve: {
      fullySpecified: false,
    },
  },
  {
    test: /\.js$|jsx/,
    use: ['babel-loader'],
    exclude: loaderExclude,
    include: [path.join(__dirname, 'app')],
    resolve: {
      fullySpecified: false,
    },
  },
  {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
    exclude: loaderExclude,
    include: [path.join(__dirname, 'app')],
  },
  // {
  //   test: /\.html$/i,
  //   loader: 'html-loader',
  //   options: {
  //     minimize: true,
  //   },
  // },
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
    use: [{ loader: 'file-loader' }],
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

if (isModeProduction(mode)) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        __DEVTOOLS__: false,
        // angular,
      },
    })
  );
}

if (mode === 'development') {
  plugins.push(
    new LiveReloadPlugin({
      port: 35799,
      appendScriptTag: true,
      delay: 500,
      ignore: loaderExclude,
    })
  );
}

const webpackConfig = {
  mode: isModeProduction(mode) ? 'production' : 'development',
  context: __dirname + '/app/cdap',
  entry: {
    cdap: ['@babel/polyfill', 'react-hot-loader/patch', './cdap.js'],
  },
  module: {
    rules,
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: __dirname + '/packaged/public/cdap_dist/cdap_assets/',
    publicPath: '/cdap_assets/',
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
  plugins: plugins,
  // TODO: Need to investigate this more.
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    chunkIds: 'named',
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  resolve: {
    fallback: {
      React: require.resolve('react'),
      ReactDom: require.resolve('react-dom'),
      reactstrap: require.resolve('reactstrap'),
    },
    extensions: [
      '.mjs',
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.scss',
      '.json',
      '.svg',
    ],
    plugins: [PnpWebpackPlugin],
    alias: {
      components: __dirname + '/app/cdap/components',
      services: __dirname + '/app/cdap/services',
      api: __dirname + '/app/cdap/api',
      lib: __dirname + '/app/lib',
      styles: __dirname + '/app/cdap/styles',
    },
  },
};

// if (!isModeProduction(mode)) {
webpackConfig.devtool = 'eval-source-map';
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
