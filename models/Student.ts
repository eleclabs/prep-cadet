import mongoose, { Schema, model, models } from 'mongoose';

const StudentSchema = new Schema({
  fullName: { type: String, required: true },
  parentName: { type: String, required: true },
  phone: { type: String, required: true },
  selectedCourse: { type: Schema.Types.ObjectId, ref: 'Course' },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Completed'], 
    default: 'Pending' 
  },
  grade: { type: String },      // เพิ่ม
  school: { type: String },     // เพิ่ม
}, { timestamps: true });

export const Student = models.Student || model('Student', StudentSchema);