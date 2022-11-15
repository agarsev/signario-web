const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['better-sqlite3'],
  }
}

if (process.env.NODE_ENV == 'development') {
  nextConfig.rewrites = async function () {
    return [ {
      source: '/signo/:a(\\d{3}):b(\\d{2})/video.mp4',
      destination: `${process.env.VID_SERVER}/:a/:b.mp4`,
    } ]
  };
}

module.exports = nextConfig;
