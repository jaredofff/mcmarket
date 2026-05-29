import NextAuth, { type NextAuthConfig } from "next-auth"
import type { DefaultSession, Session as NextAuthSession } from "next-auth"
import type { JWT as NextAuthJWT } from "next-auth/jwt"
import DiscordProvider from "next-auth/providers/discord"
// NOTE: Avoid top-level imports of `@prisma/client` here because this module
// is imported by Edge middleware. Use dynamic import inside server-only
// callbacks to prevent bundling Node-only modules into Edge runtime.

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      discordId: string
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId: string
    role?: string
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
      const jwtToken = token as NextAuthJWT & { discordId?: string; role?: string }

      type DiscordProfile = {
        id?: string
        username?: string
        name?: string
        email?: string | null
        avatar?: string | null
      }

      const p = profile as unknown as DiscordProfile

      // if we already have a role on the token, keep it
      if (!jwtToken.role && p?.id) {
        jwtToken.discordId = p.id as string

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001'
          const res = await fetch(`${apiUrl.replace(/\/$/, '')}/auth/upsert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              discordId: p.id as string,
              name: p.username || p.name || 'discord-user',
              email: p.email || null,
              image: p.avatar || null,
            }),
          })

          if (res.ok) {
            const data = await res.json()
            jwtToken.role = data?.role || 'USER'
          } else {
            jwtToken.role = 'USER'
          }
        } catch (e) {
          // if API fails, don't block auth — proceed without role
          
          console.error('Error calling auth upsert endpoint', e)
          jwtToken.role = 'USER'
        }
      }
      return jwtToken
    },
    async session({ session, token }): Promise<NextAuthSession> {
      if (session.user) {
        session.user.discordId = token.discordId as string
        session.user.id = token.sub as string
        session.user.role = (token.role as string) ?? undefined
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
