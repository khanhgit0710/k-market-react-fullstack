import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/register(.*)',
  '/product/(.*)',
  '/api/(.*)', 
  '/sso-callback(.*)'
]);

// 💡 BẮT BUỘC PHẢI LÀ EXPORT DEFAULT
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const authObj = await auth();
    authObj.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};