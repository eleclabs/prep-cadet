'use client';

// components/admin/ActivityTable.tsx

interface Activity {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  eventDate: string;
  isActive: boolean;
  order: number;
}

interface ActivityTableProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;      // ✅ ต้องรับ Activity
  onDelete: (activity: Activity) => void;    // ✅ ต้องรับ Activity (ไม่ใช่ id)
}

export default function ActivityTable({ activities, onEdit, onDelete }: ActivityTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">กิจกรรม</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">หมวดหมู่</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">วันที่</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td className="px-6 py-4">{activity.title}</td>
              <td className="px-6 py-4">{activity.category}</td>
              <td className="px-6 py-4">{new Date(activity.eventDate).toLocaleDateString('th-TH')}</td>
              <td className="px-6 py-4 space-x-2">
                {/* ✅ ส่ง activity ทั้งก้อน ไม่ใช่แค่ id */}
                <button 
                  onClick={() => onEdit(activity)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  แก้ไข
                </button>
                <button 
                  onClick={() => onDelete(activity)}
                  className="text-red-600 hover:text-red-900"
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