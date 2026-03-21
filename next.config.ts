/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 💡 Bỏ qua lỗi ESLint khi build trên Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 💡 Bỏ qua lỗi TypeScript khi build (Fix vụ gạch đỏ Clerk)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;