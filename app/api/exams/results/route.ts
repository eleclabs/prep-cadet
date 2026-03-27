// app/api/exams/results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ExamResult } from '@/models/ExamResult';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    const results = await ExamResult.find({ studentPhone: phone })
      .sort({ submittedAt: -1 })
      .populate('examId');

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch results' }, { status: 500 });
  }
}