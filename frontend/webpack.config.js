const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  plugins: [
      new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),

      headHtmlSnippet: '<style>@import "style.css";body {margin: 0}</style>',
      bodyHtmlSnippet: '<section id="splashScreen"><div class="background"></div><div class="container"><p class="siteName-container"><h1><span>Sound of Prague</span></h1></p>\n<div class="base"><div class="flyingText first"><p class="experience">experience</p><p class="feel">feel</p><p class="listen">listen</p><p class="walk">walk</p></div><button class="go" id="enterButton">enter</button><div class="flyingText second"><p class="city">the City</p><p class="Prague">Prague</p><p class="urban">urban</p></div></div><div class="about"><p><a href=".">About</a> this project.</p></div></div></section>',
      meta: [
        {
          name: 'description',
          content: 'Sounds of Prague project for CCC on FIT CTU in Prague'
        }
      ],
      mobile: true,
      lang: 'en-US',
      links: [
        'https://fonts.googleapis.com/css?family=Roboto',
        {
          href: '/apple-touch-icon.png',
          rel: 'apple-touch-icon',
          sizes: '180x180'
        },
        {
          href: '/favicon-32x32.png',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png'
        }
      ],
      inlineManifestWebpackName: 'webpackManifest',
      scripts: [
        {
          src: 'main.js',
          type: 'module'
        }
      ],
      title: 'Sounds of Prague'
    })],
  devServer: {
    contentBase: ['dist', 'assets']
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader'
    }, {
      test: /.css$/,

      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",

        options: {
          sourceMap: true
        }
      }]
    }]
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false
    }
  }
}
