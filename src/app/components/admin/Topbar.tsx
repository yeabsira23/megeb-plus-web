'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';


type TopbarProps = {
  adminName?: string;
  role?: string;
  onMenuClick?: () => void;
};

function useUnreadNotifications() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchUnreadCount() {
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<{ count: number }>('/admin/notifications/unread-count');
        // if (isMounted) setCount(data.count);
        if (isMounted) setCount(0);
      } catch (err) {
        console.error('Unable to load unread notifications:', err);
        if (isMounted) setCount(0);
      }
    }
    fetchUnreadCount();
    return () => { isMounted = false; };
  }, []);

  return count;
}

export default function Topbar({ adminName = 'Admin', role = 'System Administrator', onMenuClick }: TopbarProps) {
  const unreadCount = useUnreadNotifications();
  const initial = adminName.trim() ? adminName.charAt(0).toUpperCase() : 'A';

  return (
    <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-[#2D312E]/[0.06] bg-[#FAF9F6]/95 px-5 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC] lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4E876E]">Admin Dashboard</p>
          <h2 className="font-display mt-1 text-[23px] text-[#2D312E]">Platform Overview</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification */}
         {/* <button
          type="button"
          className="relative rounded-xl border border-[#2D312E]/[0.07] bg-white p-2.5 text-[#2D312E]/70 transition hover:bg-[#FAF9F6]"
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          {unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#DCC48E]" />}
        </button> */}

        {/* Admin */}
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#E9F0EC]/60"
        >
          <div className="hidden text-right sm:block">
            <p className="text-[11px] font-semibold text-[#2D312E]">{adminName}</p>
            <p className="text-[10px] text-[#2D312E]/65">{role}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3D5A4C] text-sm font-semibold text-white">
            {initial}
          </div>
        </Link>
      </div>
    </header>
  );
}