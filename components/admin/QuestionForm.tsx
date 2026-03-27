'use client';

import { useState, useEffect } from 'react';

interface Question {
  _id?: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
  score: number;
  explanation: string;
}

interface QuestionFormProps {
  examId: string;
  question: Question | null;
  onClose: () => void;
  onSubmit: () => void;
}

export default function QuestionForm({ examId, question, onClose, onSubmit }: QuestionFormProps) {
  const [formData, setFormData] = useState<Question>({
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    score: 1,
    explanation: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData(question);
    }
  }, [question]);

  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: any) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect' && value === true) {
      // อนุญาตให้มีคำตอบถูกได้เพียง 1 ข้อ
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบว่ามีคำตอบถูกอย่างน้อย 1 ข้อ
    const hasCorrect = formData.options.some(opt => opt.isCorrect);
    if (!hasCorrect) {
      alert('กรุณาเลือกคำตอบที่ถูกต้องอย่างน้อย 1 ข้อ');
      return;
    }

    setLoading(true);

    try {
      const url = question ? '/api/admin/questions' : '/api/admin/questions';
      const method = 'PUT';

      const payload = question 
        ? { ...formData, _id: question._id }
        : { ...formData, examId };

      const res = await fetch(url, {
        method: question ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(question ? 'อัปเดตคำถามเรียบร้อยแล้ว' : 'เพิ่มคำถามเรียบร้อยแล้ว');
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
        <h2 className="text-2xl font-bold mb-6">{question ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">โจทย์คำถาม *</label>
            <textarea
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="พิมพ์โจทย์คำถาม..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ตัวเลือกคำตอบ *</label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={option.isCorrect}
                  onChange={() => handleOptionChange(index, 'isCorrect', true)}
                  className="w-4 h-4"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2"
                  placeholder={`ตัวเลือก ${String.fromCharCode(65 + index)}`}
                />
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-1">คลิกวงกลมเพื่อเลือกคำตอบที่ถูกต้อง</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">คะแนน</label>
            <input
              type="number"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายคำตอบ</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="อธิบายทำไมคำตอบนี้ถึงถูก..."
            />
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