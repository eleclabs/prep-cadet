// lib/api-utils.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

// ตรวจสอบสิทธิ์ Admin
export async function requireAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return false;
  }
  return true;
}

// ตรวจสอบ MongoDB ObjectId
export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
}

// สร้าง response มาตรฐาน
export function apiResponse(success: boolean, data?: any, error?: string, status = 200) {
  return NextResponse.json(
    { 
      success, 
      ...(data && { data }), 
      ...(error && { error }) 
    }, 
    { status }
  );
}

// Sanitize และ Validate input
export function sanitizeInput(body: any, allowedFields: string[]) {
  const result: Record<string, any> = {};
  
  for (const field of allowedFields) {
    if (!(field in body)) continue;
    
    const value = body[field];
    
    if (value === null || value === undefined) {
      result[field] = value;
    } else if (typeof value === 'string') {
      result[field] = value.trim();
    } else if (typeof value === 'number') {
      result[field] = isNaN(value) ? null : value;
    } else if (typeof value === 'boolean') {
      result[field] = value;
    } else {
      result[field] = value;
    }
  }
  
  return result;
}

