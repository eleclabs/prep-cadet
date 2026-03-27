// app/admin/activities/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';  // ✅ ตรวจสอบว่า import ถูกต้อง
import { useRouter } from 'next/navigation';
import ActivityForm from '@/components/admin/ActivityForm';
import ActivityTable from '@/components/admin/ActivityTable';

// ✅ Activity Interface (ต้องตรงกับ ActivityTable)
interface Activity {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  eventDate: string;    // ✅ ต้องมี
  isActive: boolean;
  order: number;
}

export default function AdminActivitiesPage() {
  // ✅ แก้ไข: ต้องเป็น { data: session } ไม่ใช่ { session }
  const { data: session } = useSession();
  const router = useRouter();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ ตรวจสอบ session อย่างปลอดภัย
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchActivities();
  }, [session, router]);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/admin/activities');
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ แก้ไข: รับ activity แทน id (ให้ตรงกับที่ ActivityTable ต้องการ)
  const handleDelete = async (activity: Activity) => {
    if (!confirm('ต้องการลบกิจกรรมนี้หรือไม่?')) return;

    try {
      // ✅ ใช้ activity._id แทน id
      const res = await fetch(`/api/admin/activities/${activity._id}`, { 
        method: 'DELETE' 
      });
      const data = await res.json();
      if (data.success) {
        fetchActivities();
        alert('ลบกิจกรรมเรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingActivity(null);
    fetchActivities();
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลด...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">จัดการภาพกิจกรรม</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
        >
          + เพิ่มกิจกรรมใหม่
        </button>
      </div>

      {/* ✅ ตอนนี้ onEdit และ onDelete ตรงกับที่ ActivityTable ต้องการ */}
      <ActivityTable 
        activities={activities} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {isFormOpen && (
        <ActivityForm
          activity={editingActivity}
          onClose={() => {
            setIsFormOpen(false);
            setEditingActivity(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}