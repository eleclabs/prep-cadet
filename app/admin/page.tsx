// app/admin/page.tsx
import dbConnect from "@/lib/db";
import { Course } from "@/models/Course";
import { Student } from "@/models/Student";

export default async function AdminDashboard() {
  await dbConnect();
  
  // ดึงข้อมูลสถิติ
  const courseCount = await Course.countDocuments();
  const studentCount = await Student.countDocuments();
  const pendingStudents = await Student.countDocuments({ status: 'Pending' });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-800">ภาพรวมระบบ</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
          <h3 className="text-gray-500">คอร์สเรียนทั้งหมด</h3>
          <p className="text-3xl font-bold">{courseCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <h3 className="text-gray-500">นักเรียนลงทะเบียน</h3>
          <p className="text-3xl font-bold">{studentCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500">รอตรวจสอบ</h3>
          <p className="text-3xl font-bold">{pendingStudents}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">การดำเนินการล่าสุด</h2>
        <p className="text-gray-600">ยินดีต้อนรับสู่ระบบหลังบ้านโรงเรียนเตรียมทหาร</p>
      </div>
    </div>
  );
}