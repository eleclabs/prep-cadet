// app/api/admin/exam-results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { ExamResult } from '@/models/ExamResult';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('examId');

    const query = examId ? { examId } : {};
    const results = await ExamResult.find(query)
      .sort({ submittedAt: -1 })
      .populate('examId');

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch results' }, { status: 500 });
  }
}