import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // If user is NOT logged in and tries to access protected routes
  if (
    !token &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/quiz") ||
      pathname.startsWith("/history"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

/**
 * 👇 THIS IS THE MATCHER
 * It tells Next.js which routes should use this middleware
 */
export const config = {
  matcher: ["/dashboard/:path*", "/quiz/:path*", "/history/:path*"],
};