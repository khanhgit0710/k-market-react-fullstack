import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/register(.*)',
  '/product/(.*)',
  '/api/(.*)', // Thả hết API cho nhàn
  '/sso-callback(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // Chỉ bảo vệ trang /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const authObj = await auth();
      authObj.protect();
    }
  }
});

export const config = {
  matcher: [
    // 💡 FIX CHÍ MẠNG: Cho phép các file tĩnh chạy mượt
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};