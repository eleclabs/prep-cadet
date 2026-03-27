'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';  // ✅ useSession ส่งออก { data, status, update }
import { useRouter } from 'next/navigation';

// ========== Interfaces ==========
interface ExamResult {
  _id: string;
  studentName: string;
  studentPhone: string;
  examTitle: string;
  examId: string;
  totalScore: number;
  percentage: number;
  isPassed: boolean;
  submittedAt: string | Date;
  timeSpent: number | null;
}

interface ExamOption {
  _id: string;
  title: string;
}

export default function AdminExamResultsPage() {
  // ✅ แก้ไข: ใช้ data: session แทนที่จะเป็น session โดยตรง
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [results, setResults] = useState<ExamResult[]>([]);
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterExam, setFilterExam] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchPhone, setSearchPhone] = useState<string>('');

  // ตรวจสอบสิทธิ์และโหลดข้อมูล
  useEffect(() => {
    // รอให้ session โหลดเสร็จก่อน
    if (status === 'loading') return;
    
    // ✅ แก้ไข: ตรวจสอบผ่าน session (ซึ่งมาจาก data)
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    }
    
    Promise.all([fetchResults(), fetchExams()]);
  }, [session, status, router]);  // ✅ session มาจาก data: session

  // ดึงผลการสอบ
  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/admin/exam-results');
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch results');
      }
      
      // รองรับทั้ง data.results และ data.data.results
      const resultsData = result.data?.results || result.results || [];
      setResults(resultsData);
      
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // ดึงรายการข้อสอบสำหรับ Filter
  const fetchExams = async () => {
    try {
      const res = await fetch('/api/admin/exams');
      const result = await res.json();
      
      if (result.success) {
        const examsData = result.data?.exams || result.exams || [];
        setExams(examsData.map((exam: any) => ({
          _id: exam._id,
          title: exam.title
        })));
      }
    } catch (err) {
      console.error('Failed to fetch exams:', err);
    }
  };

  // Filter ผลการสอบ
  const filteredResults = results.filter(result => {
    if (filterStatus !== 'all') {
      const isPassed = filterStatus === 'passed';
      if (result.isPassed !== isPassed) return false;
    }
    
    if (filterExam !== 'all' && result.examId !== filterExam) {
      return false;
    }
    
    if (searchPhone && !result.studentPhone.includes(searchPhone)) {
      return false;
    }
    
    return true;
  });

  // Format เวลา
  const formatTime = (seconds: number | null): string => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}นาที ${secs}วินาที`;
  };

  // Format วันที่
  const formatDate = (date: string | Date): string => {
    try {
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  // Export เป็น CSV
  const handleExportCSV = () => {
    if (filteredResults.length === 0) {
      alert('ไม่มีข้อมูลที่จะส่งออก');
      return;
    }

    const headers = ['ชื่อนักเรียน', 'เบอร์โทรศัพท์', 'ข้อสอบ', 'คะแนน(%)', 'คะแนน(ดิบ)', 'สถานะ', 'เวลาที่ใช้', 'วันที่สอบ'];
    const rows = filteredResults.map(r => [
      r.studentName,
      r.studentPhone,
      r.examTitle,
      `${r.percentage.toFixed(1)}%`,
      r.totalScore,
      r.isPassed ? 'ผ่าน' : 'ไม่ผ่าน',
      formatTime(r.timeSpent),
      formatDate(r.submittedAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `exam-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Loading State
  if (loading && results.length === 0) {
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
          onClick={() => fetchResults()}
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">ผลการสอบทั้งหมด</h1>
        
        <button
          onClick={handleExportCSV}
          disabled={filteredResults.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          📊 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* ค้นหาเบอร์โทร */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาเบอร์โทรศัพท์</label>
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="เช่น 081..."
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter ข้อสอบ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ข้อสอบ</label>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              {exams.map(exam => (
                <option key={exam._id} value={exam._id}>{exam.title}</option>
              ))}
            </select>
          </div>

          {/* Filter สถานะ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              <option value="passed">ผ่าน</option>
              <option value="failed">ไม่ผ่าน</option>
            </select>
          </div>

          {/* ปุ่มล้างฟิลเตอร์ */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterExam('all');
                setFilterStatus('all');
                setSearchPhone('');
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              ล้างฟิลเตอร์
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        แสดง {filteredResults.length} จาก {results.length} ผลการสอบ
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นักเรียน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ข้อสอบ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สอบ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50 transition-colors">
                  {/* นักเรียน */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{result.studentName}</p>
                    <p className="text-sm text-gray-500">{result.studentPhone}</p>
                  </td>
                  
                  {/* ข้อสอบ */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 max-w-xs truncate">
                    {result.examTitle}
                  </td>
                  
                  {/* คะแนน */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        result.percentage >= 80 ? 'text-green-600' :
                        result.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.percentage.toFixed(1)}%
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500 text-sm">{result.totalScore} คะแนน</span>
                    </div>
                  </td>
                  
                  {/* เวลา */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {formatTime(result.timeSpent)}
                  </td>
                  
                  {/* สถานะ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      result.isPassed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.isPassed ? '✅ ผ่าน' : '❌ ไม่ผ่าน'}
                    </span>
                  </td>
                  
                  {/* วันที่ */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {formatDate(result.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500">
              {results.length === 0 
                ? 'ยังไม่มีผลการสอบในระบบ' 
                : 'ไม่พบผลการสอบที่ตรงกับเงื่อนไขการค้นหา'}
            </p>
            {results.length > 0 && (
              <button
                onClick={() => {
                  setFilterExam('all');
                  setFilterStatus('all');
                  setSearchPhone('');
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                ล้างเงื่อนไขการค้นหา
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}