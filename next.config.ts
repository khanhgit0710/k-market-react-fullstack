/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 💡 Bỏ qua lỗi ESLint khi build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 💡 Bỏ qua lỗi TypeScript khi build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;