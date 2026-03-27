// app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // เช็คว่าเป็น Admin หรือไม่
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:block">
        <div className="p-6 text-xl font-bold text-yellow-500">ADMIN PANEL</div>
        <nav className="mt-6">
          <a href="/admin" className="block py-3 px-6 hover:bg-slate-800">ภาพรวม</a>
          <a href="/admin/courses" className="block py-3 px-6 hover:bg-slate-800">จัดการคอร์ส</a>
          <a href="/admin/students" className="block py-3 px-6 hover:bg-slate-800">รายชื่อนักเรียน</a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}