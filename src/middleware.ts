import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The names of the cookies that Firebase Authentication uses
const FIREBASE_AUTH_COOKIE_NAMES = [
  'firebase-auth-id-token',
  'firebase-auth-refresh-token',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define protected routes
  const protectedRoutes = ['/reservations', '/recommendations'];

  // Check if the current route is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Check if any of the Firebase auth cookies are present
    const hasAuthCookie = FIREBASE_AUTH_COOKIE_NAMES.some(cookieName => request.cookies.has(cookieName));

    if (!hasAuthCookie) {
      // If no auth cookie, redirect to the login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_to', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/reservations/:path*', '/recommendations/:path*'],
}
