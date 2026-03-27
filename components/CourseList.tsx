'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  price: number;
  branch: string;
  image: string;
}



export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {courses.map((course) => (
        <div key={course._id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
          <div className="h-48 bg-gray-300">
            {/* ใช้ next/image ในงานจริง */}
            <img src={course.image || '/placeholder.jpg'} alt={course.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <span className="text-xs font-bold text-blue-600 uppercase">{course.branch}</span>
            <h3 className="text-xl font-bold mt-2">{course.title}</h3>
            <p className="text-gray-600 mt-2">ราคา: {course.price.toLocaleString()} บาท</p>
            {/*  // components/CourseList.tsx (แก้ไขส่วนปุ่ม) */}
            <Link
              href={`/register?courseId=${course._id}`}
              className="mt-4 w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 text-center block"
            >
              ลงทะเบียนเรียน
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}