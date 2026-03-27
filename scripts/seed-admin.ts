// scripts/seed-admin.ts
// รันไฟล์นี้ด้วย ts-node หรือ copy logic ไปรันใน API ชั่วคราว
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User'; // ปรับ path ให้ถูกต้อง
import dbConnect from '../lib/db'; // ปรับ path ให้ถูกต้อง

async function createAdmin() {
  await dbConnect();

  const email = "admin@gmail.com";
  const password = "admin1234"; // เปลี่ยนรหัสผ่านทันทีที่ล็อกอินได้
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      email,
      password: hashedPassword,
      name: "ผู้บังคับการ",
      role: "admin"
    });
    console.log("Admin created successfully!");
  } catch (error) {
    console.log("Admin might already exist or error:", error);
  }
  
  process.exit(0);
}

createAdmin();