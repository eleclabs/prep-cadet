'use client';

interface Course {
  _id: string;
  title: string;
  branch: string;
  price: number;
  isActive: boolean;
}

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

export default function CourseTable({ courses, onEdit, onDelete }: CourseTableProps) {
  const branchLabels: Record<string, string> = {
    Army: 'กองทัพบก',
    Navy: 'กองทัพเรือ',
    AirForce: 'กองทัพอากาศ',
    Police: 'ตำรวจ',
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อคอร์ส</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เหล่าทัพ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ราคา</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map((course) => (
            <tr key={course._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{course.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {branchLabels[course.branch]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {course.price.toLocaleString()} บาท
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {course.isActive ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onEdit(course)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => onDelete(course._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {courses.length === 0 && (
        <div className="text-center py-8 text-gray-500">ยังไม่มีคอร์สเรียน</div>
      )}
    </div>
  );
}