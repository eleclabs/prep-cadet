// app/api/admin/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Course } from '@/models/Course';

// 🎯 Helper: ดึง id จาก params (ลดโค้ดซ้ำ)
async function getCourseId(params: Promise<{ id: string }>): Promise<string> {
  const resolved = await params;
  return resolved.id;
}

// ✅ GET: ดึงคอร์สตาม ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // ✅ ต้อง await params ก่อนใช้
    const { id } = await params;

    const course = await Course.findById(id); // ✅ ใช้ id ที่ await แล้ว
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('GET course error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 });
  }
}

// ✅ PUT: แก้ไขคอร์ส
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // ✅ ต้อง await params ก่อนใช้
    const { id } = await params;
    
    const body = await req.json();
    const course = await Course.findByIdAndUpdate(id, body, { 
      new: true, 
      runValidators: true 
    });
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('PUT course error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 });
  }
}

// ✅ DELETE: ลบคอร์ส
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // ✅ ต้อง await params ก่อนใช้
    const { id } = await params;
    
    const course = await Course.findByIdAndDelete(id); // ✅ ใช้ id ที่ await แล้ว
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('DELETE course error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 });
  }
}