/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/stock',
        destination: '/',
        permanent: true, // 如果是永久重定向使用true，临时重定向使用false
      },
    ];
  },
};

module.exports = nextConfig;