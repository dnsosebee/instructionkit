module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
  //   const newConfig = config.plugins.push(
  //     new webpack.IgnorePlugin({ resourceRegExp: /^pg-mem|pg$/ }),
  //   )
  //   return config
  // },
}
