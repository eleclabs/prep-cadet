// app/api/admin/students/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Student } from '@/models/Student';

// ✅ PUT: อัปเดตสถานะนักเรียน
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
    
    // ✅ ต้อง await params ก่อนดึง id
    const { id } = await params;
    
    const body = await req.json();
    
    // ✅ ใช้ id ที่ await แล้ว
    const student = await Student.findByIdAndUpdate(id, body, { 
      new: true, 
      runValidators: true 
    }).populate('selectedCourse');
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error('PUT student error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 });
  }
}

// ✅ DELETE: ลบนักเรียน
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
    
    // ✅ ต้อง await params ก่อนดึง id
    const { id } = await params;
    
    // ✅ ใช้ id ที่ await แล้ว
    const student = await Student.findByIdAndDelete(id);
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error('DELETE student error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 });
  }
}