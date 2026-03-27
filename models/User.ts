// models/User.ts
import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // จะเก็บแบบ Hash
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  name: { type: String },
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);