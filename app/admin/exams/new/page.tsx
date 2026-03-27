'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'math',
    duration: 60,
    passingScore: 50,
    isActive: true,
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert('สร้างข้อสอบเรียบร้อยแล้ว');
        router.push(`/admin/exams/${data.exam._id}`);
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการสร้างข้อสอบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">สร้างข้อสอบใหม่</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อข้อสอบ *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="เช่น ข้อสอบคณิตศาสตร์เตรียมทหาร"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="รายละเอียดข้อสอบ..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วิชา *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
            >
              <option value="math">คณิตศาสตร์</option>
              <option value="science">วิทยาศาสตร์</option>
              <option value="english">ภาษาอังกฤษ</option>
              <option value="thai">ภาษาไทย</option>
              <option value="social">สังคมศึกษา</option>
              <option value="physical">พลศึกษา</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เวลาทำข้อสอบ (นาที) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เกณฑ์ผ่าน (%)</label>
            <input
              type="number"
              name="passingScore"
              value={formData.passingScore}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">เปิดให้ทำข้อสอบ</label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันเริ่มต้น</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันสิ้นสุด</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'กำลังสร้าง...' : 'สร้างข้อสอบ'}
          </button>
        </div>
      </form>
    </div>
  );
}