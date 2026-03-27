// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student } from '@/models/Student';
import { Course } from '@/models/Course';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { fullName, parentName, phone, courseId, grade, school } = body;

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!fullName || !parentName || !phone || !courseId) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // 2. ตรวจสอบว่าคอร์สมีอยู่จริงและยังเปิดรับสมัคร
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return NextResponse.json({ success: false, message: 'คอร์สนี้ไม่เปิดรับสมัครหรือไม่มีอยู่จริง' }, { status: 400 });
    }

    // 3. บันทึกข้อมูลนักเรียน
    const student = await Student.create({
      fullName,
      parentName,
      phone,
      selectedCourse: courseId,
      grade,
      school,
      status: 'Pending', // สถานะเริ่มต้นคือรอตรวจสอบ
    });

    // 4. (Optional) ส่งแจ้งเตือนทาง Line หรือ Email ตรงนี้ได้

    return NextResponse.json({ success: true, message: 'สมัครเรียนเรียบร้อยแล้ว', studentId: student._id });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 });
  }
}