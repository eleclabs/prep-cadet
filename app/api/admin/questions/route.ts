// app/api/admin/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Question } from '@/models/Question';
import { Exam } from '@/models/Exam';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // ตรวจสอบว่าข้อสอบมีอยู่จริง
    const exam = await Exam.findById(body.examId);
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const question = await Question.create(body);
    
    // อัปเดตคะแนนรวมของข้อสอบ
    const questions = await Question.find({ examId: body.examId });
    const totalScore = questions.reduce((sum, q) => sum + (q.score || 1), 0);
    await Exam.findByIdAndUpdate(body.examId, { totalScore });
    
    return NextResponse.json({ success: true, question }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create question' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const question = await Question.findByIdAndUpdate(body._id, body, { new: true });
    
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, question });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('id');
    const examId = searchParams.get('examId');
    
    if (!questionId || !examId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await Question.findByIdAndDelete(questionId);
    
    // อัปเดตคะแนนรวมของข้อสอบ
    const questions = await Question.find({ examId });
    const totalScore = questions.reduce((sum, q) => sum + (q.score || 1), 0);
    await Exam.findByIdAndUpdate(examId, { totalScore });
    
    return NextResponse.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete question' }, { status: 500 });
  }
}