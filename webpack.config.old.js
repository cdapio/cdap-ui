/*
 * Copyright © 2023 Cask Data, Inc.
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

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack');
const AngularTemplateCacheWebpackPlugin = require('angular-templatecache-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// const angular = require.resolve('angular');

const Path = require('path');
const FS = require('fs');

const outdatedWayOfDoingThings = [
  require.resolve('angular'),
  require.resolve('lodash'),

  // require.resolve('@bower_components/angular-sanitize/angular-sanitize.js'),
  require.resolve('@bower_components/angular-animate/angular-animate.js'),
  require.resolve('@bower_components/angular-resource/angular-resource.js'),
  require.resolve('angular-ui-router'),

  require.resolve('@bower_components/angular-strap/dist/modules/compiler.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/dimensions.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/tooltip.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/tooltip.tpl.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/dropdown.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/dropdown.tpl.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/modal.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/modal.tpl.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/alert.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/alert.tpl.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/popover.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/popover.tpl.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/collapse.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/parse-options.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/typeahead.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/typeahead.tpl.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/select.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/select.tpl.js'),

  require.resolve('@bower_components/angular-strap/dist/modules/date-parser.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/date-formatter.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/datepicker.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/datepicker.tpl.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/timepicker.js'),
  require.resolve('@bower_components/angular-strap/dist/modules/timepicker.tpl.js'),
  require.resolve('@bower_components/angular-breadcrumb/release/angular-breadcrumb.js'),
  require.resolve('ngstorage'),
  require.resolve('@bower_components/angular-loading-bar/build/loading-bar.js'),
  require.resolve('d3'),
  require.resolve('d3-time'),

  require.resolve('@bower_components/graphlib/dist/graphlib.core.js'),
  require.resolve('dagre'),
  require.resolve('dagre-d3'),

  require.resolve('moment'),
  require.resolve('angular-moment'),

  require.resolve('uuid'),

  require.resolve('@bower_components/angular-cookies/angular-cookies.min.js'),
  require.resolve('redux'),
  require.resolve('redux-thunk'),
  // this was the only way to get these working
  require.resolve('./build-deps/angular-bootstrap/ui-bootstrap.min.js'),
  require.resolve('./build-deps/angular-bootstrap/ui-bootstrap-tpls.min.js'),
  require.resolve('./build-deps/angular-ui-ace/ui-ace.min.js'),
  
  require.resolve('jsplumb'),
  require.resolve('@bower_components/angular-gridster/dist/angular-gridster.min.js'),
  require.resolve('@bower_components/angular-cron-jobs/dist/angular-cron-jobs.min.js'),
  require.resolve('@bower_components/marked/marked.min.js'),
  require.resolve('@bower_components/angular-marked/dist/angular-marked.min.js'),

  require.resolve('@bower_components/angular-file-saver/dist/angular-file-saver.bundle.js'),
  require.resolve('@bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js'),
  require.resolve('@bower_components/angular-inview/angular-inview.js'),
  require.resolve('react'),
  require.resolve('react-dom'),
  require.resolve('ngreact'),
  require.resolve('svg4everybody'),
  require.resolve('sockjs-client'),
];

const traverseDirectory = (directory, files, fileType) => {
  if (FS.statSync(directory).isFile() && directory.match(fileType)) {
    files.push(directory);
    return;
  }
  FS.readdirSync(directory).forEach((file) => {
    const absPath = Path.join(directory, file);
    if (FS.statSync(absPath).isDirectory())
      return traverseDirectory(absPath, files, fileType);
    else if (
      file.match(fileType) &&
      !file.match(/module.js|main.js|hydrator.html/)
    ) {
      return files.push(absPath);
    }
  });
};

const oldFiles = {
  html: {
    files: ['/app/services', '/app/directives'],
    fileMatch: /.html/,
  },
  js: {
    files: [
      '/app/ui-utils/url-generator.js',
      '/app/hydrator/main.js',
      '/app/services',
      '/app/directives/',
      '/app/filters/',
      '/app/lib/global-lib.js',
      '/app/hydrator/module.js',
      '/app/hydrator',
      '/app/cdap/components/hydrator/angular', // load last
    ],
    fileMatch: /.js/,
  },
  less: {
    files: [
      '/app/styles/common.less',
      '/app/styles/themes/',
      '/app/directives/',
      '/app/hydrator/',
      '/app/styles/bootstrap.less',
    ],
    fileMatch: /.less/,
  },
};

const returnOldFiles = (type) => {
  const fileList = oldFiles[type].files;
  const match = oldFiles[type].fileMatch;
  const files = [];

  fileList.forEach((file) => {
    traverseDirectory(path.resolve(__dirname + file), files, match);
  });
  return files;
};

const cleanOptions = {
  verbose: true,
  dry: true,
};

const returnPipelineFiles = () => {
  // do we need to wrap these in this stuff?
  // const PKG = JSON.stringify({
  //   name: pkg.name,
  //   v: pkg.version,
  // });
  // plug.wrapper({
  //   header: '\n(function (PKG){ /* ${filename} */\n',
  //   footer: '\n})(' + PKG + ');\n',
  // })
  return ['/app'].map((item) => {
    return path.resolve(__dirname + item);
  }); // for hydrator.js
};



const loaderExclude = [
  /node_modules/,
  /node_modules\/@bower_components/,
  /packaged\/public\/dist/,
  /packaged\/public\/cdap_dist/,
  /packaged\/public\/common_dist/,
  /packaged/,
  /lib/,
  // /cask-sharedcomponents.js/,
];

// const loaderExcludeStrings = [
//   '/node_modules/',
//   '/node_modules/@bower_components/',
//   '/packaged/public/dist/',
//   '/packaged/public/cdap_dist/',
//   '/packaged/public/common_dist/',
//   '/packaged/',
//   '/lib/',
//   '/cask-shared-components.js',
// ];

const webpackConfig = {

  entry: [
    '@babel/polyfill',
    ...outdatedWayOfDoingThings,
    ...returnOldFiles('js'), // loads all these files because they're never required so webpack doesn't see them.
    // ...returnOldFiles('less'),
  ],
  output: {
    filename: 'hydrator.js',
    path: path.resolve(__dirname + '/packaged/public/dist/assets/bundle/'),
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  mode: 'development',
  // optimization: {
  //   splitChunks: {
  //     minChunks: Infinity,
  //   },
  // },
  target: 'web',
  module: {
    rules: [
      // {
      //   test: /\.svg$/,
      //   use: [
      //     {
      //       loader: 'webpack5-svg-sprite-loader',
      //     },
      //   ],
      // },
      // {
      //   test: /\.(sa|sc|c|le)ss$/,
      //   use: 'ignore-loader',
      // },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        // include: styleFiles(),
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        // include: styleFiles(),
      },
      {
        test: /\.yaml/,
        use: 'ignore-loader',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: true,
        },
      },

      {
        test: /\.ts|tsx/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: loaderExclude,
        include: returnPipelineFiles(),
      },
      {
        test: /\.js|jsx/,
        use: ['babel-loader'],
        exclude: loaderExclude,
        include: returnPipelineFiles(),
        // resolve: {
        //   fullySpecified: false,
        // },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'webpack5-svg-sprite-loader',
          },
        ],
      },
    ],
  },
  externals: {
    // Use external version of React
    // 'angular-sanitize': require.resolve('angular-sanitize'),
    // 'angular-resource': require.resolve('angular-resource'),
    // 'angular-breadcrumb': require.resolve('angular-breadcrumb'),
    // 'angular-cookies': require.resolve('angular-cookies'),
    // 'angular-ui-router': require.resolve('angular-ui-router'),
    // 'angular-loading-bar': require.resolve('angular-loading-bar'),
    // 'angular-strap': require.resolve('angular-strap'),
    // lodash: require.resolve('lodash'),
    // d3: require.resolve('d3'),
    // 'dagre-d3': require.resolve('dagre-d3'),
    // 'angular-moment': require.resolve('angular-moment'),
    // 'ace-builds': require.resolve('ace-builds'),
    // react: {
    //   commonjs: 'react',
    //   commonjs2: 'react',
    //   amd: 'react',
    //   root: 'React',
    // },
    // 'react-dom': {
    //   root: 'ReactDOM',
    //   commonjs2: 'react-dom',
    //   commonjs: 'react-dom',
    //   amd: 'react-dom',
    // },
    // 'react-redux': {
    //   root: 'react-redux',
    //   commonjs2: 'react-redux',
    //   commonjs: 'react-redux',
    //   amd: 'react-redux',
    // },
    // // reactstrap: 'reactstrap',
    // 'react-popper': {
    //   root: 'react-popper',
    //   commonjs2: 'react-popper',
    //   commonjs: 'react-popper',
    //   amd: 'react-popper',
    // },
    // 'react-transition-group': {
    //   root: 'react-transition-group',
    //   commonjs2: 'react-transition-group',
    //   commonjs: 'react-transition-group',
    //   amd: 'react-transition-group',
    // },
  },
  resolve: {
    fallback: {
      fs: false,
      // angular: require.resolve('angular'),
      // React: require.resolve('react'),
      // ReactDOM: require.resolve('react-dom'),
      // SockJS: require.resolve('sockjs-client'),
      // ngStorage: require.resolve('angular-storage'),
      // ngCookies: require.resolve('angular-cookies'),
      // moment: require.resolve('moment'),
      // uuid: require.resolve('node-uuid'),
      // redux: require.resolve('redux'),
      // thunk: require.resolve('redux-thunk'),
      // reactstrap: require.resolve('reactstrap'),
      // tls: require.resolve('tls'),
      // net: require.resolve('net'),
      //   path: false,
      //   zlib: false,
      //   http: require.resolve('http'),
      //   https: false,
      //   events: require.resolve('events'),
      //   buffer: require.resolve('buffer'),
      //   assert: require.resolve('assert'),
      //   // require: require.resolve('require'),
      //   'stream-browserify': require.resolve('stream-browserify'),
      //   url: require.resolve('url'),
      //   util: require.resolve('util'),
      //   stream: require.resolve('stream'),
      //   crypto: require.resolve('crypto'),
    },
    extensions: [
      '.mjs',
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
      '.html',
      '.less',
      '.scss',
      '.css',
      '.svg',
    ],
    alias: {
      hydrator: path.resolve(__dirname + '/app/hydrator'),
      components: path.resolve(__dirname + '/app/cdap/components'),
      services: path.resolve(__dirname + '/app/cdap/services'),
      api: path.resolve(__dirname + '/app/cdap/api'),
      wrangler: path.resolve(__dirname + '/app/wrangler'),
      styles: path.resolve(__dirname + '/app/cdap/styles'),
    },
    plugins: [PnpWebpackPlugin],
  },
  plugins: [
    new webpack.ProvidePlugin({
      // angular: require('angular'),
      jQuery: require('jquery'),
    }),
    new AngularTemplateCacheWebpackPlugin({
      // transformUrl: function(url) {
      //   console.log(url);
      //   return url.replace(/^\/+/g, '');
      // },
      source: [
        ...returnOldFiles('html'),
        // path.resolve(__dirname + '/app/directives/**/*.html'),
        // path.resolve(__dirname + '/app/services/**/*.html'),
      ],
      module: 'cdap-ui.commons',
      root: path.resolve(__dirname),
      /**
       * See options and defaults below for more details
       */
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true,
        discardComments: {
          removeAll: true,
        },
      },
    }),
    new NodePolyfillPlugin(),
    new CleanWebpackPlugin(cleanOptions),
    new webpack.DefinePlugin({
      PKG: { name: JSON.stringify('cdap-ui') },
    }),
    // new IncludeFilesPlugin({
    //   files: {
    //     'lib.js': uhh,
    //   },
    // }),
    new CopyWebpackPlugin(
      [
        {
          from: './app/hydrator/hydrator.html',
          to: path.resolve(__dirname + '/packaged/public/dist/hydrator.html'),
        },
        // {
        //   from: './app/hydrator/**/*.html',
        //   to: path.resolve(
        //     __dirname + '/packaged/public/dist/assets/features/hydrator'
        //   ),
        // },
        // {
        //   from: path.resolve(
        //     __dirname,
        //     'node_modules',
        //     'font-awesome',
        //     'fonts'
        //   ),
        //   to: './fonts/',
        // },
        // {
        //   from: './styles/img',
        //   to: './img/',
        // },
        // {
        //   from: './**/*-web-worker.js',
        //   to: './web-workers/',
        //   flatten: true,
        // },
      ],
      {
        copyUnmodified: true,
      }
    ),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      include: /dir/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
    // new StyleLintPlugin({
    //   syntax: 'scss',
    //   files: ['**/*.scss'],
    // }),
    // new ESLintPlugin({
    //   extensions: ['js', 'jsx'],
    //   exclude: loaderExcludeStrings,
    // }),
    // new HtmlWebpackPlugin({
    //   // title: 'CDAP studio',
    //   // entry: path.resolve(__dirname + '/app/hydrator/hydrator.html'),
    //   template: path.resolve(__dirname + '/app/hydrator/hydrator.html'),
    //   filename: path.resolve(__dirname + '/public/dist/hydrator.html'),
    //   // hash: true,
    //   inject: false,
    //   // hashId: uuidV4(),
    //   mode: 'development',
    // }),
  ],
  devtool: 'eval-source-map',
};

module.exports = webpackConfig;
