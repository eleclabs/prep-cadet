// app/contact/page.tsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'สอบถามหลักสูตร',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ในที่นี้สามารถเชื่อมต่อกับการส่งอีเมลหรือบันทึกข้อมูลลงฐานข้อมูลได้
      // ตัวอย่าง: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
      
      // จำลองการส่งสำเร็จ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'สอบถามหลักสูตร', message: '' });
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'ที่อยู่',
      content: '123 ถนน แขวง เขต กรุงเทพฯ 10100',
    },
    {
      icon: '📞',
      title: 'โทรศัพท์',
      content: '02-xxx-xxxx, 089-xxx-xxxx',
    },
    {
      icon: '📧',
      title: 'อีเมล',
      content: 'info@prepcadet.ac.th',
    },
    {
      icon: '💬',
      title: 'Line Official',
      content: '@prepcadet',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">ติดต่อเรา</h1>
          <p className="text-xl text-gray-300">
            มีคำถามหรือต้องการข้อมูลเพิ่มเติม? ติดต่อเราได้ทันที
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">ส่งข้อความถึงเรา</h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-600 mb-2">ส่งข้อความสำเร็จ!</h3>
                <p className="text-gray-600 mb-6">เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="เช่น นายสมชาย ใจดี"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                      placeholder="เช่น 081-234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อ *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="สอบถามหลักสูตร">สอบถามหลักสูตรการเรียน</option>
                    <option value="สมัครเรียน">ต้องการสมัครเรียน</option>
                    <option value="ชำระเงิน">สอบถามการชำระเงิน</option>
                    <option value="อื่นๆ">คำถามอื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความ *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">ช่องทางการติดต่อ</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-2xl mr-4">{info.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{info.title}</h3>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🗺️</span>
                  <p className="text-gray-600">แผนที่โรงเรียน</p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    className="text-blue-600 text-sm hover:underline"
                  >
                    เปิดใน Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-3">🕒 เวลาทำการ</h3>
              <div className="space-y-2 text-blue-100">
                <p>จันทร์ - ศุกร์: 09:00 - 18:00 น.</p>
                <p>เสาร์ - อาทิตย์: 08:00 - 17:00 น.</p>
                <p className="mt-4 text-sm">* เปิดให้บริการทุกวันไม่มีวันหยุด</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">คำถามที่พบบ่อย</h2>
          <div className="space-y-4">
            {[
              {
                q: 'ต้องเตรียมเอกสารอะไรในการสมัครเรียน?',
                a: 'เพียงกรอกแบบฟอร์มออนไลน์ให้ครบถ้วน เจ้าหน้าที่จะติดต่อกลับเพื่อแจ้งเอกสารเพิ่มเติม',
              },
              {
                q: 'สามารถทดลองเรียนได้หรือไม่?',
                a: 'ได้ครับ เรามีคลาสทดลองเรียนฟรี 1 คาบ สำหรับผู้ที่สนใจสามารถติดต่อเจ้าหน้าที่เพื่อจองคิว',
              },
              {
                q: 'มีบริการรถรับ-ส่งหรือไม่?',
                a: 'มีบริการรถรับ-ส่งในเส้นทางหลัก กรุณาสอบถามรายละเอียดเพิ่มเติมที่เจ้าหน้าที่',
              },
            ].map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-lg">
                <summary className="flex justify-between items-center p-4 cursor-pointer font-medium text-slate-900">
                  {faq.q}
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="px-4 pb-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}