"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  UserRound,
  Users,
  X,
  Bell,
  Clock3,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function NutritionistDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <div className="flex items-center">
          <span className="font-display text-[27px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[33px] font-black leading-none text-[#DCC48E]">
            +
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#2D312E]/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-[#2D312E]/[0.07] bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[82px] items-center justify-between border-b border-[#2D312E]/[0.07] px-6">
          <div className="flex items-center">
            <span className="font-display text-[28px] font-bold tracking-tight text-[#DCC48E]">
              Megeb
            </span>

            <span className="ml-1 font-display text-[34px] font-black leading-none text-[#DCC48E]">
              +
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-[#2D312E]/40 hover:bg-[#E9F0EC] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 font-body text-[9px] font-bold uppercase tracking-[0.16em] text-[#2D312E]/35">
            Workspace
          </p>

          {/* Dashboard */}
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active
          />

         <SidebarItem
  icon={<Users size={18} />}
  label="Clients"
  href="/nutritionist/clients"
/>

          {/* Appointments */}
          <SidebarItem
            icon={<CalendarDays size={18} />}
            label="Appointments"
            href="/nutritionist/appointments"
          />

          {/* Nutrition Plans */}
          <SidebarItem
            icon={<ClipboardList size={18} />}
            label="Nutrition Plans"
          />

          {/* Consultations & Messages */}
          <SidebarItem
            icon={<MessageSquare size={18} />}
            label="Consultations & Messages"
          />

          <div className="my-6 h-px bg-[#2D312E]/[0.07]" />

          <p className="mb-3 px-3 font-body text-[9px] font-bold uppercase tracking-[0.16em] text-[#2D312E]/35">
            Account
          </p>

          {/* Profile */}
          <SidebarItem
            icon={<UserRound size={18} />}
            label="Profile"
          />
        </nav>

        {/* Logout */}
        <div className="border-t border-[#2D312E]/[0.07] p-4">
          <Link
  href="/auth/login"
  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 font-body text-[13px] font-semibold text-[#2D312E]/55 transition hover:bg-[#FAF9F6] hover:text-[#3D5A4C]"
>
  <LogOut size={18} />
  Logout
</Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:pl-[250px]">
        {/* Top Bar */}
        <header className="hidden h-[82px] items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-8 lg:flex">
          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E876E]">
              Nutritionist Portal
            </p>

            <p className="font-body mt-1 text-[12px] text-[#2D312E]/40">
              Friday, August 14, 2026
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] text-[#2D312E]/55 transition hover:border-[#3D5A4C]/20 hover:text-[#3D5A4C]"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#DCC48E]" />
            </button>

            <div className="flex items-center gap-3 border-l border-[#2D312E]/[0.08] pl-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                <UserRound size={19} />
              </div>

              <div>
                <p className="font-body text-[12px] font-bold text-[#2D312E]">
                  Dr. Sarah
                </p>

                <p className="font-body text-[10px] text-[#2D312E]/40">
                  Nutritionist
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Welcome */}
          <section className="relative mb-7 overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D312E] via-[#3D5A4C] to-[#4D6B5C] px-6 py-7 shadow-[0_18px_40px_-20px_rgba(45,49,46,0.35)] sm:px-8 sm:py-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#DCC48E]/15" />

            <div className="pointer-events-none absolute -bottom-28 right-20 h-48 w-48 rounded-full bg-[#DCC48E]/10 blur-2xl" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DCC48E]" />

                <span className="font-body text-[9px] font-bold uppercase tracking-[0.16em] text-[#CCD6C4]">
                  Today
                </span>
              </div>

              <h1 className="font-display text-[27px] leading-tight text-white sm:text-[32px]">
                Welcome, Dr. Sarah 👋
              </h1>

              <p className="font-body mt-2 max-w-xl text-[13px] leading-5 text-white/60">
                Here&apos;s your overview for today. You have a few
                appointments and tasks waiting for you.
              </p>
            </div>
          </section>

          {/* Statistics */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<CalendarDays size={19} />}
              label="Today's Appointments"
              value="5"
              note="2 remaining"
            />

            <StatCard
              icon={<Users size={19} />}
              label="Total Clients"
              value="42"
              note="+3 this month"
            />

            <StatCard
              icon={<ClipboardList size={19} />}
              label="Nutrition Plans"
              value="18"
              note="4 need review"
            />

            <StatCard
              icon={<MessageSquare size={19} />}
              label="Unread Messages"
              value="3"
              note="Need your attention"
            />
          </section>

          {/* Main Grid */}
          <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            {/* Today's Appointments */}
            <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-[0_15px_35px_-18px_rgba(45,49,46,0.2)]">
              <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-display text-[20px] text-[#2D312E]">
                    Today&apos;s Appointments
                  </h2>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                    Friday, August 14
                  </p>
                </div>

                <Link
                  href="/nutritionist/appointments"
                  className="font-body inline-flex items-center gap-1 text-[11px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
                >
                  View all
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="divide-y divide-[#2D312E]/[0.06]">
                <Appointment
                  time="09:00 AM"
                  client="Hana Tesfaye"
                  type="Nutrition Consultation"
                  status="Confirmed"
                />

                <Appointment
                  time="10:30 AM"
                  client="Selam Alemu"
                  type="Follow-up Consultation"
                  status="Confirmed"
                />

                <Appointment
                  time="01:00 PM"
                  client="Meron Kebede"
                  type="Diet Assessment"
                  status="Pending"
                />

                <Appointment
                  time="03:30 PM"
                  client="Liya Michael"
                  type="Nutrition Consultation"
                  status="Confirmed"
                />
              </div>
            </section>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upcoming */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
                <div className="border-b border-[#2D312E]/[0.06] px-5 py-5">
                  <h2 className="font-display text-[19px] text-[#2D312E]">
                    Upcoming
                  </h2>
                </div>

                <div className="space-y-3 p-5">
                  <UpcomingAppointment
                    day="Tomorrow"
                    time="09:30 AM"
                    client="Mimi Yohannes"
                  />

                  <UpcomingAppointment
                    day="Monday"
                    time="11:00 AM"
                    client="Rahel Tadesse"
                  />

                  <UpcomingAppointment
                    day="Monday"
                    time="02:30 PM"
                    client="Betty Abraham"
                  />
                </div>
              </section>

              {/* Tasks */}
              <section className="rounded-2xl border border-[#DCC48E]/30 bg-[#DCC48E]/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#DCC48E]/30 text-[#4E876E]">
                    <FileText size={17} />
                  </div>

                  <div>
                    <h3 className="font-body text-[12px] font-bold text-[#2D312E]">
                      Tasks needing attention
                    </h3>

                    <p className="font-body mt-1 text-[11px] leading-5 text-[#2D312E]/55">
                      You have 4 nutrition plans waiting for review and 3
                      unread client messages.
                    </p>

                    <button
                      type="button"
                      className="font-body mt-3 text-[11px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
                    >
                      Review tasks →
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Recent Clients */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-display text-[20px] text-[#2D312E]">
                  Recent Clients
                </h2>

                <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                  Recently active clients
                </p>
              </div>

              <button
                type="button"
                className="font-body inline-flex items-center gap-1 text-[11px] font-bold text-[#4E876E]"
              >
                View clients
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <ClientCard
                name="Hana Tesfaye"
                detail="Weight Management"
                lastVisit="Today"
              />

              <ClientCard
                name="Selam Alemu"
                detail="Diabetes Nutrition"
                lastVisit="Yesterday"
              />

              <ClientCard
                name="Meron Kebede"
                detail="Healthy Lifestyle"
                lastVisit="Aug 11"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* SIDEBAR ITEM */

function SidebarItem({
  icon,
  label,
  active = false,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
}) {
  const className = `mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 font-body text-[12.5px] font-semibold transition ${
    active
      ? "bg-[#E9F0EC] text-[#3D5A4C]"
      : "text-[#2D312E]/50 hover:bg-[#FAF9F6] hover:text-[#3D5A4C]"
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {icon}
      {label}
    </button>
  );
}

/* STAT CARD */

function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
          {icon}
        </div>

        <span className="font-body text-[10px] font-semibold text-[#DCC48E]">
          Today
        </span>
      </div>

      <p className="font-body mt-4 text-[11px] font-semibold text-[#2D312E]/45">
        {label}
      </p>

      <p className="font-display mt-1 text-[28px] text-[#2D312E]">
        {value}
      </p>

      <p className="font-body mt-1 text-[10px] text-[#4E876E]">
        {note}
      </p>
    </section>
  );
}

/* APPOINTMENT */

function Appointment({
  time,
  client,
  type,
  status,
}: {
  time: string;
  client: string;
  type: string;
  status: "Confirmed" | "Pending";
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
      <div className="w-[65px] flex-shrink-0">
        <p className="font-body text-[11px] font-bold text-[#2D312E]">
          {time}
        </p>

        <div className="mt-1 flex items-center gap-1 text-[#2D312E]/35">
          <Clock3 size={11} />
          <span className="font-body text-[9px]">30 min</span>
        </div>
      </div>

      <div className="h-9 w-px bg-[#CCD6C4]" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-[12px] font-bold text-[#2D312E]">
          {client}
        </p>

        <p className="mt-0.5 truncate font-body text-[10px] text-[#2D312E]/45">
          {type}
        </p>
      </div>

      <span
        className={`hidden rounded-full px-2.5 py-1 font-body text-[9px] font-bold sm:block ${
          status === "Confirmed"
            ? "bg-[#E9F0EC] text-[#3D5A4C]"
            : "bg-[#DCC48E]/20 text-[#8A6D32]"
        }`}
      >
        {status}
      </span>

      <Link
        href="/nutritionist/appointments"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4E876E] transition hover:bg-[#E9F0EC]"
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}

/* UPCOMING */

function UpcomingAppointment({
  day,
  time,
  client,
}: {
  day: string;
  time: string;
  client: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#FAF9F6] p-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
        <CalendarDays size={17} />
      </div>

      <div className="min-w-0">
        <p className="font-body text-[11px] font-bold text-[#2D312E]">
          {day} · {time}
        </p>

        <p className="mt-0.5 truncate font-body text-[10px] text-[#2D312E]/45">
          {client}
        </p>
      </div>
    </div>
  );
}

/* CLIENT */

function ClientCard({
  name,
  detail,
  lastVisit,
}: {
  name: string;
  detail: string;
  lastVisit: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#2D312E]/[0.06] bg-[#FAF9F6]/60 p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
        <UserRound size={17} />
      </div>

      <div className="min-w-0">
        <p className="truncate font-body text-[11.5px] font-bold text-[#2D312E]">
          {name}
        </p>

        <p className="mt-0.5 truncate font-body text-[10px] text-[#2D312E]/45">
          {detail}
        </p>

        <p className="mt-1 font-body text-[9px] text-[#4E876E]">
          Last visit: {lastVisit}
        </p>
      </div>
    </div>
  );
}