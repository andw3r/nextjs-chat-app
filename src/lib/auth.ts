import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { comparePassword } from "@/utils/hashPassword";
import { signInSchema } from "./zod";
import { ZodError } from "zod";
import { UserRole } from "@prisma/client";
import { getUserByEmail, getUserById } from "@/actions/getUserInfo";

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt(jwt) {
      const { token, user } = jwt;

      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.email = existingUser.email;
      token.name = existingUser.name;
      token.picture = existingUser.image;

      token.role = existingUser.role;
      return token;
    },

    async session({ session, user, token }) {
      if (session.user) {
        if (token.role) session.user.role = token.role as UserRole;
        if (token.sub) session.user.id = token.sub;
        if (token.email) session.user.email = token.email;
        if (token.name) session.user.name = token.name;
        if (token.picture) session.user.image = token.picture;
      }

      return session;
    },

    },
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {

          try {
            let user = null;
            const { email, password } = await signInSchema.parseAsync(credentials);

            user = await getUserByEmail(email);

            if (!user || !user.hashedPassword) {
              throw new Error("Invalid credentials.");
            }

            const isCorrectPassword = await comparePassword(password, user.hashedPassword);

            if (!isCorrectPassword) {
              throw new Error("Invalid credentials.");
            }

            return user;
          } catch (error) {
            if (error instanceof ZodError) {
              return null;
            }
            throw error;
          }
        },
      }),

      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
          },
        },
      }),
  ],
})
