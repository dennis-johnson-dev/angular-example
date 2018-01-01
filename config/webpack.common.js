const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const rxPaths = require("rxjs/_esm2015/path-mapping");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "../src/client/app/index.ts")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../lib/resources"),
    publicPath: "/"
  },
  resolve: {
    alias: rxPaths(),
    extensions: [".ts", ".js", ".html", ".css", ".scss", ".png"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "../node_modules/rxjs")],
        use: {
          loader: "babel-loader?cacheDirectory",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  modules: false
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "to-string-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("autoprefixer")({
                  grid: true
                })
              ],
              sourceMap: true
            }
          },

          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.BUILD_ENV": JSON.stringify(process.env.BUILD_ENV)
    }),
    new webpack.ContextReplacementPlugin(
      /@angular(\\|\/)core(\\|\/)esm5/,
      path.resolve(__dirname, "../src")
    ),
    new CopyWebpackPlugin([
      {
        from: path.resolve(
          __dirname,
          "../node_modules/es6-promise/dist/es6-promise.auto.min*"
        ),
        to: "[name].[ext]"
      },
      {
        from: path.resolve(
          __dirname,
          "../node_modules/le_js/product/le.min.js"
        ),
        to: "[name].[ext]"
      }
    ])
  ]
};
