// app/api/admin/exams/[id]/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Exam } from '@/models/Exam';
import { Question } from '@/models/Question';

// POST: เพิ่มคำถามใหม่ในข้อสอบ
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id: examId } = await params;
    const body = await req.json();
    
    // ตรวจสอบว่าข้อสอบมีอยู่
    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }
    
    // สร้างคำถาม
    const question = await Question.create({
      ...body,
      examId,
    });
    
    // เพิ่ม reference ไปยังข้อสอบ
    exam.questions.push(question._id);
    await exam.save();
    
    return NextResponse.json({ success: true, question }, { status: 201 });
  } catch (error: any) {
    console.error('POST question error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to add question' 
    }, { status: 500 });
  }
}

// PUT: แก้ไขคำถาม
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
    const { id: questionId } = await params;
    const body = await req.json();
    
    const question = await Question.findByIdAndUpdate(
      questionId, 
      body, 
      { new: true, runValidators: true }
    );
    
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    console.error('PUT question error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to update question' 
    }, { status: 500 });
  }
}

// DELETE: ลบคำถาม
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
    const { id: questionId } = await params;
    
    const question = await Question.findByIdAndDelete(questionId);
    
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    // ลบ reference จากข้อสอบ
    await Exam.updateOne(
      { _id: question.examId },
      { $pull: { questions: questionId } }
    );
    
    return NextResponse.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    console.error('DELETE question error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete question' }, { status: 500 });
  }
}