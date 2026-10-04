import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge middleware: protects /admin/* and redirects to the secret login page.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
