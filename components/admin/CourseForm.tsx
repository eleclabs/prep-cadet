'use client';

import { useState, useEffect } from 'react';

interface Course {
  _id?: string;
  title: string;
  branch: string;
  price: number;
  description: string;
  schedule: string;
  image: string;
  isActive: boolean;
}

interface CourseFormProps {
  course: Course | null;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CourseForm({ course, onClose, onSubmit }: CourseFormProps) {
  const [formData, setFormData] = useState<Course>({
    title: '',
    branch: 'Army',
    price: 0,
    description: '',
    schedule: '',
    image: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = course ? `/api/admin/courses/${course._id}` : '/api/admin/courses';
      const method = course ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert(course ? 'อัปเดตคอร์สเรียบร้อยแล้ว' : 'เพิ่มคอร์สเรียบร้อยแล้ว');
        onSubmit();
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{course ? 'แก้ไขคอร์ส' : 'เพิ่มคอร์สใหม่'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อคอร์ส</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="เช่น คอร์สเตรียมทหารเหล่าทัพ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เหล่าทัพ</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Army">กองทัพบก</option>
              <option value="Navy">กองทัพเรือ</option>
              <option value="AirForce">กองทัพอากาศ</option>
              <option value="Police">ตำรวจ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เวลาเรียน</label>
            <input
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="เช่น เสาร์-อาทิตย์ 09:00 - 16:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">เปิดรับสมัคร</label>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}