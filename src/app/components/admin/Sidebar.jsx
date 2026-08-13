'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UtensilsCrossed,
  CalendarCheck,
  CreditCard,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Nutritionists', icon: Stethoscope, path: '/admin/nutritionists', badge: 3 },
  { name: 'Food Database', icon: UtensilsCrossed, path: '/admin/food' },
  { name: 'Appointments', icon: CalendarCheck, path: '/admin/appointments' },
  { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
  { name: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
  { name: 'Audit Logs', icon: ClipboardList, path: '/admin/logs' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    router.push('/portal/login');
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] border-r border-[#2D312E]/[0.06] bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-[82px] items-center border-b border-[#2D312E]/[0.06] px-6">
          <div className="rounded-full border border-[#CCD6C4] bg-[#E9F0EC] px-5 py-2">
            <span className="font-display text-2xl font-bold text-[#3D5A4C]">
              Megeb<span className="text-[#4E876E]">+</span>
            </span>
          </div>
        </div>

        {/* Label */}
        <div className="px-6 pb-3 pt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4E876E]">
            Administration
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {MENU_ITEMS.map(({ name, icon: Icon, path, badge }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={name}
                href={path}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  isActive
                    ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                    : 'text-[#2D312E]/60 hover:bg-[#FAF9F6]'
                }`}
              >
                <Icon className="h-[18px] w-5 shrink-0" strokeWidth={1.75} />
                <span className="text-[13px]">{name}</span>
                {badge !== undefined && (
                  <span className="ml-auto rounded-full bg-[#DCC48E] px-2 py-0.5 text-[10px] font-bold text-[#2D312E]">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#2D312E]/[0.06] p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-[18px] w-5 shrink-0" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}