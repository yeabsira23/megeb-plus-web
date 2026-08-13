'use client';

import { Bell } from 'lucide-react';

export default function Topbar({ adminName = 'Admin' }) {
  return (
    <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-[#2D312E]/[0.06] bg-[#FAF9F6]/95 px-5 backdrop-blur lg:px-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4E876E]">
          Admin Dashboard
        </p>
        <h2 className="font-display mt-1 text-[23px] text-[#2D312E]">
          Platform Overview
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative rounded-xl border border-[#2D312E]/[0.07] bg-white p-2.5 text-[#2D312E]/70 transition hover:bg-[#FAF9F6]">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#DCC48E]" />
        </button>

        {/* Admin */}
        <div className="hidden text-right sm:block">
          <p className="text-[11px] font-semibold text-[#2D312E]">
            {adminName}
          </p>
          <p className="text-[10px] text-[#2D312E]/45">
            System Administrator
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3D5A4C] text-sm font-semibold text-white">
          {adminName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}