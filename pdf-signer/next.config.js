/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    
    // Remove pdfjs-dist from externals
    config.externals = config.externals.filter(external => {
      if (typeof external === 'object' && external['pdfjs-dist']) {
        return false;
      }
      return true;
    });
    
    return config
  },
  experimental: {
    optimizePackageImports: ['@react-pdf-viewer/core']
  }
}

module.exports = nextConfig 