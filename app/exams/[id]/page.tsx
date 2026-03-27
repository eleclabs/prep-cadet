// app/exams/[id]/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuestionItem from '@/components/exam/QuestionItem';
import ExamTimer from '@/components/exam/ExamTimer';
import { Exam, Question } from '@/types/exam';

// Component ย่อยที่ต้องใช้ useSearchParams
function ExamContent({ examId }: { examId: string }) {

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchExam();
  }, [session, router, examId]);

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/exams/${examId}`);
      const data = await res.json();
      if (data.success) {
        setExam(data.exam);
      } else {
        alert(data.error || 'ไม่สามารถโหลดข้อสอบได้');
        router.push('/exams');
      }
    } catch (error) {
      console.error('Failed to fetch exam:', error);
      router.push('/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = async () => {
    if (!confirm('ต้องการส่งคำตอบหรือไม่? ไม่สามารถแก้ไขได้หลังจากส่งแล้ว')) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/exams/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        setSubmitted(true);
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการส่งคำตอบ');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (!submitted) {
      alert('หมดเวลา! ระบบจะส่งคำตอบอัตโนมัติ');
      handleSubmit();
    }
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลดข้อสอบ...</div>;
  }

  if (!exam) {
    return <div className="p-8 text-center text-red-600">ไม่พบข้อสอบ</div>;
  }

  // หน้าแสดงผลหลังส่งคำตอบ
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className={`text-center p-8 rounded-xl mb-8 ${
            result.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h1 className="text-3xl font-bold mb-2">
              {result.passed ? '🎉 ยินดีด้วย! คุณผ่านข้อสอบ' : '😔 เสียใจด้วย คุณไม่ผ่านข้อสอบ'}
            </h1>
            <p className="text-5xl font-bold my-4">
              {result.percentage}%
            </p>
            <p className="text-lg">
              คะแนน: {result.score} / {result.totalScore} คะแนน
              {result.passedThreshold && ` (ผ่านที่ ${result.passedThreshold}%)`}
            </p>
          </div>

          <div className="space-y-6">
            {result.answers.map((ans: any, index: number) => (
              <QuestionItem
                key={ans.questionId}
                question={{
                  _id: ans.questionId,
                  text: ans.questionText,
                  options: [], // ไม่แสดงตัวเลือกในหน้าผลลัพธ์
                  correctAnswer: ans.correctAnswer,
                } as Question}
                selectedAnswer={ans.selectedAnswer}
                onSelect={() => {}}
                showResult={true}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/exams')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              กลับไปเลือกข้อสอบอื่น
            </button>
          </div>
        </div>
      </div>
    );
  }

  // หน้าทำข้อสอบ
  return (
    <div className="min-h-screen bg-slate-50">
      <ExamTimer duration={exam.duration} onTimeUp={handleTimeUp} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h1 className="text-2xl font-bold text-slate-800">{exam.title}</h1>
          <p className="text-slate-600 mt-2">{exam.description}</p>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="text-slate-500">📚 {exam.subject}</span>
            <span className="text-slate-500">⏱️ {exam.duration} นาที</span>
            <span className="text-slate-500">📝 {exam.questions?.length} ข้อ</span>
            <span className="text-slate-500">✅ ผ่านที่ {exam.passingScore}%</span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {exam.questions?.map((question: Question, index: number) => (
            <div key={question._id}>
              <p className="font-medium text-slate-700 mb-2">
                ข้อที่ {index + 1}
              </p>
              <QuestionItem
                question={question}
                selectedAnswer={answers[question._id!]}
                onSelect={handleSelectAnswer}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white p-4 rounded-xl shadow-lg border border-slate-200">
          <div className="flex justify-between items-center">
            <p className="text-slate-600">
              ตอบแล้ว {Object.keys(answers).length} / {exam.questions?.length} ข้อ
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length === 0}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'กำลังส่ง...' : 'ส่งคำตอบ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page หลักที่หุ้มด้วย Suspense
export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">กำลังโหลด...</div>}>
      <ExamWrapper params={params} />
    </Suspense>
  );
}

// Wrapper เพื่อ await params
async function ExamWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExamContent examId={id} />;
}