import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of routes that require authentication
const protectedRoutes = [
  // "/dashboard",
  // "/dashboard/tasks",
  "/dashboard/revisions",
  "/dashboard/quizzes",
  "/dashboard/groups",
  "/dashboard/leaderboard",
  "/dashboard/analytics",
  "/dashboard/settings",
];

// Routes accessible only to non-authenticated users
const authRoutes = ["/auth"];

export function middleware(request: NextRequest) {
  // Get auth data from cookie
  const authStorageData = request.cookies.get("auth-storage")?.value;

  // Parse the storage data to check if user is logged in
  const hasUser = authStorageData && JSON.parse(authStorageData)?.state?.user;
  const { pathname } = request.nextUrl;

  // Handle protected routes - redirect to login if not authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!hasUser) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Handle auth routes - redirect to dashboard if already logged in
  if (authRoutes.some((route) => pathname === route)) {
    if (hasUser) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
