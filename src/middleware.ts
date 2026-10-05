import NextAuth from "next-auth";
import { NextRequest, NextResponse, type NextFetchEvent, type NextMiddleware } from "next/server";
import { authConfig, authSecret } from "@/lib/auth.config";

// Edge middleware: protects /admin/* and redirects to the secret login page.
const authMiddleware = NextAuth(authConfig).auth as NextMiddleware;

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!authSecret) {
    if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "auth-configuration");
    return NextResponse.redirect(loginUrl);
  }

  return authMiddleware(request, event);
}

export const config = {
  matcher: ["/admin/:path*"],
};
