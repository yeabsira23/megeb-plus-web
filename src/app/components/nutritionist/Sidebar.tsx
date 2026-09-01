"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/app/lib/api";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  UserRound,
  LogOut,
  X,
  Utensils,
  Database,
} from "lucide-react";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const MENU_ITEMS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/nutritionist/dashboard",
  },
  {
    name: "Clients",
    icon: Users,
    path: "/nutritionist/clients",
  },
  {
    name: "Appointments",
    icon: CalendarDays,
    path: "/nutritionist/appointments",
  },
  {
    name: "Nutrition Plans",
    icon: ClipboardList,
    path: "/nutritionist/nutrition-plans",
  },
  
  {
    name: "Food Database",
    icon: Database,
    path: "/nutritionist/foods",
  },
   {
    name: "Meal Library",
    icon:  Utensils,
    path: "/nutritionist/meals",
  },
  {
    name: "Consultations & Messages",
    icon: MessageSquare,
    path: "/nutritionist/consultations",
  },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearSession();
    router.push("/auth/login");
  }

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#2D312E]/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[250px] border-r border-[#2D312E]/[0.06] bg-white transition-transform duration-300 lg:z-40 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="flex h-[82px] items-center justify-between border-b border-[#2D312E]/[0.06] px-6">
            <Link
              href="/nutritionist/dashboard"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="rounded-full border border-[#CCD6C4] bg-[#E9F0EC] px-5 py-2">
                <span className="font-display text-2xl font-bold text-[#3D5A4C]">
                  Megeb<span className="text-[#4E876E]">+</span>
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-[#2D312E]/40 hover:bg-[#E9F0EC] lg:hidden"
              aria-label="Close menu"
            >
              <X size={19} />
            </button>
          </div>

          {/* Section Label */}
          <div className="px-6 pb-3 pt-7">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4E876E]">
              Nutritionist Portal
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
            {MENU_ITEMS.map(({ name, icon: Icon, path }) => {
              const isActive = pathname === path;

              return (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    isActive
                      ? "bg-[#E9F0EC] text-[#3D5A4C]"
                      : "text-[#2D312E]/60 hover:bg-[#FAF9F6] hover:text-[#3D5A4C]"
                  }`}
                >
                  <Icon
                    className="h-[18px] w-5 shrink-0"
                    strokeWidth={1.75}
                  />

                  <span className="font-body text-[13px]">
                    {name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-[#2D312E]/[0.06] p-4">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-body text-[13px] text-red-500 transition hover:bg-red-50"
            >
              <LogOut
                className="h-[18px] w-5 shrink-0"
                strokeWidth={1.75}
              />

              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}