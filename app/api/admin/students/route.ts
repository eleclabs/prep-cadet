// app/api/admin/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Student } from '@/models/Student';

// GET: ดึงรายการนักเรียนทั้งหมด
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const students = await Student.find().populate('selectedCourse').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, students });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
  }
}