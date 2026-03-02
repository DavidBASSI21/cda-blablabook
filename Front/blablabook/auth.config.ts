import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/se-connecter",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          throw new Error("Email ou mot de passe invalide");
        }

        const response = await fetch(`${apiBaseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const message = errorData?.message || "Identifiants incorrects";
          throw new Error(message);
        }

        const data = await response.json();
        if (!data?.user) return null;

        return {
          id: String(data.user.id),
          email: data.user.email,
          username: data.user.username,
          isPrivate: data.user.isPrivate,
          profilePicture: data.user.profilePicture ?? null,
          accessToken: data.token ?? data.refresh_token,
          refreshToken: data.refresh_token ?? null,
          roleId: data.user.roleId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          isPrivate: user.isPrivate,
          profilePicture: user.profilePicture ?? null,
          roleId: user.roleId,
        };
        token.accessToken = user.accessToken ?? null;
        token.refreshToken = user.refreshToken ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      session.accessToken = token.accessToken ?? null;
      session.refreshToken = token.refreshToken ?? null;
      return session;
    },
  },
});
