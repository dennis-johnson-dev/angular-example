const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  devtool: "cheap-module-eval-source-map",
  devServer: {
    compress: false,
    hot: true,
    port: 1337,
    proxy: {
      "/": "http://localhost:3010"
    }
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: path.resolve(__dirname, "./tsconfig.client.json")
            }
          },
          { loader: "angular2-template-loader?keepUrl=false" }
        ],
        include: path.resolve(__dirname, "../src/client"),
        exclude: [/\.spec/, /node_modules/]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{ loader: "file-loader" }]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
