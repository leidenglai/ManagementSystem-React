var path = require('path'),
  fs = require('fs'),
  webpack = require('webpack'),
  baseConfig = require('./webpack.base.conf'),
  config = baseConfig.config,
  commonPath = baseConfig.commonPath,
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
  SOURCE_MAP = false;

var rootPath = path.resolve(__dirname, '..'), // 项目根目录
  src = path.join(rootPath, 'src'), // 开发源码目录
  env = process.env.NODE_ENV.trim(); // 当前环境

var pkgPath = path.join(rootPath, 'package.json');
var pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};

var theme = {};
if (pkg.theme && typeof(pkg.theme) === 'string') {
  var cfgPath = pkg.theme;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = path.resolve(rootPath, cfgPath);
  }
  var getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (pkg.theme && typeof(pkg.theme) === 'object') {
  theme = pkg.theme;
}

config.output.publicPath = '/';
config.output.filename = '[name].js';
config.output.chunkFilename = '[id].js';

config.devtool = SOURCE_MAP ? 'eval-source-map' : false;

// add hot-reload related code to entry chunk
config.entry.app = [
  // 开启react代码的模块热替换（HMR）
  'react-hot-loader/patch',

  'webpack-hot-middleware/client?reload=true',
  // 为热替换（HMR）打包好运行代码
  // only- 意味着只有成功更新运行代码才会执行热替换（HMR）
  'webpack/hot/only-dev-server',
  config.entry.app
];

// 开发环境下直接内嵌 CSS 以支持热替换
// modifyVars 替换默认主题
config.module.rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader'
  ]
}, {
  test: /\.less$/,
  use: [
   'style-loader',
   'css-loader',
   'postcss-loader',
   `less-loader?{"modifyVars":${JSON.stringify(theme)}}`
  ]
}, {
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',
   ' sass-loader'
  ]
});

config.plugins.push(
  // 开启全局的模块热替换（HMR）
  new webpack.HotModuleReplacementPlugin(),

  // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new ExtractTextPlugin({
    filename: '[name].css'
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: commonPath.indexHTML,
    chunksSortMode: 'dependency'
  }),
  new BrowserSyncPlugin({
    host: '127.0.0.1',
    open: false,
    port: 9090,
    proxy: 'http://127.0.0.1:9000/',
    logConnections: false,
    notify: false,
    browser: "google chrome"
  }, {
    reload: false
  })
);

module.exports = config;
