/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["technology.nasa.gov", "epic.gsfc.nasa.gov"],
  },
};

module.exports = nextConfig;