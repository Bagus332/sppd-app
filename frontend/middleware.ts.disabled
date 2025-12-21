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
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. If token exists and trying to access public route -> Dashboard
    if (token && isPublicPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.next();
  }
}

export const config = {
  // Exclude API, Next.js internals, and static assets
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

