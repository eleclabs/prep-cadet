import Link from 'next/link';
import CourseList from '@/components/CourseList'; // สมมติว่ามี Component นี้

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">พิชิตฝันสู่รั้วสี่เหล่าทัพ</h1>
        <h2 className="text-5xl font-bold mb-6">ปั้นฝันสู่รั้วสี่เหล่าทัพ ด้วยติวเตอร์ทหารตัวจริง</h2>
        <p className="text-xl mb-8 text-gray-300">โรงเรียนกวดวิชาเตรียมทหารชั้นนำ ประสบการณ์กว่า 15 ปี</p>
        <div className="flex justify-center gap-4">
          <Link href="/courses" className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-400">
            ดูหลักสูตร
          </Link>
          <Link href="/contact" className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100">
            ติดต่อเรา
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-3xl font-bold text-blue-800">500+</h3>
            <p>นักเรียนสอบติด</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-800">15 ปี</h3>
            <p>ประสบการณ์</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-800">100%</h3>
            <p>ความมุ่งมั่น</p>
          </div>
        </div>
      </section>

      {/* Course Section */}
      <section className="py-20 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">หลักสูตรที่เปิดสอน</h2>
        <CourseList /> 
      </section>


            {/* Quick Links */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/courses" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition block">
            <span className="text-4xl mb-4 block">📚</span>
            <h3 className="text-xl font-bold mb-2">หลักสูตรการเรียน</h3>
            <p className="text-gray-600">เลือกคอร์สที่ใช่สำหรับเหล่าทัพที่คุณฝัน</p>
          </Link>
          <Link href="/about" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition block">
            <span className="text-4xl mb-4 block">🏆</span>
            <h3 className="text-xl font-bold mb-2">เกี่ยวกับเรา</h3>
            <p className="text-gray-600">รู้จักโรงเรียนและความสำเร็จของนักเรียนเก่า</p>
          </Link>
          <Link href="/contact" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition block">
            <span className="text-4xl mb-4 block">💬</span>
            <h3 className="text-xl font-bold mb-2">ติดต่อเรา</h3>
            <p className="text-gray-600">สอบถามข้อมูลเพิ่มเติมหรือจองคอร์สเรียน</p>
          </Link>
        </div>
      </section>
    </main>
  );
}


