// app/about/page.tsx
import Image from 'next/image';

export const metadata = {
  title: 'เกี่ยวกับเรา | โรงเรียนกวดวิชาเตรียมทหาร',
  description: 'โรงเรียนกวดวิชาเตรียมทหารชั้นนำ ประสบการณ์กว่า 15 ปี สร้างนักเรียนสอบติดกว่า 500 คน',
};

export default function AboutPage() {
  const stats = [
    { number: '15+', label: 'ปีประสบการณ์', icon: '🏆' },
    { number: '500+', label: 'นักเรียนสอบติด', icon: '🎖️' },
    { number: '95%', label: 'อัตราการสอบผ่าน', icon: '📈' },
    { number: '50+', label: 'ติวเตอร์ผู้เชี่ยวชาญ', icon: '👨‍🏫' },
  ];

  const branches = [
    {
      name: 'กองทัพบก',
      description: 'เตรียมความพร้อมสอบเข้าโรงเรียนนายร้อยพระจุลจอมเกล้า (จปร.)',
      icon: '⭐',
      color: 'bg-green-50 border-green-200',
    },
    {
      name: 'กองทัพเรือ',
      description: 'ติวเข้มสอบเข้าโรงเรียนนายเรือ หลักสูตรเข้มข้นโดยศิษย์เก่า',
      icon: '⚓',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      name: 'กองทัพอากาศ',
      description: 'เตรียมสอบเข้าโรงเรียนนายเรืออากาศ เน้นวิชาวิทยาศาสตร์และคณิตศาสตร์',
      icon: '✈️',
      color: 'bg-sky-50 border-sky-200',
    },
    {
      name: 'ตำรวจ',
      description: 'หลักสูตรเตรียมสอบเข้าโรงเรียนนายร้อยตำรวจ (ตร.) ครบทุกวิชา',
      icon: '👮',
      color: 'bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">เกี่ยวกับโรงเรียน</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            โรงเรียนกวดวิชาเตรียมทหารชั้นนำ มุ่งมั่นปั้นฝันเยาวชนไทยสู่รั้วสี่เหล่าทัพ 
            ด้วยหลักสูตรที่ออกแบบโดยผู้เชี่ยวชาญและติวเตอร์ทหารตัวจริง
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">พันธกิจของเรา</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <p className="text-gray-700">หลักสูตรที่อัปเดตตามแนวข้อสอบล่าสุดของทุกเหล่าทัพ</p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <p className="text-gray-700">ติวเตอร์ที่มีประสบการณ์ตรงจากการสอบเข้าและรับราชการ</p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <p className="text-gray-700">ระบบดูแลนักเรียนแบบใกล้ชิด ทั้งวิชาการและสุขภาพจิต</p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <p className="text-gray-700">สื่อการเรียนการสอนทันสมัย พร้อมแบบฝึกหัดออนไลน์</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 rounded-2xl h-80 flex items-center justify-center">
            <span className="text-6xl">🏫</span>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">หลักสูตรตามเหล่าทัพ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {branches.map((branch, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl border-2 ${branch.color} hover:shadow-lg transition`}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{branch.icon}</span>
                  <h3 className="text-xl font-bold text-slate-900">{branch.name}</h3>
                </div>
                <p className="text-gray-700">{branch.description}</p>
                <a 
                  href={`/courses?branch=${branch.name}`}
                  className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
                >
                  ดูหลักสูตร →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">เสียงจากนักเรียนเก่า</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'ด.ช.สมชาย ใจกล้า',
              school: 'นักเรียนเตรียมทหาร รุ่นที่ 62',
              quote: 'ติวเตอร์สอนเข้าใจง่าย มีเทคนิคทำข้อสอบดีๆ มากๆ ขอบคุณที่ทำให้ฝันเป็นจริง!',
            },
            {
              name: 'ด.ญ.มานะ รักดี',
              school: 'นักเรียนนายร้อยตำรวจ',
              quote: 'บรรยากาศการเรียนเป็นกันเอง เพื่อนๆ ช่วยกันเรียน ช่วยกันติว ทำให้มีกำลังใจ',
            },
            {
              name: 'ด.ช.วิริยะ พยายาม',
              school: 'นักเรียนนายเรืออากาศ',
              quote: 'ได้ฝึกทำข้อสอบเก่าเยอะมาก พอเจอข้อสอบจริงรู้สึกมั่นใจขึ้นเยอะเลยครับ',
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.school}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}