// app/api/exams/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Exam } from '@/models/Exam';
import { Question } from '@/models/Question';

// GET: ดึงข้อมูลข้อสอบเพื่อเริ่มทำ (ไม่รวมคำตอบที่ถูก)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    const exam = await Exam.findById(id)
      .select('title description subject difficulty duration passingScore')
      .populate({
        path: 'questions',
        select: 'text options _id',  // ✅ ไม่ส่ง correctAnswer ให้ client
      });
    
    if (!exam || !exam.isActive) {
      return NextResponse.json({ error: 'Exam not found or not available' }, { status: 404 });
    }
    
    // ตรวจสอบเวลาเริ่ม-สิ้นสุด
    const now = new Date();
    if (exam.startDate && exam.startDate > now) {
      return NextResponse.json({ error: 'Exam has not started yet' }, { status: 403 });
    }
    if (exam.endDate && exam.endDate < now) {
      return NextResponse.json({ error: 'Exam has ended' }, { status: 403 });
    }
    
    return NextResponse.json({ success: true, exam });
  } catch (error) {
    console.error('GET exam (user) error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch exam' }, { status: 500 });
  }
}