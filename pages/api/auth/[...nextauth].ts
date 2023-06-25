import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      // Make the user ID available on the session object (for getSession etc.)
      session.userId = token.sub;
      session.isNewUser = token.isNewUser;
      return session;
    },
    async jwt({ token, trigger, user, account, profile, isNewUser }) {
      // Set an isNewUser property on the token to pass it to the session client-side.
      if (account) {
        token.isNewUser = isNewUser;
      }

      if (trigger === "update") {
        token.isNewUser = false;
      }

      return token;
    },
  },
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
};
export default NextAuth(authOptions);
