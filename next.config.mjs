

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({"utf-8-validate": "commonjs utf-8-validate",
    "bufferutil" : "commomjs bufferutil",
    canvas: "commonjs canvas",
})
    return config;
  },
    images:{
        remotePatterns: [
       { 
        protocol: 'https',
        hostname: 'liveblocks.io',
        port:''
    }
    ]},
      webpack: (config) => {
        config.externals = [...config.externals, { canvas: "canvas" }];  // required to make Konva & react-konva work
        return config;
      },
      typescript:{
        ignoreBuildErrors: true
      }
};

export default nextConfig;
