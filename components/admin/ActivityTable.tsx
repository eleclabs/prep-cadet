'use client';

interface Activity {
  _id: string;
  title: string;
  category: string;
  eventDate: string;
  isActive: boolean;
  image: string;
}

interface ActivityTableProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export default function ActivityTable({ activities, onEdit, onDelete }: ActivityTableProps) {
  const categoryLabels: Record<string, string> = {
    training: 'การฝึก',
    ceremony: 'พิธีการ',
    sports: 'กีฬา',
    academic: 'วิชาการ',
    other: 'อื่นๆ',
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รูปภาพ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อกิจกรรม</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หมวดหมู่</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr key={activity._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {activity.image ? (
                  <img src={activity.image} alt={activity.title} className="h-12 w-12 object-cover rounded" />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs">📷</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{activity.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {categoryLabels[activity.category]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {activity.eventDate ? new Date(activity.eventDate).toLocaleDateString('th-TH') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  activity.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {activity.isActive ? 'แสดง' : 'ซ่อน'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onEdit(activity)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => onDelete(activity._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">ยังไม่มีกิจกรรม</div>
      )}
    </div>
  );
}