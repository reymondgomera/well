/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  webpack: config => {
    config.module.rules.push({
      test: /\.ttf$/i,
      type: 'asset/resource'
    });
    return config;
  }
};
