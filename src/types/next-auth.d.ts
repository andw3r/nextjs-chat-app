import { UserRole } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

type SessionUser = DefaultSession["user"]  & {
  role : UserRole
}
declare module "next-auth" {
 interface Session extends DefaultSession {
 user : SessionUser
 }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
  }
}