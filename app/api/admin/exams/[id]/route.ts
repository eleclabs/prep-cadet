// app/api/admin/exams/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import dbConnect from '@/lib/db';
import { Exam } from '@/models/Exam';
import { Question } from '@/models/Question';
import { Types } from 'mongoose';

// Helper: ตรวจสอบสิทธิ์ Admin
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return { authorized: false, session: null };
  }
  return { authorized: true, session };
}

// Helper: ตรวจสอบว่า string เป็น MongoDB ObjectId ที่ถูกต้อง
function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
}

// Helper: สร้าง response มาตรฐาน
function apiResponse(success: boolean, data?: any, error?: string, status = 200) {
  return NextResponse.json(
    { 
      success, 
      ...(data && { data }), 
      ...(error && { error }) 
    }, 
    { status }
  );
}

// GET: ดึงข้อมูลข้อสอบและคำถามทั้งหมด
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. ตรวจสอบสิทธิ์
    const { authorized } = await checkAdminAuth();
    if (!authorized) {
      return apiResponse(false, null, 'Unauthorized', 401);
    }

    // 2. Resolve params (รองรับ Next.js 15+)
    const { id } = await params;

    // 3. Validate ID
    if (!id || !isValidObjectId(id)) {
      return apiResponse(false, null, 'Invalid exam ID', 400);
    }

    // 4. เชื่อมต่อ DB
    await dbConnect();

    // 5. ดึงข้อมูล (ใช้ lean() เพื่อประสิทธิภาพ)
    const exam = await Exam.findById(id).lean();
    if (!exam) {
      return apiResponse(false, null, 'Exam not found', 404);
    }

    const questions = await Question.find({ examId: id })
      .sort({ createdAt: 1 })
      .lean();

    return apiResponse(true, { exam, questions });

  } catch (error) {
    console.error('[GET /api/admin/exams/[id]] Error:', error);
    return apiResponse(false, null, 'Internal server error', 500);
  }
}

// PUT: อัปเดตข้อมูลข้อสอบ
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. ตรวจสอบสิทธิ์
    const { authorized } = await checkAdminAuth();
    if (!authorized) {
      return apiResponse(false, null, 'Unauthorized', 401);
    }

    // 2. Resolve params
    const { id } = await params;

    // 3. Validate ID
    if (!id || !isValidObjectId(id)) {
      return apiResponse(false, null, 'Invalid exam ID', 400);
    }

    // 4. Parse และ Validate body
    let body;
    try {
      body = await req.json();
    } catch {
      return apiResponse(false, null, 'Invalid request body', 400);
    }

    // 5. Whitelist fields ที่อนุญาตให้อัปเดต (ป้องกัน Mass Assignment)
    const allowedFields = [
      'title', 'description', 'subject', 'duration', 
      'totalScore', 'passingScore', 'isActive', 
      'startDate', 'endDate'
    ];
    
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in body) {
        // Sanitize: แปลงวันที่ให้ถูกต้อง
        if ((field === 'startDate' || field === 'endDate') && body[field]) {
          const date = new Date(body[field]);
          if (!isNaN(date.getTime())) {
            updateData[field] = date;
          }
        } else if (field === 'passingScore' || field === 'duration' || field === 'totalScore') {
          // Validate numbers
          const num = Number(body[field]);
          if (!isNaN(num) && num >= 0) {
            updateData[field] = num;
          }
        } else if (field === 'isActive') {
          updateData[field] = Boolean(body[field]);
        } else {
          updateData[field] = String(body[field]).trim();
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return apiResponse(false, null, 'No valid fields to update', 400);
    }

    // 6. เชื่อมต่อและอัปเดต
    await dbConnect();
    
    const exam = await Exam.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).lean();

    if (!exam) {
      return apiResponse(false, null, 'Exam not found', 404);
    }

    return apiResponse(true, { exam });

  } catch (error) {
    console.error('[PUT /api/admin/exams/[id]] Error:', error);
    
    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return apiResponse(false, null, 'Validation failed: ' + error.message, 400);
    }
    
    return apiResponse(false, null, 'Internal server error', 500);
  }
}

// DELETE: ลบข้อสอบและคำถามทั้งหมดที่เกี่ยวข้อง
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. ตรวจสอบสิทธิ์
    const { authorized } = await checkAdminAuth();
    if (!authorized) {
      return apiResponse(false, null, 'Unauthorized', 401);
    }

    // 2. Resolve params
    const { id } = await params;

    // 3. Validate ID
    if (!id || !isValidObjectId(id)) {
      return apiResponse(false, null, 'Invalid exam ID', 400);
    }

    // 4. เชื่อมต่อ DB
    await dbConnect();

    // 5. ตรวจสอบว่ามีข้อสอบจริงก่อนลบ
    const exam = await Exam.findById(id);
    if (!exam) {
      return apiResponse(false, null, 'Exam not found', 404);
    }

    // 6. ลบแบบ Transaction (ป้องกันข้อมูลค้าง)
    // ลบคำถามทั้งหมดที่เกี่ยวข้อง
    const { deletedCount: questionsDeleted } = await Question.deleteMany({ examId: id });
    
    // ลบข้อสอบ
    await Exam.findByIdAndDelete(id);

    console.log(`[DELETE] Exam ${id} deleted with ${questionsDeleted} questions`);

    return apiResponse(true, { 
      message: 'Exam and related questions deleted successfully',
      deletedQuestions: questionsDeleted 
    });

  } catch (error) {
    console.error('[DELETE /api/admin/exams/[id]] Error:', error);
    return apiResponse(false, null, 'Internal server error', 500);
  }
}