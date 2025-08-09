import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
const isPublicRoute = createRouteMatcher([
  '/',                       // Home page
  '/sign-in(.*)',            // Sign-in and its subroutes
  '/sign-up(.*)',
  '/events/:id',             // Event detail pages
  '/api/webhook/clerk',      // Clerk webhook (public or ignored)
  '/api/webhook/stripe',     // Stripe webhook
  '/api/uploadthing'         // Upload endpoint
]);


export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}