// app/api/courses/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Course } from '@/models/Course';

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({ isActive: true });
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // สำหรับ Admin เพิ่มคอร์สใหม่ (ควรใส่ Auth Guard ตรงนี้)
  try {
    await dbConnect();
    const body = await req.json();
    const course = await Course.create(body);
    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 });
  }
}