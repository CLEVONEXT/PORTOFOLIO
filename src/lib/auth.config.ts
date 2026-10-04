import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe subset of the Auth.js config.
 * Used by `middleware.ts` (Edge runtime) which cannot import Prisma/bcrypt.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = request.nextUrl.pathname.startsWith("/admin/login");

      if (isLoginRoute) return true;
      if (isAdminRoute) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
