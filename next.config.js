const webpack = require("webpack");
const { parsed: myEnv } = require("dotenv").config({
  path: "./.env",
});

module.exports = {
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
