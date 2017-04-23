'use strict';

const webpack = require("webpack")
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')

let production = 'production'//process.env.NODE_ENV //'production';

module.exports = {
  entry: {
    PlaneLight: path.resolve(__dirname, "./components/PlaneLight/index.js"),
    Funnel: path.resolve(__dirname, "./components/Funnel/index.js")
  },
  output: {
    path: path.resolve(__dirname, "./components/"),
    filename: "[name]/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        /* 排除模块安装目录的文件 */
        exclude: /node_modules/
      }
    ]
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  devServer: {
    contentBase: path.join(__dirname),
    hot: true,
    inline: true,
    open: true
  },
  // adding plugins to your configuration
  plugins: [
    new webpack.HotModuleReplacementPlugin(),// 热加载插件
  ]
}
//判断为生产模式,压缩js

if (production === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"'
    //   }
    // }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CompressionWebpackPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ])
}