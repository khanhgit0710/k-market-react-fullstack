/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 💡 THÊM DÒNG NÀY ĐỂ VERCEL KHÔNG SO QUÁ KỸ
  images: {
    unoptimized: true,
  },
};

export default nextConfig;