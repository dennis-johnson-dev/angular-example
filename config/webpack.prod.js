const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");
const path = require("path");
const PurifyPlugin = require("@angular-devkit/build-optimizer").PurifyPlugin;
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  entry: {
    vendor: [path.resolve(__dirname, "../src/client/polyfills.ts")],
  },
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /.ts$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: path.resolve(__dirname, "./tsconfig.client.json"),
            },
          },
          { loader: "angular2-template-loader?keepUrl=true" },
          {
            loader: "@angular-devkit/build-optimizer/webpack-loader",
            options: {
              sourceMap: false,
            },
          },
        ],
        include: path.resolve(__dirname, "../src/client"),
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "file-loader?name=[hash]-[name].[ext]",
          },
          { loader: "extract-loader" },
          {
            loader: "html-loader",
            options: {
              minimize: false,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          { loader: "file-loader" },
          {
            loader: "image-webpack-loader",
            options: {
              gifsicle: {
                enabled: true,
                colors: 200,
                optimizationLevel: 3,
              },
              pngquant: {
                enabled: true,
                quality: "65-90",
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new UglifyJsPlugin({
      cache: true,
      parallel: 3,
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
        },
      },
      sourceMap: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CompressionPlugin({
      asset: "[file].gz",
      algorithm: "gzip",
      test: /\.(css|js|html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new StatsWriterPlugin({
      transform: (data, opts) => {
        const assets = data.assetsByChunkName;
        const output = {};

        Object.keys(assets).forEach(assetName => {
          const assetsByChunk = assets[assetName];

          output[assetName] = getFilesByType(assetsByChunk);
        });

        return JSON.stringify(output, null, 2);
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "runtime"],
      minChunks: Infinity,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new PurifyPlugin(),
  ],
  recordsPath: path.resolve(__dirname, "../records.json"),
});

function getFilesByType(assets) {
  const rawAssets = assets.filter(asset => !asset.includes(".map"));

  const extRegEx = /.+(\.(.+))$/;
  const extMap = {};

  rawAssets.forEach(asset => {
    const matches = asset.match(extRegEx);
    const ext = matches[2];

    if (extMap[ext]) {
      extMap[ext].push(matches[0]);
    } else {
      extMap[ext] = [matches[0]];
    }
  });

  return extMap;
}
