// app/api/activities/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Activity } from '@/models/Activity';

// GET: ดึงกิจกรรมทั้งหมด (สาธารณะ)
export async function GET() {
  try {
    await dbConnect();
    const activities = await Activity.find({ isActive: true })
      .sort({ order: 1, eventDate: -1 });
    return NextResponse.json({ success: true, activities });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch activities' }, { status: 500 });
  }
}