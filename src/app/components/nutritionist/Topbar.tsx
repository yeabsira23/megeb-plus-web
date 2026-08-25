"use client";

import Link from "next/link";
import { Bell, UserRound } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-[82px] items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 sm:px-7 lg:px-8">
      {/* Left Side */}
      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E876E]">
          Nutritionist Portal
        </p>

        <p className="font-body mt-1 text-[12px] text-[#2D312E]/40">
          Manage your clients, appointments, and nutrition plans
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] text-[#2D312E]/55 transition hover:border-[#3D5A4C]/20 hover:text-[#3D5A4C]"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#DCC48E]" />
        </button>

        {/* Profile */}
        <Link
          href="/nutritionist/profile"
          className="flex items-center gap-3 border-l border-[#2D312E]/[0.08] pl-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
            <UserRound size={19} />
          </div>

          <div className="hidden sm:block">
            <p className="font-body text-[12px] font-bold text-[#2D312E]">
              Dr. Sarah
            </p>

            <p className="font-body text-[10px] text-[#2D312E]/40">
              Nutritionist
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}