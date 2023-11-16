const withAntdLess = require("next-plugin-antd-less");
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pbs.twimg.com", process.env.NEXT_PUBLIC_APP_URL],
    loader: "custom",
    loaderFile: "./image-loader.ts",
    unoptimized: true,
  },
  // distDir: "build",
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_APP_URL + "/:path*",
      },
    ];
  },

  // output: "export",
  // images: {
  // /
  // },
};

module.exports = withAntdLess({
  ...nextConfig,
});
