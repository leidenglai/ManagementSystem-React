var path = require('path'),
  webpack = require('webpack'),
  NyanProgressPlugin = require('nyan-progress-webpack-plugin'),
  LodashModuleReplacementPlugin = require('lodash-webpack-plugin'),
  rucksack = require('rucksack-css'),
  autoprefixer = require('autoprefixer');

// 静态资源目录
const CDN_PATH = "//static.mynovoshops.com/static/";

var rootPath = path.resolve(__dirname, '..'), // 项目根目录
  src = path.join(rootPath, 'src'), // 开发源码目录
  env = process.env.NODE_ENV.trim(); // 当前环境
var commonPath = {
  rootPath: rootPath,
  dist: path.join(rootPath, 'dist'), // build 后输出目录
  indexHTML: path.join(src, 'index.html'), // 入口基页
  staticDir: path.join(rootPath, 'static') // 无需处理的静态资源目录
};

module.exports = {
  commonPath: commonPath,

  // webpack主要公共配置
  config: {
    entry: {
      // ================================
      // 框架 / 类库 分离打包
      // ================================
      vendor: [
        'babel-polyfill',
        'es6-promise',
        'history',
        'immutability-helper',
        'react',
        'react-dom',
        'react-intl',
        'react-redux',
        'react-router',
        'rc-queue-anim',
        'rc-tween-one',
        'react-router-redux',
        'redux',
        'redux-thunk',
        'whatwg-fetch'
      ],
      vendorAntd: [
        'antd/lib/alert',
        'antd/lib/badge',
        'antd/lib/breadcrumb',
        'antd/lib/button',
        'antd/lib/card',
        'antd/lib/checkbox',
        'antd/lib/col',
        'antd/lib/dropdown',
        'antd/lib/form',
        'antd/lib/icon',
        'antd/lib/input',
        'antd/lib/layout',
        'antd/lib/locale-provider',
        'antd/lib/menu',
        'antd/lib/message',
        'antd/lib/modal',
        'antd/lib/pagination',
        'antd/lib/popconfirm',
        'antd/lib/popover',
        'antd/lib/progress',
        'antd/lib/row',
        'antd/lib/select',
        'antd/lib/slider',
        'antd/lib/steps',
        'antd/lib/style',
        'antd/lib/table',
        'antd/lib/tabs',
        'antd/lib/tag',
        'antd/lib/tooltip',
        'antd/lib/upload'
      ],
      app: path.join(src, 'app.js')
    },
    output: {
      path: path.join(commonPath.dist, 'static'),
      publicPath: CDN_PATH
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        // ================================
        // 自定义路径别名
        // ================================
        assets: path.join(src, 'assets'),
        components: path.join(src, 'components'),
        constants: path.join(src, 'constants'),
        actions: path.join(src, 'redux/actions'),
        reducers: path.join(src, 'redux/reducers'),
        store: path.join(src, 'redux/store'),
        routes: path.join(src, 'routes'),
        services: path.join(src, 'services'),
        utils: path.join(src, 'utils'),
        HoC: path.join(src, 'utils/HoC'),
        mixins: path.join(src, 'utils/mixins'),
        containers: path.join(src, 'containers'),
        config: path.join(src, 'config')
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ['babel-loader?' + JSON.stringify({
            cacheDirectory: true,
            plugins: [
                'transform-runtime',
                'transform-decorators-legacy',
                "react-hot-loader/babel",
                ["import", {
                "libraryName": "antd",
                "style": true
                }],
                "lodash"
              ],
            presets: [
                ["es2015", { "modules": false }],
                'react',
                'stage-2'
              ],
            env: {
              production: {
                presets: ['react-optimize']
              }
            }
          }), 'eslint-loader'],
          include: src,
          exclude: /node_modules/
        }, {
          test: /\.html$/,
          loader: 'html-loader'
        }, {
          test: /\.(png|jpe?g|gif|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 10240, // 10KB 以下使用 base64
            name: 'img/[name]-[hash:6].[ext]'
          }
        }, {
          test: /\.(woff2?|eot|ttf|otf)$/,
          loader: 'url-loader?limit=10240&name=fonts/[name]-[hash:6].[ext]'
        }
      ]
    },
    plugins: [
      new NyanProgressPlugin(), // 进度条

      /**
       * https://webpack.js.org/guides/migrating/#loader-configuration-is-through-options
       * 公共配置
       */
      new webpack.LoaderOptionsPlugin({
        options: {
          eslint: {
            formatter: require('eslint-friendly-formatter')
          },
          postcss: [
            rucksack(),
            autoprefixer({
              browsers: ['last 2 versions', 'Firefox ESR', '> 2%', 'ie >= 10', 'iOS >= 9'],
            })
          ]
        }
      }),

      new webpack.optimize.CommonsChunkPlugin({
        // 公共代码分离打包
        // names: ['vendor']

        names: ['vendor', 'vendorAntd', 'manifest'],
        minChunks: 'Infinity'
      }),

      /**
       * https://github.com/lodash/lodash-webpack-plugin
       * 按需打包Lodash.js
       */
      new LodashModuleReplacementPlugin({
        'shorthands': true,
        'collections': true,
        'caching': true
      }),

      new webpack.DefinePlugin({
        'process.env': { // 这是给 React / Redux 打包用的
          NODE_ENV: JSON.stringify('production')
        },
        // ================================
        // 配置开发全局常量
        // ================================
        __DEV__: env === 'development',
        __PROD__: env === 'production',
        __COMPONENT_DEVTOOLS__: false, // 是否使用组件形式的 Redux DevTools
        __WHY_DID_YOU_UPDATE__: false // 是否检测不必要的组件重渲染
      })
    ]
  }
};
