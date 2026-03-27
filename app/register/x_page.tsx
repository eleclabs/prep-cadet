'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // ต้อง import ตัวนี้
import Link from 'next/link';


interface Course {
  _id: string;
  title: string;
  branch: string;
  price: number;
}

export default function RegisterPage() {

  const router = useRouter();
  const searchParams = useSearchParams(); // 2. เรียกใช้ hook ให้ถูกต้อง
  const preSelectedCourseId = searchParams.get('courseId');

  // 3. ตอนนี้ TypeScript จะรู้จัก Course แล้ว
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    parentName: '',
    phone: '',
    courseId: preSelectedCourseId || '',
    grade: '',
    school: '',
  });


  // โหลดรายการคอร์สที่เปิดรับสมัคร
  useEffect(() => {
    fetch('/api/courses') // ใช้ API สาธารณะที่สร้างไว้ก่อนหน้า
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourses(data.courses);
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/register/success');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-slate-900 py-6 px-8">
          <h2 className="text-3xl font-bold text-white text-center">แบบฟอร์มสมัครเรียน</h2>
          <p className="text-gray-300 text-center mt-2">โรงเรียนกวดวิชาเตรียมทหาร</p>
        </div>

        <form onSubmit={handleSubmit} className="py-8 px-8 space-y-6">
          {/* เลือกคอร์ส */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หลักสูตรที่สมัคร *</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- กรุณาเลือกหลักสูตร --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} ({course.branch}) - {course.price.toLocaleString()} บาท
                </option>
              ))} 
            </select>
          </div>

          {/* ชื่อนักเรียน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อนักเรียน (ชื่อ-นามสกุล) *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="เช่น ด.ช.รักชาติ รักไทย"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ชื่อผู้ปกครอง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ปกครอง *</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
              placeholder="เช่น นายรักลูก รักเรียน"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="เช่น 081-234-5678"
              pattern="[0-9]{10}"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">ระบุตัวเลข 10 หลัก ไม่รวมขีด</p>
          </div>

          {/* เกรดและโรงเรียน (Optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ระดับชั้น</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="เช่น ม.3"
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">โรงเรียนปัจจุบัน</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="เช่น โรงเรียน..."
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </div>
          </div>

          {/* ปุ่ม Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded-md hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? 'กำลังส่งข้อมูล...' : 'ยืนยันการสมัครเรียน'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}