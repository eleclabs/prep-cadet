// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  // ✅ ขยาย Session ให้มี role
  interface Session {
    user: {
      id: string;
      role: string;  // ✅ เพิ่ม role
    } & DefaultSession["user"];
  }

  // ✅ ขยาย User ให้มี role
  interface User extends DefaultUser {
    role: string;  // ✅ เพิ่ม role
  }
}

declare module "next-auth/jwt" {
  // ✅ ขยาย JWT Token ให้มี role
  interface JWT extends DefaultJWT {
    role: string;  // ✅ เพิ่ม role
  }
}