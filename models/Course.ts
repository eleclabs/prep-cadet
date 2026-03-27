import mongoose, { Schema, model, models } from 'mongoose';

const CourseSchema = new Schema({
  title: { type: String, required: true }, // เช่น "คอร์สเตรียมทหารเหล่าทัพ"
  branch: { 
    type: String, 
    enum: ['Army', 'Navy', 'AirForce', 'Police'], // เหล่าทัพ
    required: true 
  },
  price: { type: Number, required: true },
  description: { type: String },
  schedule: { type: String }, // เช่น "เสาร์-อาทิตย์ 09:00 - 16:00"
  image: { type: String }, // URL รูปภาพ
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Course = models.Course || model('Course', CourseSchema);