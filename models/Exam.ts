// models/Exam.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ExamSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { 
    type: String, 
    enum: ['math', 'science', 'english', 'thai', 'social', 'physical'],
    required: true 
  },
  duration: { type: Number, required: true }, // นาที
  totalScore: { type: Number, default: 0 },
  passingScore: { type: Number, default: 50 }, // เปอร์เซ็นต์ที่ผ่าน
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true });

export const Exam = models.Exam || model('Exam', ExamSchema);