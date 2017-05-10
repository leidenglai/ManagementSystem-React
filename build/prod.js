var fs = require('fs'),
  path = require('path'),
  webpack = require('webpack'),
  commonPath = require('./webpack.base.conf').commonPath,
  config = require('./webpack.prod.conf');

webpack(config, function(err, stats) {
  // show build info to console
  console.log(stats.toString({ chunks: false, color: true }));

  // save build info to file
  fs.writeFile(
    path.join(commonPath.dist, '__build_info__'),
    stats.toString({ color: false })
  );
});
