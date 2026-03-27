'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QuestionForm from '@/components/admin/QuestionForm';

interface Question {
  _id: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
  score: number;
  explanation: string;
}

interface Exam {
  _id: string;
  title: string;
  subject: string;
  totalScore: number;
}

export default function ExamQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [params.id]);

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/admin/exams/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setExam(data.exam);
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Failed to fetch exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('ต้องการลบคำถามนี้หรือไม่?')) return;

    try {
      const res = await fetch(`/api/admin/questions?id=${questionId}&examId=${params.id}`, { 
        method: 'DELETE' 
      });
      const data = await res.json();
      if (data.success) {
        fetchExam();
        alert('ลบคำถามเรียบร้อยแล้ว');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingQuestion(null);
    fetchExam();
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลด...</div>;
  }

  if (!exam) {
    return <div className="p-8 text-center">ไม่พบข้อสอบ</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{exam.title}</h1>
          <p className="text-gray-600">คะแนนรวม: {exam.totalScore} คะแนน | คำถาม: {questions.length} ข้อ</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
        >
          + เพิ่มคำถาม
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{index + 1}. {question.questionText}</h3>
                <div className="space-y-1">
                  {question.options.map((option, optIndex) => (
                    <p 
                      key={optIndex} 
                      className={`text-sm ${option.isCorrect ? 'text-green-600 font-medium' : 'text-gray-600'}`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option.text}
                      {option.isCorrect && ' ✅'}
                    </p>
                  ))}
                </div>
                {question.explanation && (
                  <p className="text-sm text-gray-500 mt-3">💡 {question.explanation}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingQuestion(question);
                    setIsFormOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(question._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            ยังไม่มีคำถามในข้อสอบนี้
          </div>
        )}
      </div>

      {isFormOpen && (
        <QuestionForm
          examId={params.id as string}
          question={editingQuestion}
          onClose={() => {
            setIsFormOpen(false);
            setEditingQuestion(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}