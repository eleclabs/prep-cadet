// app/activities/page.tsx
import { Activity } from '@/models/Activity';
import dbConnect from '@/lib/db';
import Image from 'next/image';

export const metadata = {
  title: 'ภาพกิจกรรม | โรงเรียนกวดวิชาเตรียมทหาร',
  description: 'ดูภาพบรรยากาศการเรียน กิจกรรม และความสำเร็จของนักเรียน',
};

const categoryLabels: Record<string, string> = {
  training: 'การฝึก',
  ceremony: 'พิธีการ',
  sports: 'กีฬา',
  academic: 'วิชาการ',
  other: 'อื่นๆ',
};

const categoryColors: Record<string, string> = {
  training: 'bg-green-100 text-green-800',
  ceremony: 'bg-yellow-100 text-yellow-800',
  sports: 'bg-blue-100 text-blue-800',
  academic: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800',
};

async function getActivities() {
  try {
    await dbConnect();
    const { Activity } = await import('@/models/Activity');
    const activities = await Activity.find({ isActive: true })
      .sort({ order: 1, eventDate: -1 })
      .lean();
    return JSON.parse(JSON.stringify(activities));
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return [];
  }
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">ภาพกิจกรรม</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            บรรยากาศการเรียน การฝึก และกิจกรรมต่างๆ ของโรงเรียนกวดวิชาเตรียมทหาร
          </p>
        </div>
      </section>

      {/* Filter Info */}
      <section className="py-8 container mx-auto px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <span 
              key={key}
              className={`px-4 py-2 rounded-full text-sm font-medium ${categoryColors[key]}`}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 container mx-auto px-4">
        {activities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">ยังไม่มีภาพกิจกรรม</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity: any) => (
              <div 
                key={activity._id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  {activity.image ? (
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[activity.category]}`}>
                      {categoryLabels[activity.category]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                  
                  {activity.eventDate && (
                    <p className="text-sm text-gray-500 mb-3 flex items-center">
                      <span className="mr-2">📅</span>
                      {new Date(activity.eventDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  
                  {activity.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">สนใจร่วมกิจกรรมกับเรา?</h2>
          <p className="text-blue-100 mb-6">สมัครเรียนวันนี้ เพื่อเป็นส่วนหนึ่งของครอบครัวเตรียมทหาร</p>
          <a 
            href="/register"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            สมัครเรียนเลย
          </a>
        </div>
      </section>
    </div>
  );
}