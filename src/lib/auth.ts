import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyCredentials } from "@/lib/user-store";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await verifyCredentials(credentials.email, credentials.password);
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as { id?: string; email?: string; name?: string; phone?: string };
        token.id = authUser.id;
        token.name = authUser.name;
        token.email = authUser.email;
        token.phone = authUser.phone;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          phone: token.phone,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-phonelenz",
};
