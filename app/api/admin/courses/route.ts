// app/api/admin/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Course } from '@/models/Course';

// GET: ดึงรายการคอร์สทั้งหมด
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST: เพิ่มคอร์สใหม่
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const course = await Course.create(body);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 });
  }
}