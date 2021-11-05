const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/NFTList.html", to: "NFTList.html" }]),
    new CopyWebpackPlugin([{ from: "./src/AuctionList.html", to: "AuctionList.html" }]),
    new CopyWebpackPlugin([{ from: "./src/bootstrap-3.3.5-dist", to: "bootstrap-3.3.5-dist" }]),
    new CopyWebpackPlugin([{ from: "./src/css", to: "css" }]),
    new CopyWebpackPlugin([{ from: "./src/img", to: "img" }]),
    new CopyWebpackPlugin([{ from: "./src/jtable.2.4.0", to: "jtable.2.4.0" }]),
    new CopyWebpackPlugin([{ from: "./src/script", to: "script" }]),
    new CopyWebpackPlugin([{ from: "./src/ui-layout-0.0.0", to: "ui-layout-0.0.0" }]),
    new CopyWebpackPlugin([{ from: "./src/index.js", to: "index.js" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
