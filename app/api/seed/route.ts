// app/api/seed/route.ts (เรียกครั้งเดียวแล้วลบไฟล์นี้ทิ้ง)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  await dbConnect();
  const hashedPassword = await bcrypt.hash("123456", 10); // รหัสผ่านเริ่มต้น
  
  await User.create({
    email: "admin@school.com",
    password: hashedPassword,
    name: "Admin",
    role: "admin"
  });

  return NextResponse.json({ message: "Admin created! Email: admin@school.com, Pass: 123456" });
}