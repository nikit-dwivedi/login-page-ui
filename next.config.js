/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // This is necessary for Vanta.js and THREE.js to work properly
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three')
    };
    return config;
  },
  // Transpile Vanta.js modules
  transpilePackages: ['three', 'vanta']
}

module.exports = nextConfig
