// app/api/seed-activity/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Activity } from '@/models/Activity';

export async function GET() {
  await dbConnect();
  
  const sampleActivities = [
    {
      title: 'ค่ายเตรียมความพร้อม',
      description: 'กิจกรรมค่ายฝึกความพร้อมก่อนสอบเข้าเตรียมทหาร',
      image: 'https://via.placeholder.com/800x600?text=Training+Camp',
      category: 'training',
      eventDate: new Date(),
      isActive: true,
      order: 1,
    },
    {
      title: 'พิธีมอบประกาศนียบัตร',
      description: 'พิธีมอบประกาศนียบัตรสำหรับนักเรียนที่สำเร็จหลักสูตร',
      image: 'https://via.placeholder.com/800x600?text=Certificate+Ceremony',
      category: 'ceremony',
      eventDate: new Date(),
      isActive: true,
      order: 2,
    },
  ];

  await Activity.insertMany(sampleActivities);

  return NextResponse.json({ message: 'Sample activities created!' });
}