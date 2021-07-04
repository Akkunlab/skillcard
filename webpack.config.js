require('dotenv').config();
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    
  entry: {
    "generator": "./src/client/generator/index.js",
    "users": "./src/client/users/index.js"
  },

  output: {
    path: `${__dirname}/public/js`,
    filename: "[name].js"
  },

  mode: process.env.MODE,

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
                ],
              },
            },
          ],
      },
    ],
  },

  plugins: [
    new JavaScriptObfuscator({rotateUnicodeArray: true}, [])
  ],
    
  target: ["web", "es5"]
};