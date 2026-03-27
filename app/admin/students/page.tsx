'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Student {
  _id: string;
  fullName: string;
  parentName: string;
  phone: string;
  selectedCourse: {
    _id: string;
    title: string;
    branch: string;
  } | null;
  status: 'Pending' | 'Paid' | 'Completed';
  createdAt: string;
}

export default function AdminStudentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
/*     if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    } */
    fetchStudents();
  }, [session, router]);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Student['status']) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStudents();
        alert('อัปเดตสถานะเรียบร้อยแล้ว');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบข้อมูลนักเรียนคนนี้หรือไม่?')) return;

    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchStudents();
        alert('ลบข้อมูลเรียบร้อยแล้ว');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const filteredStudents = filterStatus === 'all' 
    ? students 
    : students.filter(s => s.status === filterStatus);

  const statusLabels: Record<string, string> = {
    Pending: 'รอตรวจสอบ',
    Paid: 'ชำระเงินแล้ว',
    Completed: 'เรียนจบ',
  };

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Paid: 'bg-green-100 text-green-800',
    Completed: 'bg-blue-100 text-blue-800',
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลด...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">จัดการนักเรียน</h1>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="all">ทั้งหมด</option>
          <option value="Pending">รอตรวจสอบ</option>
          <option value="Paid">ชำระเงินแล้ว</option>
          <option value="Completed">เรียนจบ</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อนักเรียน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้ปกครอง</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เบอร์โทร</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">คอร์ส</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สมัครเมื่อ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {student.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {student.parentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {student.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {student.selectedCourse?.title || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={student.status}
                    onChange={(e) => updateStatus(student._id, e.target.value as Student['status'])}
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[student.status]}`}
                  >
                    <option value="Pending">รอตรวจสอบ</option>
                    <option value="Paid">ชำระเงินแล้ว</option>
                    <option value="Completed">เรียนจบ</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {new Date(student.createdAt).toLocaleDateString('th-TH')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">ไม่พบข้อมูลนักเรียน</div>
        )}
      </div>
    </div>
  );
}