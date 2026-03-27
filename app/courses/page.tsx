// app/courses/page.tsx
import Link from 'next/link';
import { Course } from '@/models/Course';
import dbConnect from '@/lib/db';

// ดึงข้อมูลคอร์สแบบ Server Component (ดีต่อ SEO)
async function getCourses() {
  try {
    await dbConnect();
    // หมายเหตุ: ใน production ควรใช้ API หรือ cache เพื่อป้องกันปัญหา Edge Runtime
    const { Course } = await import('@/models/Course');
    const courses = await Course.find({ isActive: true }).lean();
    // แปลง _id เป็น string เพื่อส่งเป็น JSON ได้
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

export const metadata = {
  title: 'หลักสูตรการเรียน | โรงเรียนกวดวิชาเตรียมทหาร',
  description: 'เลือกหลักสูตรเตรียมทหารที่เหมาะกับคุณ เหล่าทัพ กองทัพบก กองทัพเรือ กองทัพอากาศ และตำรวจ',
};

const branchLabels: Record<string, string> = {
  Army: 'กองทัพบก',
  Navy: 'กองทัพเรือ',
  AirForce: 'กองทัพอากาศ',
  Police: 'ตำรวจ',
};

const branchColors: Record<string, string> = {
  Army: 'bg-green-100 text-green-800',
  Navy: 'bg-blue-100 text-blue-800',
  AirForce: 'bg-sky-100 text-sky-800',
  Police: 'bg-purple-100 text-purple-800',
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">หลักสูตรเตรียมทหาร</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            เลือกหลักสูตรที่ใช่ เพื่อพิชิตฝันสู่รั้วสี่เหล่าทัพกับติวเตอร์มืออาชีพ
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16 container mx-auto px-4">
        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">ยังไม่มีหลักสูตรที่เปิดรับสมัครในขณะนี้</p>
            <Link href="/contact" className="text-blue-600 hover:underline mt-4 inline-block">
              ติดต่อสอบถามเพิ่มเติม
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  {course.image ? (
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🎓</span>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${branchColors[course.branch]}`}>
                      {branchLabels[course.branch]}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {course.price.toLocaleString()} บาท
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  
                  {course.schedule && (
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <span className="mr-2">📅</span>
                      {course.schedule}
                    </p>
                  )}
                  
                  {course.description && (
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {course.description}
                    </p>
                  )}

                  <Link 
                    href={`/register?courseId=${course._id}`}
                    className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    สมัครเรียนคอร์สนี้
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">ยังไม่แน่ใจว่าควรเลือกคอร์สไหน?</h2>
          <p className="text-blue-100 mb-6">ปรึกษาผู้เชี่ยวชาญของเราได้ฟรี เพื่อวางแผนการเรียนที่เหมาะสม</p>
          <Link 
            href="/contact"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            ติดต่อเราตอนนี้
          </Link>
        </div>
      </section>
    </div>
  );
}