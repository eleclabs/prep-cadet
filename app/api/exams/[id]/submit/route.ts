// app/api/exams/[id]/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Exam } from '@/models/Exam';
import { Question } from '@/models/Question';
import { ExamResult } from '@/models/ExamResult';

// POST: ส่งคำตอบและคำนวณคะแนน
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id: examId } = await params;
    const { answers }: { answers: Record<string, number> } = await req.json();
    
    // ดึงข้อสอบพร้อมคำถามทั้งหมด (รวมคำตอบที่ถูก)
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam || !exam.isActive) {
      return NextResponse.json({ error: 'Exam not found or not available' }, { status: 404 });
    }
    
    // คำนวณคะแนน
    let score = 0;
    let totalScore = 0;
    const gradedAnswers = [];
    
    for (const question of exam.questions) {
      const userAnswer = answers[question._id.toString()];
      const points = question.points || 1;
      totalScore += points;
      
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) {
        score += points;
      }
      
      gradedAnswers.push({
        questionId: question._id,
        questionText: question.text,
        selectedAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      });
    }
    
    const percentage = Math.round((score / totalScore) * 100);
    const passed = percentage >= exam.passingScore;
    
    // บันทึกผลลัพธ์
    const result = await ExamResult.create({
      userId: (session.user as any).id,
      examId: exam._id,
      examTitle: exam.title,
      score,
      totalScore,
      percentage,
      passed,
      answers: gradedAnswers,
      submittedAt: new Date(),
      gradedAt: new Date(),
    });
    
    return NextResponse.json({ 
      success: true, 
      result: {
        _id: result._id,
        score,
        totalScore,
        percentage,
        passed,
        passedThreshold: exam.passingScore,
        answers: gradedAnswers,
        submittedAt: result.submittedAt,
      }
    });
  } catch (error: any) {
    console.error('POST submit exam error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to submit exam' 
    }, { status: 500 });
  }
}