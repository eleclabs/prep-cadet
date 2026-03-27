// app/exams/page.tsx
import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Exam } from '@/models/Exam';

export const metadata = {
  title: 'ข้อสอบออนไลน์ | โรงเรียนกวดวิชาเตรียมทหาร',
  description: 'ทำข้อสอบออนไลน์วัดระดับความพร้อมก่อนสอบจริง',
};

const subjectLabels: Record<string, string> = {
  math: 'คณิตศาสตร์',
  science: 'วิทยาศาสตร์',
  english: 'ภาษาอังกฤษ',
  thai: 'ภาษาไทย',
  social: 'สังคมศึกษา',
  physical: 'พลศึกษา',
};

const subjectColors: Record<string, string> = {
  math: 'bg-blue-100 text-blue-800',
  science: 'bg-green-100 text-green-800',
  english: 'bg-purple-100 text-purple-800',
  thai: 'bg-yellow-100 text-yellow-800',
  social: 'bg-orange-100 text-orange-800',
  physical: 'bg-red-100 text-red-800',
};

async function getExams() {
  try {
    await dbConnect();
    const { Exam } = await import('@/models/Exam');
    const now = new Date();
    const exams = await Exam.find({ 
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: { $gte: now } }, { endDate: null }]
    }).lean();
    return JSON.parse(JSON.stringify(exams));
  } catch (error) {
    console.error('Failed to fetch exams:', error);
    return [];
  }
}

export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">ข้อสอบออนไลน์</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ทดสอบความรู้วัดระดับความพร้อมก่อนสอบจริง รู้ผลทันทีหลังทำข้อสอบ
          </p>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="py-16 container mx-auto px-4">
        {exams.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">ยังไม่มีข้อสอบที่เปิดให้ทำในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam: any) => (
              <div 
                key={exam._id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${subjectColors[exam.subject]}`}>
                      {subjectLabels[exam.subject]}
                    </span>
                    <span className="text-sm text-gray-500">⏱️ {exam.duration} นาที</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.title}</h3>
                  
                  {exam.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {exam.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>📝 {exam.totalScore} คะแนน</span>
                    <span>✅ ผ่าน {exam.passingScore}%</span>
                  </div>

                  {exam.endDate && (
                    <p className="text-xs text-red-500 mb-4">
                      สิ้นสุด: {new Date(exam.endDate).toLocaleDateString('th-TH')}
                    </p>
                  )}

                  <Link 
                    href={`/exams/${exam._id}/take`}
                    className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    เริ่มทำข้อสอบ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Check Results Section */}
      <section className="bg-blue-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">ตรวจสอบผลการสอบ</h2>
          <p className="text-blue-100 mb-6">ดูผลการสอบที่เคยทำไว้ได้ทุกเมื่อ</p>
          <Link 
            href="/exams/results"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            ตรวจสอบผลสอบ
          </Link>
        </div>
      </section>
    </div>
  );
}