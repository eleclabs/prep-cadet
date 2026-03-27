// models/Question.ts
import mongoose, { Schema, model, models } from 'mongoose';

const QuestionSchema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false }
    }
  ],
  score: { type: Number, default: 1 },
  explanation: { type: String }, // คำอธิบายคำตอบ
}, { timestamps: true });

export const Question = models.Question || model('Question', QuestionSchema);