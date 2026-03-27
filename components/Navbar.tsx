'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-yellow-500">
          PREP CADET
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-yellow-400">หน้าแรก</Link>
          <Link href="/courses" className="hover:text-yellow-400">หลักสูตร</Link> {/* เพิ่ม */}
          <Link href="/about" className="hover:text-yellow-400">เกี่ยวกับเรา</Link> {/* เพิ่ม */}
          <Link href="/contact" className="hover:text-yellow-400">ติดต่อเรา</Link> {/* เพิ่ม */}

          {session ? (
            <div className="flex items-center space-x-4">
              {(session.user as any).role === 'admin' && (
                <Link href="/admin" className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-400">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-red-400 hover:text-red-300"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 p-4 space-y-4">
          <Link href="/" className="block hover:text-yellow-400">หน้าแรก</Link>
          <Link href="/courses" className="block hover:text-yellow-400">หลักสูตร</Link>
          {session ? (
            <>
              {(session.user as any).role === 'admin' && (
                <Link href="/admin" className="block text-yellow-500 font-bold">Admin Panel</Link>
              )}
              <button onClick={() => signOut()} className="block text-red-400 w-full text-left">ออกจากระบบ</button>
            </>
          ) : (
            <Link href="/login" className="block bg-blue-600 text-center py-2 rounded">เข้าสู่ระบบ</Link>
          )}
        </div>
      )}
    </nav>
  );
}