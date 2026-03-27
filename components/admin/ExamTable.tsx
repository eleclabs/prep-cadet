// components/admin/ExamTable.tsx
'use client';

import { Exam } from '@/types/exam';
import Link from 'next/link';

interface ExamTableProps {
  exams: Exam[];
  onDelete: (id: string) => void;
}

export default function ExamTable({ exams, onDelete }: ExamTableProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        ยังไม่มีข้อสอบในระบบ
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ชื่อข้อสอบ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">วิชา</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ความยาก</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">เวลา (นาที)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">คะแนนผ่าน</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">คำถาม</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {exams.map((exam) => (
            <tr key={exam._id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">{exam.title}</div>
                <div className="text-sm text-slate-500 truncate max-w-xs">{exam.description}</div>
              </td>
              <td className="px-6 py-4 text-slate-700">{exam.subject}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                  {exam.difficulty === 'easy' ? 'ง่าย' : exam.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-700">{exam.duration}</td>
              <td className="px-6 py-4 text-slate-700">{exam.passingScore}%</td>
              <td className="px-6 py-4 text-slate-700">{exam.questions?.length || 0} ข้อ</td>
              <td className="px-6 py-4 space-x-2">
                <Link
                  href={`/admin/exams/${exam._id}`}
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  แก้ไข
                </Link>
                <Link
                  href={`/admin/exams/${exam._id}/results`}
                  className="text-purple-600 hover:text-purple-900 font-medium"
                >
                  ผลการสอบ
                </Link>
                <button
                  onClick={() => onDelete(exam._id!)}
                  className="text-red-600 hover:text-red-900 font-medium"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}