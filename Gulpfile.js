/*
 * Copyright © 2015-2018 Cask Data, Inc.
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

const gulp = require('gulp'),
  plug = require('gulp-load-plugins')(),
  pkg = require('./package.json'),
  del = require('del'),
  merge = require('merge-stream'),
  autoprefixer = require('autoprefixer');
const webpackStream = require('webpack-stream');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack');
// const angular = require.resolve('angular');

const webpackConfig = {
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
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'webpack5-svg-sprite-loader',
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: 'ignore-loader',
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
        // Match js, jsx, ts & tsx files
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
          // JavaScript version to compile to
          target: 'chrome88',
        },
      },
    ],
  },
  externals: {
    // Use external version of React
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    'react-redux': {
      root: 'react-redux',
      commonjs2: 'react-redux',
      commonjs: 'react-redux',
      amd: 'react-redux',
    },
    // reactstrap: 'reactstrap',
    'react-popper': {
      root: 'react-popper',
      commonjs2: 'react-popper',
      commonjs: 'react-popper',
      amd: 'react-popper',
    },
    'react-transition-group': {
      root: 'react-transition-group',
      commonjs2: 'react-transition-group',
      commonjs: 'react-transition-group',
      amd: 'react-transition-group',
    },
  },
  resolve: {
    fallback: {
      fs: false,
      // React: require.resolve('react'),
      // ReactDOM: require.resolve('react-dom'),
      SockJS: require.resolve('sockjs-client'),
      ngStorage: require.resolve('angular-storage'),
      ngCookies: require.resolve('angular-cookies'),
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
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      components: path.resolve(__dirname + '/app/cdap/components'),
      services: path.resolve(__dirname + '/app/cdap/services'),
      api: path.resolve(__dirname + '/app/cdap/api'),
      wrangler: path.resolve(__dirname + '/app/wrangler'),
      styles: path.resolve(__dirname + '/app/cdap/styles'),
    },
    plugins: [PnpWebpackPlugin],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      PKG: { name: JSON.stringify('cdap-ui') },

    }),
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
  ],
  devtool: 'eval-source-map',
};

function getEs6Directives(isNegate) {
  const es6directives = [
    'dag-plus',
    'plugin-templates',
    'my-global-navbar',
    'datetime-picker',
    'datetime-range',
    'complex-schema',
    'my-pipeline-settings',
    'my-pipeline-summary',
    'my-pipeline-resource',
    'my-post-run-action-wizard',
    'my-post-run-actions',
    'widget-container/widget-complex-schema-editor',
    'widget-container',
    'plugin-functions',
    'my-link-button',
  ];

  return es6directives.map((directive) => {
    return (isNegate ? '!' : '') + './app/directives/' + directive + '/**/*.js';
  });
}


// seems to bundle source and getes6 directives into bundle files.

function getExtensionBuildPipeline(extension) {
  const PKG = JSON.stringify({
    name: pkg.name,
    v: pkg.version,
  });

  let source = [
    './app/' + extension + '/main.js',
    './app/services/**/*.js',
    './app/directives/**/*.js',
    './app/filters/**/*.js',
    './app/lib/global-lib.js',
    './app/' + extension + '/module.js',
    './app/' + extension + '/**/*.js',
  ];
  source = source.concat(getEs6Directives(true));

  return (
    gulp
      .src(source)
      .pipe(plug.plumber()) // looks unnecessary
      .pipe(
        plug.wrapper({
          header: '\n(function (PKG){ /* ${filename} */\n',
          footer: '\n})(' + PKG + ');\n',
        })
      )
      .pipe(
        webpackStream(webpackConfig, null, (err, stats) => {
          /* Use stats to do more things if needed */
        })
      )

      // .pipe(plug.ngAnnotate())
      // .pipe(plug.babel())
      .pipe(plug.concat(extension + '.js'))
      .pipe(gulp.dest('./packaged/public/dist/assets/bundle'))
  );
}



function getBabelBuildPipeline() {
  const PKG = JSON.stringify({
    name: pkg.name,
    v: pkg.version,
  });

  const source = getEs6Directives();
  return (
    gulp
      .src(source)
      .pipe(plug.plumber()) // probably unnecessary
      .pipe(
        plug.wrapper({
          // self executes this code: with header and footer i guess?
          header: '\n(function (PKG){ /* ${filename} */\n',
          footer: '\n})(' + PKG + ');\n',
        })
      )
      .pipe(
        webpackStream(webpackConfig, null, (err, stats) => {
          /* Use stats to do more things if needed */
        })
      )
      // .pipe(plug.babel())
      // .pipe(plug.ngAnnotate())
      .pipe(plug.concat('common.es6.js'))
      .pipe(gulp.dest('./packaged/public/dist/assets/bundle'))
  );
}

gulp.task('css:library', () => {
  return merge(
    gulp.src([
<<<<<<< HEAD
      './bower_components/angular/angular-csp.css',
      './bower_components/angular-loading-bar/build/loading-bar.min.css',
      './bower_components/angular-motion/dist/angular-motion.min.css',
      // './node_modules/@fortawesome-fontawesome-free/css/fontawesome.css',
      // './node_modules/@fortawesome-fontawesome-free/css/brands.css',
      // './node_modules/@fortawesome-fontawesome-free/css/solid.css',
      './bower_components/c3/c3.min.css',
      './bower_components/angular-gridster/dist/angular-gridster.min.css',
      './bower_components/angular-cron-jobs/dist/angular-cron-jobs.min.css',
=======
      './node_modules/@bower_components/angular/angular-csp.css',
      './node_modules/@bower_components/angular-loading-bar/build/loading-bar.min.css',
      './node_modules/@bower_components/angular-motion/dist/angular-motion.min.css',
      './node_modules/font-awesome/css/font-awesome.min.css',
      './node_modules/@bower_components/angular-gridster/dist/angular-gridster.min.css',
      './node_modules/@bower_components/angular-cron-jobs/dist/angular-cron-jobs.min.css',
>>>>>>> 89250f77a755119d64bf6b12d0a6ffe53963a272
    ]),
    gulp.src('./app/styles/bootstrap.less').pipe(plug.less())
  )
    .pipe(plug.concat('lib.css'))
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle'));
});

gulp.task('css:application', () => {
  const processor = [
    autoprefixer({ overrideBrowserslist: ['> 1%'], cascade: true }),
  ];

  return gulp
    .src([
      './app/styles/common.less',
      './app/styles/themes/*.less',
      './app/directives/**/*.less',
      './app/hydrator/**/*.less',
      // './app/tracker/**/*.less',
    ])
    .pipe(plug.less())
    .pipe(plug.concat('app.css'))
    .pipe(plug.postcss(processor))
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle'))
    .pipe(plug.livereload({ port: 35728 }));
});

gulp.task('css:lint', () => {
  return gulp
    .src([
      './app/styles/common.less',
      './app/styles/themes/*.less',
      './app/directives/**/*.{less,css}',
    ])
    .pipe(
      plug.stylelint({
        configFile: './.stylelintrc',
        syntax: 'less',
        reporters: [
          {
            formatter: 'string',
            console: true,
          },
        ],
      })
    );
});

gulp.task('css:app', gulp.series('css:application', 'css:lint'));

gulp.task('js:lib', () => {
  return gulp
    .src([
<<<<<<< HEAD
      require.resolve('angular'),
      './bower_components/d3/d3.js',
      './bower_components/angular-strap/dist/modules/compiler.js',
      './bower_components/angular-strap/dist/modules/dimensions.js',
      './bower_components/angular-strap/dist/modules/tooltip.js',
      './bower_components/angular-strap/dist/modules/tooltip.tpl.js',
      './bower_components/angular-strap/dist/modules/dropdown.js',
      './bower_components/angular-strap/dist/modules/dropdown.tpl.js',
      './bower_components/angular-strap/dist/modules/modal.js',
      './bower_components/angular-strap/dist/modules/modal.tpl.js',
      './bower_components/angular-strap/dist/modules/alert.js',
      './bower_components/angular-strap/dist/modules/alert.tpl.js',
      './bower_components/angular-strap/dist/modules/popover.js',
      './bower_components/angular-strap/dist/modules/popover.tpl.js',
      './bower_components/angular-strap/dist/modules/collapse.js',
      './bower_components/angular-strap/dist/modules/parse-options.js',
      './bower_components/angular-strap/dist/modules/typeahead.js',
      './bower_components/angular-strap/dist/modules/typeahead.tpl.js',
      './bower_components/angular-strap/dist/modules/select.js',
      './bower_components/angular-strap/dist/modules/select.tpl.js',
=======
      './node_modules/@bower_components/angular/angular.js',

      './node_modules/@bower_components/angular-sanitize/angular-sanitize.js',
      './node_modules/@bower_components/angular-animate/angular-animate.js',
      './node_modules/@bower_components/angular-resource/angular-resource.js',

      './node_modules/@bower_components/angular-ui-router/release/angular-ui-router.js',

      './node_modules/@bower_components/angular-strap/dist/modules/compiler.js',
      './node_modules/@bower_components/angular-strap/dist/modules/dimensions.js',
      './node_modules/@bower_components/angular-strap/dist/modules/tooltip.js',
      './node_modules/@bower_components/angular-strap/dist/modules/tooltip.tpl.js',
      './node_modules/@bower_components/angular-strap/dist/modules/dropdown.js',
      './node_modules/@bower_components/angular-strap/dist/modules/dropdown.tpl.js',
      './node_modules/@bower_components/angular-strap/dist/modules/modal.js',
      './node_modules/@bower_components/angular-strap/dist/modules/modal.tpl.js',
      './node_modules/@bower_components/angular-strap/dist/modules/alert.js',
      './node_modules/@bower_components/angular-strap/dist/modules/alert.tpl.js',
      './node_modules/@bower_components/angular-strap/dist/modules/popover.js',
      './node_modules/@bower_components/angular-strap/dist/modules/popover.tpl.js',
      './node_modules/@bower_components/angular-strap/dist/modules/collapse.js',
      './node_modules/@bower_components/angular-strap/dist/modules/parse-options.js',
      './node_modules/@bower_components/angular-strap/dist/modules/typeahead.js',
      './node_modules/@bower_components/angular-strap/dist/modules/typeahead.tpl.js',
      './node_modules/@bower_components/angular-strap/dist/modules/select.js',
      './node_modules/@bower_components/angular-strap/dist/modules/select.tpl.js',
>>>>>>> 89250f77a755119d64bf6b12d0a6ffe53963a272

      './node_modules/@bower_components/angular-strap/dist/modules/date-parser.js',
      './node_modules/@bower_components/angular-strap/dist/modules/date-formatter.js',
      './node_modules/@bower_components/angular-strap/dist/modules/datepicker.js',
      './node_modules/@bower_components/angular-strap/dist/modules/datepicker.tpl.js',
      './node_modules/@bower_components/angular-strap/dist/modules/timepicker.js',
      './node_modules/@bower_components/angular-strap/dist/modules/timepicker.tpl.js',

<<<<<<< HEAD
      './bower_components/d3-timeline/src/d3-timeline.js',
      require.resolve('ngstorage'),
      // './bower_components/angular-animate/angular-animate.js',
      // require.resolve('angular-animate'),
      require.resolve('angular-sanitize'),
      require.resolve('angular-resource'),
      require.resolve('angular-breadcrumb'),
      require.resolve('angular-cookies'),
      require.resolve('angular-ui-router'),
      require.resolve('angular-loading-bar'),
      require.resolve('angular-strap'),
      require.resolve('lodash'),
      require.resolve('dagre-d3'),
      require.resolve('moment'),
      require.resolve('angular-moment'),
      require.resolve('node-uuid'),
      require.resolve('redux'),
      require.resolve('redux-thunk'),
      require.resolve('ace-builds'),
      './bower_components/angular-ui-ace/ui-ace.js',
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      require.resolve('jsplumb'),
      './bower_components/angular-gridster/dist/angular-gridster.min.js',
      require.resolve('angular-cron-jobs'),
      './bower_components/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
      './bower_components/marked/marked.min.js',
      require.resolve('angular-marked'),
      require.resolve('js-beautify'),
      './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
      './bower_components/angular-file-saver/dist/angular-file-saver.bundle.js',
      require.resolve('angular-inview'),
      require.resolve('esprima'),
      // require.resolve('react'),
      // require.resolve('react-dom'),
      require.resolve('ngreact'),
      require.resolve('svg4everybody'),
      // require.resolve('sockjs'),
=======
      './node_modules/@bower_components/angular-breadcrumb/release/angular-breadcrumb.js',

      './node_modules/@bower_components/ngstorage/ngStorage.js',
      './node_modules/@bower_components/angular-loading-bar/build/loading-bar.js',

      './node_modules/@bower_components/d3/d3.js',
      './node_modules/@bower_components/d3-timeline/src/d3-timeline.js',
      './node_modules/@bower_components/lodash/lodash.js',
      './node_modules/@bower_components/graphlib/dist/graphlib.core.js',
      './node_modules/@bower_components/dagre/dist/dagre.core.js',
      './node_modules/@bower_components/dagre-d3/dist/dagre-d3.core.js',
      './node_modules/@bower_components/moment/moment.js',
      './node_modules/@bower_components/angular-moment/angular-moment.js',
      './node_modules/@bower_components/angular-bootstrap/ui-bootstrap-tpls.js',

      './node_modules/@bower_components/node-uuid/uuid.js',

      './node_modules/@bower_components/angular-cookies/angular-cookies.min.js',
      './node_modules/redux/dist/redux.min.js',
      './node_modules/redux-thunk/dist/redux-thunk.min.js',
      './node_modules/@bower_components/ace-builds/src-min-noconflict/ace.js',
      './node_modules/@bower_components/angular-ui-ace/ui-ace.js',
      './node_modules/@bower_components/jsPlumb/dist/js/jsPlumb-2.0.6-min.js',
      './node_modules/@bower_components/angular-gridster/dist/angular-gridster.min.js',
      './node_modules/@bower_components/angular-cron-jobs/dist/angular-cron-jobs.min.js',
      './node_modules/@bower_components/marked/marked.min.js',
      './node_modules/@bower_components/angular-marked/dist/angular-marked.min.js',

      './node_modules/@bower_components/js-beautify/js/lib/beautify.js',
      './node_modules/@bower_components/angular-file-saver/dist/angular-file-saver.bundle.js',
      './node_modules/@bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
      './node_modules/@bower_components/angular-inview/angular-inview.js',
      './node_modules/@bower_components/esprima/esprima.js',
      './node_modules/react/umd/react.production.min.js',
      './node_modules/react-dom/umd/react-dom.production.min.js',
      './node_modules/ngreact/ngReact.min.js',

      './node_modules/svg4everybody/dist/svg4everybody.min.js',
      './node_modules/sockjs-client/dist/sockjs.js',
>>>>>>> 89250f77a755119d64bf6b12d0a6ffe53963a272
    ])
    .pipe(plug.replace('glyphicon', 'fa'))
    .pipe(
      webpackStream(webpackConfig, null, () => {})
    )
    .pipe(plug.concat('lib.js'))
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle'));
});

gulp.task('js:aceworkers', (cb) => {
  gulp
    .src([
      /** FIXME: (CDAP-15419): Unify ace-builds dependency */
<<<<<<< HEAD

      require.resolve('ace-builds'),
=======
      './node_modules/@bower_components/ace-builds/src-min-noconflict/ace.js',
      './node_modules/@bower_components/ace-builds/src-min-noconflict/mode-javascript.js',
      './node_modules/@bower_components/ace-builds/src-min-noconflict/worker-javascript.js',
      './node_modules/ace-builds/src-min-noconflict/mode-json.js',
      './node_modules/ace-builds/src-min-noconflict/worker-json.js',
      './node_modules/@bower_components/ace-builds/src-min-noconflict/mode-python.js',
      './node_modules/@bower_components/ace-builds/src-min-noconflict/mode-sql.js',
      './node_modules/@bower_components/ace-builds/src-min-noconflict/mode-scala.js',
      './node_modules/@bower_components/ace-builds/src-min-noconflict/mode-plain_text.js',
>>>>>>> 89250f77a755119d64bf6b12d0a6ffe53963a272
    ])
    .pipe(
      gulp.dest(
        './packaged/public/dist/assets/bundle/ace-editor-worker-scripts/'
      )
    );
  cb();
});

gulp.task('fonts', () => {
  return gulp
    .src([
<<<<<<< HEAD
      './bower_components/bootstrap/dist/fonts/*',
=======
>>>>>>> 89250f77a755119d64bf6b12d0a6ffe53963a272
      './app/styles/fonts/*',
      require.resolve('@fortawesome/fontawesome-free'),
    ])
    .pipe(gulp.dest('./packaged/public/dist/assets/fonts'));
});

gulp.task('css:lib', gulp.series('css:library', 'fonts'));
// Build using watch
gulp.task('watch:js:app:hydrator', () => {
  return getExtensionBuildPipeline('hydrator').pipe(
    plug.livereload({ port: 35728 })
  );
});

// gulp.task('watch:js:app:tracker', () => {
//   return getExtensionBuildPipeline('tracker').pipe(
//     plug.livereload({ port: 35728 })
//   );
// });

gulp.task('watch:js:app:babel', () => {
  return getBabelBuildPipeline().pipe(plug.livereload({ port: 35728 }));
});

// Build once.
gulp.task('js:app:hydrator', () => {
  return getExtensionBuildPipeline('hydrator');
});

// gulp.task('js:app:tracker', () => {
//   return getExtensionBuildPipeline('tracker');
// });

gulp.task('js:app:babel', () => {
  return getBabelBuildPipeline();
});

gulp.task(
  'js:app',
  gulp.series(
    'js:app:babel',
    'js:app:hydrator'
    // 'js:app:tracker'
  )
);

gulp.task(
  'watch:js:app',
  gulp.series(
    'watch:js:app:hydrator'
    // 'watch:js:app:tracker'
  )
);
gulp.task('polyfill', () => {
  return gulp
    .src(['./app/polyfill.js', './app/ui-utils/url-generator.js'])
    .pipe(plug.babel())
    .pipe(plug.concat('polyfill.js'))
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle'));
});

gulp.task('img', () => {
  return gulp
    .src('./app/styles/img/**/*')
    .pipe(gulp.dest('./packaged/public/dist/assets/img'));
});

gulp.task('html:partials', () => {
  return gulp
    .src([
      './app/{hydrator}/**/*.html',
      // '!./app/tracker/tracker.html',
      '!./app/hydrator/hydrator.html',
    ])
    .pipe(plug.htmlmin({ removeComments: true }))
    .pipe(gulp.dest('./packaged/public/dist/assets/features'))
    .pipe(plug.livereload({ port: 35728 }));
});

gulp.task('html:main', () => {
  return gulp
    .src([
      // './app/tracker/tracker.html',
      './app/hydrator/hydrator.html',
    ])
    .pipe(plug.htmlmin({ removeComments: true }))
    .pipe(gulp.dest('./packaged/public/dist'));
});

gulp.task('html', gulp.series('html:main', 'html:partials'));

gulp.task('tpl', () => {
  return gulp
    .src(['./app/directives/**/*.html', './app/services/**/*.html'])
    .pipe(plug.htmlmin({ removeComments: true }))
    .pipe(
      plug.angularTemplatecache({
        module: pkg.name + '.commons',
        transformUrl: function(url) {
          // Remove leading slash which occurs in gulp 4
          return url.replace(/^\/+/g, '');
        },
      })
    )
    .pipe(plug.concat('tpl.js'))
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle'))
    .pipe(plug.livereload({ port: 35728 }));
});

gulp.task('js', gulp.series('js:lib', 'js:aceworkers', 'js:app', 'polyfill'));

gulp.task(
  'watch:js',
  gulp.series('watch:js:app', 'watch:js:app:babel', 'polyfill')
);

gulp.task('css', gulp.series('css:lib', 'css:app'));

gulp.task('style', gulp.series('css'));

gulp.task('build', gulp.series('js', 'css', 'img', 'tpl', 'html'));

gulp.task('lint', () => {
  return gulp
    .src([
      './app/**/*.js',
      '!./app/cdap/**/*.js',
      '!./app/login/**/*.js',
      '!./app/lib/**/*.js',
      '!./app/common/**/*.js',
      '!./app/wrangler/**/*.js',
    ])
    .pipe(plug.plumber())
    .pipe(plug.jshint())
    .pipe(plug.jshint.reporter())
    .pipe(plug.jshint.reporter('fail'));
});

gulp.task('jshint', gulp.series('lint'));

gulp.task('hint', gulp.series('lint'));

gulp.task('clean', (cb) => {
  del.sync(['./packaged/public/dist/*']);
  cb();
});

/*
  minification
 */
gulp.task('js:minification', () => {
  return gulp
    .src('./packaged/public/dist/assets/bundle/{app,lib}.js')
    .pipe(plug.terser())
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle'));
});

gulp.task('js:minify', gulp.series('js:minification', 'js'));

gulp.task('css:minification', () => {
  return gulp
    .src('./packaged/public/dist/assets/bundle/*.css')
    .pipe(plug.cssnano({ safe: true }))
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle'));
});

gulp.task('css:minify', gulp.series('css:minification', 'css'));

gulp.task('fonts:minification', () => {
  return gulp
    .src('./packaged/public/dist/assets/fonts/*.svg')
    .pipe(
      plug.svgmin({
        plugins: [
          {
            removeUselessDefs: false,
          },
          {
            cleanupIDs: false,
          },
        ],
      })
    )
    .pipe(gulp.dest('./packaged/public/dist/assets/fonts'));
});

gulp.task('fonts:minify', gulp.series('fonts:minification', 'fonts'));

gulp.task('img:minification', () => {
  return gulp
    .src('./packaged/public/dist/assets/img/*.svg')
    .pipe(
      plug.svgmin({
        plugins: [
          {
            removeUselessDefs: false,
          },
          {
            cleanupIDs: false,
          },
        ],
      })
    )
    .pipe(gulp.dest('./packaged/public/dist/assets/img'));
});

gulp.task('img:minify', gulp.series('img:minification', 'img'));

gulp.task(
  'minify',
  gulp.series('js:minify', 'css:minify', 'fonts:minify', 'img:minify')
);

/*
  rev'd assets
 */
gulp.task('revision:manifest', () => {
  return gulp
    .src(['./packaged/public/dist/assets/bundle/*'])
    .pipe(plug.rev())
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle')) // write rev'd assets to build dir

    .pipe(plug.rev.manifest({ path: 'manifest.json' }))
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle')); // write manifest
});

gulp.task('rev:manifest', gulp.series('revision:manifest', 'minify', 'tpl'));

gulp.task('revision:replace', () => {
  let rev = require('./packaged/public/dist/assets/bundle/manifest.json'),
    out = gulp.src('./packaged/public/dist/*.html'),
    p = '/assets/bundle/';
  for (const f in rev) {
    out = out.pipe(plug.replace(p + f, p + rev[f]));
  }
  return out.pipe(gulp.dest('./packaged/public/dist'));
});

gulp.task(
  'rev:replace',
  gulp.series('html:main', 'rev:manifest', 'revision:replace')
);

gulp.task('revision:manifest:dev', () => {
  return gulp
    .src(['./packaged/public/dist/assets/bundle/*'])
    .pipe(plug.rev())
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle')) // write rev'd assets to build dir

    .pipe(plug.rev.manifest({ path: 'manifest.json' }))
    .pipe(gulp.dest('./packaged/public/dist/assets/bundle')); // write manifest
});

gulp.task('rev:manifest:dev', gulp.series('revision:manifest:dev', 'tpl'));

gulp.task('revision:replace:dev', () => {
  let rev = require('./packaged/public/dist/assets/bundle/manifest.json'),
    out = gulp.src('./packaged/public/dist/*.html'),
    p = '/assets/bundle/';
  for (const f in rev) {
    out = out.pipe(plug.replace(p + f, p + rev[f]));
  }
  return out.pipe(gulp.dest('./packaged/public/dist'));
});

gulp.task(
  'rev:replace:dev',
  gulp.series('revision:replace:dev', 'html:main', 'rev:manifest:dev')
);

gulp.task('distribute', gulp.series('clean', 'build', 'rev:replace'));

gulp.task('default', gulp.series('lint', 'build', 'rev:replace:dev'));

/*
  watch
 */
// tasks jshint -- unnecessary can be replaced by lint or whatever in webpack
// watch:js:app --
// -- js:app:babel
// -- -- gets files without es6 directives and the runs webpack on them (most of the functionality has been shifted to webpack already)
// -- js:app:hydrator
// -- -- does the same thing as app:babel but bundles it as hydrator.js into 
// watch:js:app:babel
// css -- replace with css loader
// -- does css:app
// -- -- './app/styles/common.less', './app/styles/themes/*.less', './app/directives/**/*.less', './app/hydrator/**/*.less',
// -- -- less(), postcss with overrideBrowserslist: '> 1%', cascade true
// -- -- adds to packaged/public/dist/assets/bundle/app.css
// -- css:lib - client libs, angular-csp, loading bar, motion, gridster, cron-jobs, c3.min.css - from bower
// -- -- app/styles/bootstrap.less
// -- -- ./packaged/public/dist/assets/bundle/lib.css
// -- uses less, postcss and adds some css from bower packages
// tpl -- removes comments from './app/directives/**/*.html', './app/services/**/*.html'
// -- https://github.com/pchudzik/angular-template-cache then uses template cache to add
// -- all templates to singular file packaged/public/dist/assets/bundle/tps.js
// html:partials -- minifies html, removes comments, puts into packages/public/dist/assets/features
gulp.task('watcher', (cb) => {
  plug.livereload.listen({ port: 35728 });


  //file names
  let jsAppSource = [
    './app/**/*.js',
    '!./app/cdap/**/*.js',
    '!./app/login/**/*.js',
    '!./app/wrangler/**/*.js',
    '!./app/**/*-test.js',
  ];
  jsAppSource = jsAppSource.concat(getEs6Directives(true));


  // watches the above files without the directives
  gulp.watch(jsAppSource, gulp.series('jshint', 'watch:js:app'));
  // filenames**

  let jsAppBabelSource = [];
  jsAppBabelSource = jsAppBabelSource.concat(getEs6Directives(false));
  // watches the above files without the directives
  gulp.watch(jsAppBabelSource, gulp.series('jshint', 'watch:js:app:babel'));

  // does css watching
  gulp.watch('./app/**/*.{less,css}', gulp.series('css'));
  // watches the html files directives and services
  gulp.watch(
    ['./app/directives/**/*.html', './app/services/**/*.html'],
    gulp.series('tpl')
  );
  // watches the other html files
  gulp.watch(
    [
      './app/hydrator/**/*.html',
      // './app/tracker/**/*.html'
    ],
    gulp.series('html:partials')
  );
  cb();
});

gulp.task('watch', gulp.series('watcher', 'jshint', 'build'));
