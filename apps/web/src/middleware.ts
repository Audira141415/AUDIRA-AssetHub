import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: [
    // Protect all routes EXCEPT:
    // - /api/auth/* (NextAuth endpoints)
    // - /login
    // - _next/static, _next/image, favicon.ico (Next.js internals and assets)
    // - /images/* (Public images)
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|images|$).*)',
  ],
}
