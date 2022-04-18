require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname + "/dist/src",
        filename: "index.js"
    },
    devServer: {
       static: "./dist/src",
      client: {
        progress: true,
      },
      compress: true,
      port: 3000,
      hot: true,
      liveReload: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react",
                                {
                                    'plugins': ['@babel/plugin-proposal-class-properties']
                                }
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
			{
				test: /\.svg$/,
				use: ["@svgr/webpack"]
			}
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/index.html", to: "./" },
                { from: "manifest.json", to: "../" },
                { from: "assets/icons", to: "../assets" },
            ],
        })
    ]
};