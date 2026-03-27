// models/ExamResult.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IExamResult extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentPhone: string;
  examId: mongoose.Types.ObjectId;
  examTitle: string;
  answers: Array<{
    questionId: mongoose.Types.ObjectId;
    selectedOption: number;
    isCorrect: boolean;
    score: number;
  }>;
  totalScore: number;
  percentage: number;
  isPassed: boolean;
  submittedAt: Date;
  timeSpent: number | null;
}

const ExamResultSchema = new Schema<IExamResult>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true, trim: true },
  studentPhone: { type: String, required: true, trim: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  examTitle: { type: String, required: true },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: { type: Number, required: true },
    isCorrect: { type: Boolean, default: false },
    score: { type: Number, default: 0 }
  }],
  totalScore: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  isPassed: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
  timeSpent: { type: Number } // วินาที
}, { timestamps: true });

// สร้าง Index เพื่อค้นหาเร็วขึ้น
ExamResultSchema.index({ examId: 1, studentPhone: 1 }, { unique: true });
ExamResultSchema.index({ studentPhone: 1, submittedAt: -1 });

export const ExamResult = models.ExamResult || model<IExamResult>('ExamResult', ExamResultSchema);