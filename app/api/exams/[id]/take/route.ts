// app/api/exams/[id]/take/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Exam } from '@/models/Exam';
import { Question } from '@/models/Question';
import { ExamResult } from '@/models/ExamResult';
import { Student } from '@/models/Student';
import { Types } from 'mongoose';

// ========== Interfaces ==========
interface AnswerPayload {
  questionId: string;
  selectedOption: number;
}

interface ExamSubmission {
  studentName: string;
  studentPhone: string;
  answers: AnswerPayload[];
  timeSpent?: number;
}

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface QuestionDocument {
  _id: Types.ObjectId;
  questionText: string;
  options: QuestionOption[];
  score: number;
  explanation?: string;
  examId: Types.ObjectId;
}

// ========== Helper Functions ==========
function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
}

function validateSubmission(body: any): { valid: boolean; error?: string } {
  if (!body?.studentName || typeof body.studentName !== 'string' || body.studentName.trim().length < 2) {
    return { valid: false, error: 'กรุณากรอกชื่อ-นามสกุล' };
  }
  
  if (!body?.studentPhone || !/^0[0-9]{9}$/.test(body.studentPhone)) {
    return { valid: false, error: 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็น 10 หลัก ขึ้นต้นด้วย 0)' };
  }
  
  if (!Array.isArray(body.answers) || body.answers.length === 0) {
    return { valid: false, error: 'ต้องตอบคำถามอย่างน้อย 1 ข้อ' };
  }
  
  for (const answer of body.answers) {
    if (!isValidObjectId(answer.questionId)) {
      return { valid: false, error: 'รูปแบบคำถามไม่ถูกต้อง' };
    }
    if (typeof answer.selectedOption !== 'number' || answer.selectedOption < 0) {
      return { valid: false, error: 'รูปแบบคำตอบไม่ถูกต้อง' };
    }
  }
  
  return { valid: true };
}

// ========== GET: โหลดข้อสอบ ==========
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Resolve params (Next.js 15+)
    const { id } = await params;
    
    // Validate ID
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'รหัสข้อสอบไม่ถูกต้อง' }, { status: 400 });
    }

    // ดึงข้อสอบ
    const exam = await Exam.findById(id);
    if (!exam) {
      return NextResponse.json({ success: false, error: 'ไม่พบข้อสอบนี้' }, { status: 404 });
    }

    // ตรวจสอบสถานะ
    if (!exam.isActive) {
      return NextResponse.json({ success: false, error: 'ข้อสอบนี้ปิดอยู่' }, { status: 400 });
    }

    // ตรวจสอบเวลา
    const now = new Date();
    if (exam.startDate && new Date(exam.startDate) > now) {
      return NextResponse.json({ success: false, error: 'ข้อสอบยังไม่เริ่ม' }, { status: 400 });
    }
    if (exam.endDate && new Date(exam.endDate) < now) {
      return NextResponse.json({ success: false, error: 'ข้อสอบสิ้นสุดแล้ว' }, { status: 400 });
    }

    // ดึงคำถาม (ไม่รวมเฉลยเพื่อป้องกันโกง)
    const questions = await Question.find({ examId: id })
      .select('-options.isCorrect -explanation')
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: {
        exam: {
          _id: exam._id,
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          totalScore: exam.totalScore,
          passingScore: exam.passingScore,
        },
        questions 
      }
    });

  } catch (error) {
    console.error('[GET /api/exams/[id]/take] Error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการโหลดข้อสอบ' }, { status: 500 });
  }
}

// ========== POST: ส่งคำตอบ ==========
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Resolve params
    const { id } = await params;
    
    // Validate ID
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'รหัสข้อสอบไม่ถูกต้อง' }, { status: 400 });
    }

    // Parse และ Validate body
    let body: ExamSubmission;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'รูปแบบข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    const validation = validateSubmission(body);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    // ดึงข้อสอบพร้อมตรวจสอบ
    const exam = await Exam.findById(id);
    if (!exam) {
      return NextResponse.json({ success: false, error: 'ไม่พบข้อสอบนี้' }, { status: 404 });
    }

    // ตรวจสอบสถานะ (เหมือน GET)
    if (!exam.isActive) {
      return NextResponse.json({ success: false, error: 'ข้อสอบนี้ปิดอยู่' }, { status: 400 });
    }

    const now = new Date();
    if (exam.startDate && new Date(exam.startDate) > now) {
      return NextResponse.json({ success: false, error: 'ข้อสอบยังไม่เริ่ม' }, { status: 400 });
    }
    if (exam.endDate && new Date(exam.endDate) < now) {
      return NextResponse.json({ success: false, error: 'ข้อสอบสิ้นสุดแล้ว' }, { status: 400 });
    }

    // 🔒 ป้องกันส่งข้อสอบซ้ำ (เช็คด้วยเบอร์โทร)
    const existingResult = await ExamResult.findOne({
      examId: id,
      studentPhone: body.studentPhone
    });
    
    if (existingResult) {
      return NextResponse.json({ 
        success: false, 
        error: 'คุณเคยทำข้อสอบนี้ไปแล้ว',
        data: {
          totalScore: existingResult.totalScore,
          percentage: existingResult.percentage,
          isPassed: existingResult.isPassed
        }
      }, { status: 409 }); // 409 = Conflict
    }

    // ดึงคำถามพร้อมเฉลยสำหรับตรวจ
    const questions = await Question.find({ examId: id }).lean() as unknown as QuestionDocument[];

    // คำนวณคะแนน
    let totalScore = 0;
    const gradedAnswers = body.answers.map((answer) => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      
      // ถ้าไม่พบคำถาม หรือเลือกตัวเลือกนอกช่วง
      if (!question || answer.selectedOption >= question.options.length) {
        return {
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: false,
          score: 0
        };
      }
      
      const selectedOption = question.options[answer.selectedOption];
      const isCorrect = selectedOption?.isCorrect || false;
      const score = isCorrect ? (question.score || 1) : 0;
      
      if (isCorrect) {
        totalScore += score;
      }

      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
        score
      };
    });

    // คำนวณเปอร์เซ็นต์
    const percentage = exam.totalScore > 0 
      ? Math.round((totalScore / exam.totalScore) * 100 * 10) / 10  // ปัดทศนิยม 1 ตำแหน่ง
      : 0;
    
    const isPassed = percentage >= exam.passingScore;

    // ค้นหาหรือสร้างนักเรียน
    let student = await Student.findOne({ phone: body.studentPhone });
    if (!student) {
      student = await Student.create({
        fullName: body.studentName.trim(),
        parentName: '-',
        phone: body.studentPhone,
        status: 'Pending'
      });
    }

    // บันทึกผลการสอบ
    const result = await ExamResult.create({
      studentId: student._id,
      studentName: body.studentName.trim(),
      studentPhone: body.studentPhone,
      examId: exam._id,
      examTitle: exam.title,
      answers: gradedAnswers,
      totalScore,
      percentage,
      isPassed,
      timeSpent: body.timeSpent || null,
      submittedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'ส่งข้อสอบเรียบร้อยแล้ว',
      data: {
        totalScore,
        percentage,
        isPassed,
        passingScore: exam.passingScore,
        resultId: result._id
      }
    });

  } catch (error) {
    console.error('[POST /api/exams/[id]/take] Error:', error);
    
    // Handle Mongoose errors
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json({ success: false, error: 'ข้อมูลไม่ถูกต้อง: ' + error.message }, { status: 400 });
      }
    }
    
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการส่งข้อสอบ' }, { status: 500 });
  }
}