import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Basic check for auth-storage cookie/localstorage is tricky in middleware.
  // Next.js middleware runs on edge, standard zustand persist uses localstorage.
  // For a robust app, we'd use cookies for JWT. Since we use Zustand localstorage for now,
  // we might just let the client side redirect, or implement a simple check here if we switch to cookies.
  
  // For now, we will do a simple path check and allow client side auth guard to handle it,
  // or we can assume it's publicly accessible until mounted if no cookie.
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
