import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ambil token dari cookies
  const token = request.cookies.get('token')?.value

  // Ambil path dari URL
  const { pathname } = request.nextUrl

  // Tambahkan '/register' agar tidak di-redirect ke login
  const publicPaths = ['/login', '/register']

  // Cek apakah path termasuk halaman publik
  const isPublicPath = publicPaths.includes(pathname)

  // Jika tidak punya token dan mencoba akses halaman yang butuh login → redirect ke login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika sudah login (punya token) dan mencoba buka halaman login/register → redirect ke dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Lanjut ke halaman yang diminta
  return NextResponse.next()
}

// Tentukan route mana saja yang dicegat oleh middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
