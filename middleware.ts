// middleware.ts - แบบง่ายสุด
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // อนุญาตทุกขอกร้องขอ (ทดสอบก่อน)
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};