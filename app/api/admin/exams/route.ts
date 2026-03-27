// app/api/admin/exams/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Exam } from '@/models/Exam';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const exams = await Exam.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, exams });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch exams' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const exam = await Exam.create(body);
    return NextResponse.json({ success: true, exam }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create exam' }, { status: 500 });
  }
}