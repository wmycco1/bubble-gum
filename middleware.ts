// ═══════════════════════════════════════════════════════════════
// CLERK MIDDLEWARE - ROUTE PROTECTION
// ═══════════════════════════════════════════════════════════════
// Protects authenticated routes with Clerk authentication
// Updated for Next.js 16 + Clerk 6
// ═══════════════════════════════════════════════════════════════

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Define public routes that don't require authentication
 */
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/pricing',
  '/blog(.*)',
]);

/**
 * Clerk middleware for Next.js 16
 * Protects all routes except those defined in isPublicRoute
 */
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

/**
 * Matcher configuration for middleware
 * Runs on all routes except static files and Next.js internals
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes and tRPC
    '/(api|trpc)(.*)',
  ],
};
