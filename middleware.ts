import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow public access to portfolio pages
    if (req.nextUrl.pathname.startsWith("/portfolio/")) {
      return NextResponse.next();
    }

    // Require authentication for all other routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to portfolio pages
        if (req.nextUrl.pathname.startsWith("/portfolio/")) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - portfolio (public portfolio pages)
     * - auth (authentication pages)
     * - $ (the root path, i.e. /)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|portfolio|auth|$).*)",
  ],
};
