'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CourseForm from '@/components/admin/CourseForm';
import CourseTable from '@/components/admin/CourseTable';

// ✅ Course Interface (ต้องตรงกับ CourseTable)
interface Course {
  _id: string;
  title: string;
  branch: string;
  price: number;
  description: string;    // ✅ ต้องมี
  schedule: string;       // ✅ ต้องมี
  image: string;          // ✅ ต้องมี
  isActive: boolean;
}

export default function AdminCoursesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    } 
    fetchCourses();
  }, [session, router]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ แก้ไข: รับ course แทน id
  const handleDelete = async (course: Course) => {
    if (!confirm('ต้องการลบคอร์สนี้หรือไม่?')) return;

    try {
      // ✅ ใช้ course._id แทน id
      const res = await fetch(`/api/admin/courses/${course._id}`, { 
        method: 'DELETE' 
      });
      const data = await res.json();
      if (data.success) {
        fetchCourses();
        alert('ลบคอร์สเรียบร้อยแล้ว');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingCourse(null);
    fetchCourses();
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลด...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">จัดการคอร์สเรียน</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
        >
          + เพิ่มคอร์สใหม่
        </button>
      </div>

      {/* ✅ ตอนนี้ onEdit และ onDelete ตรงกับที่ CourseTable ต้องการ */}
      <CourseTable 
        courses={courses} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {isFormOpen && (
        <CourseForm
          course={editingCourse}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCourse(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}