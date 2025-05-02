import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Array of paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/dashboard/tasks",
  "/dashboard/analytics",
  "/dashboard/groups",
  "/dashboard/leaderboard",
  "/dashboard/quizzes",
  "/dashboard/revisions",
  "/dashboard/settings",
];

// Array of paths that should redirect to dashboard if already authenticated
const authPaths = ["/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value;

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if path is an auth path
  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  try {
    // If no token and trying to access protected route
    if (isProtectedPath && !token) {
      // Redirect to login page
      const url = new URL("/auth", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // If there's a token, verify it
    if (token) {
      try {
        // Verify the token using the secret
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET || "hellorandomkeynotforproduction"
        );

        // Verify and decode the token
        await jwtVerify(token, secret);

        // If token is valid and user is trying to access auth pages, redirect to dashboard
        if (isAuthPath) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (error) {
        console.log("Invalid token:", error);
        // Token is invalid, remove it
        if (isProtectedPath) {
          // Redirect to login page if trying to access protected route
          const response = NextResponse.redirect(new URL("/auth", request.url));
          // Clear the invalid token
          response.cookies.delete("auth_token");
          return response;
        }
      }
    }

    // Otherwise, continue
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Continue the request but don't protect the route in case of errors
    return NextResponse.next();
  }
}

// Configure the middleware to run only on the specified paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
