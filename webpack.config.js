var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin') // 生成html模板
var CleanWebpackPlugin = require('clean-webpack-plugin')
var UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin') // 优化压缩js
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin') // 把css和js分离
var OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin') // 优化压缩css
var Purifycss = require('purifycss-webpack') // 对css进行tree-shaking
var glob      = require('glob-all')
var Webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'app')
  },
  resolve: {
    extensions: ['.js'], // 解析的文件规则
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test:/\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')]
      },{
        test: /\.css$/,
        loader: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','postcss-loader']
        })
      },{
        test: /\.(jpg|png|jpeg)$/,
        loader:'url-loader',
        options: {
          limit: 1000,
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
        }
      },
      //读取html，打包src图片
      {
          test: /\.html$/,
          loader: "html-withimg-loader" // 从html中提取src文件
      }
    ]
  },
  // 一下配合webpack4使用，不再支持原有的webpack3的配置  貌似没有起作用？
  optimization: {
    minimizer: [
      new UglifyjsWebpackPlugin({
        test: /\.js(\?.*)?$/i,
        include: /\/src/,
        exclude: /\/node_modules/,
        uglifyOptions: {
          warnings: false,
          output: {
            comments: false
          },
        }
      })
    ]
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': 'development'
    }),
    new OptimizeCssPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new Purifycss({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    new ExtractTextWebpackPlugin('static/css/[name].min.css'),
    new HtmlWebpackPlugin({
      template: './index.html',
      chunks: ['main'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new CleanWebpackPlugin(),
    // keep module.id stable when vendor modules does not change
    new Webpack.HashedModuleIdsPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './app',
    hot: true
  }
}