// app/register/page.tsx
import { Suspense } from 'react';
import RegisterForm from './RegisterForm';

// ✅ Loading Component แสดงขณะรอโหลด
function RegisterLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-slate-600 font-medium">กำลังโหลดแบบฟอร์ม...</p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    // ✅ หุ้มด้วย Suspense เพื่อรองรับ useSearchParams()
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}