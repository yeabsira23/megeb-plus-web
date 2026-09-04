'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/admin/Sidebar';
import Topbar from '@/app/components/admin/Topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-[250px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}