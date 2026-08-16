import Sidebar from '@/app/components/admin/Sidebar';
import Topbar from '@/app/components/admin/Topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Sidebar />
      <div className="lg:ml-[250px]">
        <Topbar />
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}