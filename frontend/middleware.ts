import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    // Public paths that don't require authentication
    const publicPaths = ['/login', '/register'];

    // Check if the current path is public
    const { pathname } = request.nextUrl;
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Redirect logic
    // 1. If no token and trying to access protected route -> Login
    if (!token && !isPublicPath) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }

    // 2. If token exists and trying to access public route -> Dashboard
    if (token && isPublicPath) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    // In case of error, allow request to proceed to avoid blocking the site
    return NextResponse.next();
  }
}

export const config = {
  // Exclude API, Next.js internals, and static assets
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

