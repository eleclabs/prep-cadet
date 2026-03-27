// app/api/admin/activities/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Activity } from '@/models/Activity';

// GET: ดึงกิจกรรมตาม ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const activity = await Activity.findById(params.id);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, activity });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch activity' }, { status: 500 });
  }
}

// PUT: แก้ไขกิจกรรม
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const activity = await Activity.findByIdAndUpdate(params.id, body, { new: true });
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, activity });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update activity' }, { status: 500 });
  }
}

// DELETE: ลบกิจกรรม
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const activity = await Activity.findByIdAndDelete(params.id);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete activity' }, { status: 500 });
  }
}