// app/api/admin/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Course } from '@/models/Course';

// GET: ดึงคอร์สตาม ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 });
  }
}

// PUT: แก้ไขคอร์ส
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const course = await Course.findByIdAndUpdate(params.id, body, { new: true });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 });
  }
}

// DELETE: ลบคอร์ส
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const course = await Course.findByIdAndDelete(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 });
  }
}