"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
import {
  Bell,
  UserRound,
  ChevronDown,
  LogOut,
} from "lucide-react";

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [nutritionistName, setNutritionistName] =
    useState("Nutritionist");

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/auth/login",
    });
  };

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const session = await getSession();

        if (!isMounted) return;

        const user = session?.user;

        if (user?.name) {
          setNutritionistName(user.name);
        }

        if (user?.image) {
          setProfileImage(user.image);
        }
      } catch (error) {
        console.error(
          "Unable to load nutritionist session:",
          error
        );
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="flex h-[82px] items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 sm:px-7 lg:px-8">

      {/* LEFT SIDE */}
      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E876E]">
          Nutritionist Portal
        </p>

        <p className="font-body mt-1 text-[12px] text-[#2D312E]/40">
          Manage your clients, appointments, and nutrition plans
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* NOTIFICATIONS */}
        <Link
          href="/nutritionist/notifications"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] text-[#2D312E]/55 transition hover:border-[#3D5A4C]/20 hover:text-[#3D5A4C]"
        >
          <Bell size={18} />

          {/* Unread indicator */}
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </Link>

        {/* PROFILE */}
        <div className="relative border-l border-[#2D312E]/[0.08] pl-4">

          {/* PROFILE BUTTON */}
          <button
            type="button"
            onClick={() =>
              setIsProfileOpen((previous) => !previous)
            }
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#FAF9F6]"
          >

            {/* PROFILE IMAGE / FALLBACK */}
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#E9F0EC] text-[#3D5A4C]">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={nutritionistName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={19} />
              )}

            </div>

            {/* PROFILE NAME */}
            <div className="hidden text-left sm:block">

              <p className="max-w-[150px] truncate font-body text-[12px] font-bold text-[#2D312E]">
                {nutritionistName}
              </p>

              <p className="font-body text-[10px] text-[#2D312E]/40">
                Nutritionist
              </p>

            </div>

            {/* ARROW */}
            <ChevronDown
              size={15}
              className={`hidden text-[#2D312E]/45 transition-transform sm:block ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />

          </button>

          {/* DROPDOWN */}
          {isProfileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[52px] z-50 w-52 overflow-hidden rounded-xl border border-[#2D312E]/[0.08] bg-white shadow-[0_10px_30px_rgba(45,49,46,0.10)]"
            >

              {/* PROFILE */}
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

              {/* DIVIDER */}
              <div className="border-t border-[#2D312E]/[0.07]" />

              {/* SIGN OUT */}
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