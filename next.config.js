/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    '26.170.87.49',
    '192.168.68.118',
    '10.166.191.85',
    'kind-rules-rush.loca.lt',
    'lou-physical-assure-tires.trycloudflare.com',
    'localhost',
  ],
  images: {
    domains: ['res.cloudinary.com'],
  }
};

module.exports = nextConfig;
