import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">สมัครเรียนสำเร็จ!</h2>
        <p className="text-gray-600 mb-8">
          ขอบคุณที่สนใจเรียนกับเรา เจ้าหน้าที่ตรวจสอบข้อมูลและจะติดต่อกลับทางโทรศัพท์เร็วๆ นี้
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-slate-900 text-white font-bold py-3 rounded-md hover:bg-slate-800"
          >
            กลับสู่หน้าแรก
          </Link>
          <Link
            href="/courses"
            className="block w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-md hover:bg-gray-50"
          >
            ดูหลักสูตรอื่นๆ
          </Link>
        </div>
      </div>
    </div>
  );
}