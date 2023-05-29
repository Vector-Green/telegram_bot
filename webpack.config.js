/* eslint @typescript-eslint/no-var-requires: "off" */

const path = require('path');

const webpack = require('webpack');

const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const dotenvFlow = require('dotenv-flow');
dotenvFlow.config({
  silent: true,
});

module.exports = () => {
  return new Promise((resolve) => {
    resolve();
  }).then(() => {
    return {
      stats: 'minimal',
      target: 'node',
      externals: process.env.BUNDLE_NODE_MODULES ? [] : [nodeExternals()],

      mode: process.env.NODE_ENV,
      entry: ['./src/main.ts'],
      devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
      output: {
        clean: true,
        hashFunction: 'xxhash64',
        hashDigest: 'base64url',
        path: path.resolve(__dirname, 'build'),
        filename: 'server.js',
        chunkFilename:
          process.env.NODE_ENV === 'production'
            ? '[contenthash].js'
            : 'js/[name][id].js',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '#': path.resolve(__dirname, 'resources'),
        },
        extensions: [
          '.tsx',
          '.ts',
          '.cjs',
          '.mjs',
          '.js',
          '.jsx',
          '.json',
          '.wasm',
        ],
      },
      module: {
        rules: [
          //TODO: include other platforms, not only current
          {
            test: /sqlite3-binding\.js$/,
            use: 'sqlite3-loader',
          },
          {
            test: /.node$/,
            loader: 'node-loader',
            options: {
              name: '[name].[ext]',
            },
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            use: [
              {
                loader: 'swc-loader',
              },
            ],
          },
        ],
      },
      plugins: [
        process.env.NODEMON && new NodemonPlugin({ script: false }),
        new webpack.DefinePlugin({
          BUNDLE_NODE_MODULES: process.env.BUNDLE_NODE_MODULES === 'true',
          APP_NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          APP_PORT: parseInt(process.env.PORT, 10),
          APP_URL: JSON.stringify(process.env.URL),
          APP_STATIC_PATH: JSON.stringify(process.env.STATIC_PATH),
          APP_PUBLIC_PATH: JSON.stringify(process.env.PUBLIC_PATH),
          APP_USE_LOGGER: process.env.USE_LOGGER === 'true',
        }),
        new webpack.IgnorePlugin({
          //!be aware after upgrade node_dependencies
          checkResource(resource, context) {
            let fooArr = [
              // (resource, context) => {
              //   const ignoringRange =
              //     resource.startsWith('./') && resource.endsWith('.node');
              //   const ignoringFiles = ['@mongodb-js/zstd-linux-arm-gnueabihf'];
              //   const ignoringResource =
              //     ignoringFiles.includes(resource) || ignoringRange;
              //   const ignoringContext =
              //     context.endsWith('snappy') ||
              //     context.endsWith('@mongodb-js\\zstd');
              //   return ignoringContext && ignoringResource;
              // },
              (resource) => {
                let ignoreIncludes = [];
                return ignoreIncludes.some((ignoreItem) => {
                  return ignoreItem.includes(resource);
                });
              },
              (resource) => {
                let ignoreEqual = [
                  '@nestjs/microservices',
                  '@nestjs/microservices/microservices-module',
                  '@nestjs/websockets/socket-module',
                  'class-transformer',
                  'class-validator',
                  'cache-manager',

                  '@fastify/view',

                  'pg',
                  'pg-query-stream',
                  'oracledb',
                  'mysql2',
                  'mysql',
                  'tedious',
                  'better-sqlite3',
                ];
                return ignoreEqual.some((ignoreItem) => {
                  return ignoreItem == resource;
                });
              },
            ];
            return fooArr.some((fooItem) => {
              return fooItem(resource, context);
            });
          },
        }),
      ].filter(Boolean),
      optimization: {
        chunkIds: 'total-size',
        concatenateModules: process.env.NODE_ENV === 'production',
        emitOnErrors: false,
        flagIncludedChunks: process.env.NODE_ENV === 'production',
        innerGraph: process.env.NODE_ENV === 'production',
        mangleExports: process.env.NODE_ENV === 'production' ? 'size' : false,
        mangleWasmImports: process.env.NODE_ENV === 'production',
        mergeDuplicateChunks: process.env.NODE_ENV === 'production',
        minimize: process.env.NODE_ENV === 'production',

        minimizer: [
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            include: undefined,
            exclude: undefined,
            parallel: true,
            minify: TerserPlugin.terserMinify,

            terserOptions: {
              compress: {
                arguments: true,
                arrows: true,
                booleans_as_integers: false, //! unsafe for discord //! unsafe for nest
                booleans: true,
                collapse_vars: true,
                comparisons: true,
                computed_props: true,
                conditionals: true,
                dead_code: true,
                defaults: true,
                directives: true,
                drop_console: false, //?
                drop_debugger: true,
                ecma: 2020,
                evaluate: true,
                expression: true,
                global_defs: {},
                hoist_funs: true,
                hoist_props: true,
                hoist_vars: true,
                ie8: false,
                if_return: true,
                inline: true,
                join_vars: true,
                keep_classnames: false, //! unsafe for discord
                keep_fargs: false,
                keep_fnames: false,
                keep_infinity: false,
                loops: true,
                module: true,
                negate_iife: true,
                passes: 100,
                properties: true,
                pure_funcs: [],
                pure_getters: 'strict',
                reduce_vars: true,
                reduce_funcs: true,
                sequences: true,
                side_effects: true,
                switches: true,
                toplevel: true,
                top_retain: null,
                typeofs: true,

                unsafe_arrows: false, //!unsafe for nest
                unsafe: true, //! unsafe for discord

                unsafe_comps: true,
                unsafe_Function: true,
                unsafe_math: true,
                unsafe_symbols: true,

                unsafe_methods: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                unsafe_undefined: true,

                unused: true,
              },
              ecma: 2020,
              enclose: false,
              ie8: false,
              keep_classnames: false, //!unsafe for discord
              keep_fnames: false,
              mangle: {
                eval: true,
                keep_classnames: false, //!unsafe for discord
                keep_fnames: false,
                module: true,
                properties: false, //!unsafe for nest
                safari10: false,
                toplevel: true,
              },
              module: true,
              nameCache: undefined,
              format: {
                ascii_only: false,
                beautify: false,
                braces: false,
                comments: false,
                ecma: 2020,
                ie8: false,
                keep_numbers: false,
                indent_level: 0,
                indent_start: 0,
                inline_script: true,
                keep_quoted_props: false,
                max_line_len: false,
                preamble: undefined,
                preserve_annotations: false,
                quote_keys: false,
                quote_style: 0,
                safari10: false,
                semicolons: true,
                shebang: true,
                webkit: false,
                wrap_iife: false,
                wrap_func_args: true,
              },
              parse: {
                bare_returns: true,
                html5_comments: false,
                shebang: true,
              },
              safari10: false,
              sourceMap: false,
              toplevel: true,
            },
            extractComments: false,
          }),
        ],
        moduleIds: process.env.NODE_ENV === 'production' ? 'size' : 'named',
        portableRecords: true,
        providedExports: process.env.NODE_ENV === 'production',
        realContentHash: process.env.NODE_ENV === 'production',
        removeAvailableModules: process.env.NODE_ENV === 'production',
        removeEmptyChunks: process.env.NODE_ENV === 'production',
        runtimeChunk: false,
        sideEffects: process.env.NODE_ENV === 'production',
        splitChunks: false,
        usedExports: process.env.NODE_ENV === 'production',
      },
    };
  });
};
