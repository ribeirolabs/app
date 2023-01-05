import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db/client";
import { env } from "@/env/server.mjs";

const authorizationUrl = new URL(
  "https://accounts.google.com/o/oauth2/v2/auth"
);
authorizationUrl.searchParams.set("prompt", "consent");
authorizationUrl.searchParams.set("access_type", "offline");
authorizationUrl.searchParams.set("response_type", "code");

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/sigin",
  },
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      const email = user.email;
      if (!email) {
        throw new Error("[sign-in] Missing email");
      }
      const access_token = account.access_token;
      if (access_token == null) {
        throw new Error("[sign-in] Missing access_token");
      }
      await prisma.account.upsert({
        update: {
          access_token: account.access_token,
          id_token: account.id_token,
          scope: account.scope,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          user: {
            connect: {
              email,
            },
          },
        },
        create: {
          ...account,
          access_token,
          userId: undefined,
          user: {
            connect: {
              email,
            },
          },
        },
        where: {
          provider_providerAccountId: {
            providerAccountId: account.providerAccountId,
            provider: account.provider,
          },
        },
      });
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: authorizationUrl.toString(),
    }),
  ],
};

export default NextAuth(authOptions);
