"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Bell,
  UserRound,
  ChevronDown,
  LogOut,
} from "lucide-react";

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/auth/login",
    });
  };

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
          <Link
            href="/nutritionist/notifications"
            className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-[#16806B]"
            aria-label="Notifications"
          >
            <Bell size={21} />

            {/* Unread indicator */}
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Link>
        </button>

        {/* Profile Dropdown */}
        <div className="relative border-l border-[#2D312E]/[0.08] pl-4">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#FAF9F6]"
          >
            {/* Profile Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
              <UserRound size={19} />
            </div>

            {/* Profile Name */}
            <div className="hidden text-left sm:block">
              <p className="font-body text-[12px] font-bold text-[#2D312E]">
                Dr. Sarah
              </p>

              <p className="font-body text-[10px] text-[#2D312E]/40">
                Nutritionist
              </p>
            </div>

            {/* Arrow */}
            <ChevronDown
              size={15}
              className={`hidden text-[#2D312E]/45 transition-transform sm:block ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-[52px] z-50 w-48 overflow-hidden rounded-xl border border-[#2D312E]/[0.08] bg-white shadow-[0_10px_30px_rgba(45,49,46,0.10)]">
              {/* Profile */}
              <Link
                href="/nutritionist/profile"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[#2D312E]/70 transition hover:bg-[#F6F8F6] hover:text-[#3D5A4C]"
              >
                <UserRound size={16} />

                <span className="font-body text-[12px] font-medium">
                  Profile
                </span>
              </Link>

              {/* Divider */}
              <div className="border-t border-[#2D312E]/[0.07]" />

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#B45B5B] transition hover:bg-[#FFF5F5]"
              >
                <LogOut size={16} />

                <span className="font-body text-[12px] font-medium">
                  Sign out
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}