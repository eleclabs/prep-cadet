// lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import { User as UserModel } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // ✅ ตรวจสอบว่า credentials มีค่า
        if (!credentials?.email || !credentials?.password) {
          throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
        }

        await dbConnect();
        
        // ✅ ค้นหาผู้ใช้
        const user = await UserModel.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("ไม่พบผู้ใช้งานนี้");
        }

        // ✅ ตรวจสอบรหัสผ่าน
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        // ✅ ส่งกลับข้อมูลผู้ใช้ (ต้องมี id เป็น string)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,  // ✅ role จะถูกยอมรับเพราะเรา extend type ไว้แล้ว
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // ✅ เมื่อ login สำเร็จ ให้เพิ่ม role ลงใน token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // ✅ ส่ง role จาก token ไปยัง session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;  // ✅ ไม่ต้อง cast as any แล้ว
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // ✅ เปิด debug ในโหมดพัฒนา
};