import NextAuth, { NextAuthConfig, Session } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image: string
      discordId: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId: string
  }
}

export const authConfig = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.id) {
        token.discordId = profile.id as string
      }
      return token
    },
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        session.user.discordId = token.discordId as string
        session.user.id = token.sub as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirigir al login
      }
      return true;
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
