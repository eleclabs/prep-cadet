// models/Activity.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ActivitySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true }, // URL รูปภาพ
  category: { 
    type: String, 
    enum: ['training', 'ceremony', 'sports', 'academic', 'other'],
    default: 'other'
  },
  eventDate: { type: Date },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }, // สำหรับเรียงลำดับ
}, { timestamps: true });

export const Activity = models.Activity || model('Activity', ActivitySchema);