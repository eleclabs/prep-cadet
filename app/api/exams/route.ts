// app/api/exams/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Exam } from '@/models/Exam';

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();
    const exams = await Exam.find({ 
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: { $gte: now } }, { endDate: null }]
    }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, exams });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch exams' }, { status: 500 });
  }
}