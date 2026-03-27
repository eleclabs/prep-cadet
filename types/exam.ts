// types/exam.ts
export interface Question {
  _id?: string;
  text: string;
  options: string[];        // 4 ตัวเลือก
  correctAnswer: number;    // Index ของคำตอบที่ถูก (0-3)
  explanation?: string;     // คำอธิบายเฉลย
  points?: number;          // คะแนนข้อนี้ (default: 1)
}

export interface Exam {
  _id?: string;
  title: string;
  description: string;
  subject: string;          // เช่น 'คณิตศาสตร์', 'ภาษาอังกฤษ'
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;         // เวลาคิดเป็นนาที
  passingScore: number;     // คะแนนขั้นต่ำที่ผ่าน (%)
  questions: Question[];    // หรือเป็น reference ID ถ้าแยก collection
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExamSubmission {
  examId: string;
  answers: Record<string, number>;  // { questionId: selectedOptionIndex }
  submittedAt: Date;
}

export interface ExamResult {
  _id?: string;
  userId: string;
  examId: string;
  examTitle: string;
  score: number;              // คะแนนที่ได้
  totalScore: number;         // คะแนนเต็ม
  percentage: number;         // คะแนนเป็นเปอร์เซ็นต์
  passed: boolean;            // ผ่านหรือไม่
  answers: Array<{
    questionId: string;
    questionText: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation?: string;
  }>;
  submittedAt: Date;
  gradedAt: Date;
}