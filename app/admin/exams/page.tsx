'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ========== Interfaces ==========
interface Exam {
  _id: string;
  title: string;
  subject: string;
  duration: number;
  totalScore: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminExamsPage() {
  // ✅ แก้ไข: ใช้การเข้าถึงแบบชัดเจนแทน destructuring ที่ซับซ้อน
  const sessionData = useSession();
  const session = sessionData.data;
  const status = sessionData.status;
  
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ แก้ไข: ตรวจสอบสถานะและใช้งาน session อย่างปลอดภัย
  useEffect(() => {
    // รอให้ session โหลดเสร็จก่อน
    if (status === 'loading') return;
    
    // ตรวจสอบสิทธิ์ด้วย session ที่เข้าถึงอย่างชัดเจน
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    }
    
    fetchExams();
  }, [session, status, router]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/admin/exams');
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch exams');
      }
      
      // ✅ รองรับโครงสร้าง response ที่อาจแตกต่างกัน
      const examsData = result.data?.exams || result.exams || [];
      setExams(examsData);
      
    } catch (err) {
      console.error('Failed to fetch exams:', err);
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบข้อสอบนี้หรือไม่? คำถามทั้งหมดจะถูกลบด้วย')) return;

    try {
      const res = await fetch(`/api/admin/exams/${id}`, { method: 'DELETE' });
      const result = await res.json();
      
      if (res.ok && result.success) {
        fetchExams();
        alert('ลบข้อสอบเรียบร้อยแล้ว');
      } else {
        throw new Error(result.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('เกิดข้อผิดพลาดในการลบ: ' + (err instanceof Error ? err.message : 'ไม่ทราบสาเหตุ'));
    }
  };

  const subjectLabels: Record<string, string> = {
    math: 'คณิตศาสตร์',
    science: 'วิทยาศาสตร์',
    english: 'ภาษาอังกฤษ',
    thai: 'ภาษาไทย',
    social: 'สังคมศึกษา',
    physical: 'พลศึกษา',
  };

  const subjectColors: Record<string, string> = {
    math: 'bg-blue-100 text-blue-800',
    science: 'bg-green-100 text-green-800',
    english: 'bg-purple-100 text-purple-800',
    thai: 'bg-yellow-100 text-yellow-800',
    social: 'bg-orange-100 text-orange-800',
    physical: 'bg-red-100 text-red-800',
  };

  // Loading State
  if (loading && exams.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchExams}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">จัดการข้อสอบ</h1>
          <p className="text-gray-600 mt-1">มีข้อสอบทั้งหมด {exams.length} ชุด</p>
        </div>
        <Link
          href="/admin/exams/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2"
        >
          <span>+</span> สร้างข้อสอบใหม่
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">ข้อสอบทั้งหมด</p>
          <p className="text-2xl font-bold text-slate-800">{exams.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">เปิดใช้งาน</p>
          <p className="text-2xl font-bold text-green-600">{exams.filter(e => e.isActive).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">ปิดใช้งาน</p>
          <p className="text-2xl font-bold text-red-600">{exams.filter(e => !e.isActive).length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อข้อสอบ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วิชา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{exam.title}</p>
                    <p className="text-xs text-gray-500">{new Date(exam.createdAt).toLocaleDateString('th-TH')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${subjectColors[exam.subject]}`}>
                      {subjectLabels[exam.subject]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      ⏱️ {exam.duration} นาที
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      📝 {exam.totalScore} คะแนน
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      exam.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {exam.isActive ? '✅ เปิด' : '❌ ปิด'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/exams/${exam._id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                      >
                        📝 จัดการคำถาม
                      </Link>
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="text-red-600 hover:text-red-900 font-medium text-sm"
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {exams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500 mb-4">ยังไม่มีข้อสอบในระบบ</p>
            <Link
              href="/admin/exams/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              สร้างข้อสอบแรก
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}