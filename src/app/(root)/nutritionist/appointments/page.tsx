"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  UserRound,
  Video,
  MapPin,
  CheckCircle2,
  MoreHorizontal,
  Users,
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

const appointments = [
  {
    id: 1,
    name: "Abebe Kebede",
    type: "Nutrition Consultation",
    date: "Monday, August 18",
    time: "10:00 AM",
    mode: "Online",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    type: "Follow-up Consultation",
    date: "Monday, August 18",
    time: "2:00 PM",
    mode: "Online",
    status: "Pending",
  },
  {
    id: 3,
    name: "Mekdes Tesfaye",
    type: "Nutrition Assessment",
    date: "Tuesday, August 19",
    time: "11:30 AM",
    mode: "In Person",
    status: "Confirmed",
  },
  {
    id: 4,
    name: "Daniel Solomon",
    type: "Follow-up Consultation",
    date: "Wednesday, August 20",
    time: "9:00 AM",
    mode: "Online",
    status: "Cancelled",
  },
];

export default function AppointmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <Link
          href="/nutritionist/dashboard"
          className="flex items-center"
        >
          <span className="font-display text-[27px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[33px] font-black leading-none text-[#DCC48E]">
            +
          </span>
        </Link>

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
          <Link
            href="/nutritionist/dashboard"
            className="flex items-center"
          >
            <span className="font-display text-[28px] font-bold tracking-tight text-[#DCC48E]">
              Megeb
            </span>

            <span className="ml-1 font-display text-[34px] font-black leading-none text-[#DCC48E]">
              +
            </span>
          </Link>

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

          <SidebarLink
            href="/nutritionist/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />

          <SidebarLink
            href="/nutritionist/clients"
            icon={<Users size={18} />}
            label="Clients"
          />

          <SidebarLink
            href="/nutritionist/appointments"
            icon={<CalendarDays size={18} />}
            label="Appointments"
            active
          />

          <SidebarLink
            href="/nutritionist/nutrition-plans"
            icon={<ClipboardList size={18} />}
            label="Nutrition Plans"
          />

          <SidebarLink
            href="/nutritionist/consultations"
            icon={<MessageSquare size={18} />}
            label="Consultations & Messages"
          />

          <div className="my-6 h-px bg-[#2D312E]/[0.07]" />

          <p className="mb-3 px-3 font-body text-[9px] font-bold uppercase tracking-[0.16em] text-[#2D312E]/35">
            Account
          </p>

          <SidebarLink
            href="/nutritionist/profile"
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

        {/* PAGE CONTENT */}
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* APPOINTMENTS HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="font-display text-[28px] text-[#2D312E]">
                Appointments
              </h1>

              <p className="font-body mt-1 text-[12px] text-[#2D312E]/45">
                Manage your upcoming and past consultations.
              </p>
            </div>

            <button
              type="button"
              className="flex w-fit items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[12px] font-semibold text-white transition hover:bg-[#2D312E]"
            >
              <CalendarDays size={18} />
              New Appointment
            </button>
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total"
              value="24"
              note="This month"
              icon={<CalendarDays size={20} />}
            />

            <SummaryCard
              label="Upcoming"
              value="8"
              note="Appointments"
              icon={<Clock size={20} />}
            />

            <SummaryCard
              label="Completed"
              value="14"
              note="This month"
              icon={<CheckCircle2 size={20} />}
            />

            <SummaryCard
              label="Pending"
              value="2"
              note="Need confirmation"
              icon={<Clock size={20} />}
            />
          </div>

          {/* APPOINTMENTS TABLE */}
          <div className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="border-b border-[#2D312E]/[0.06] px-6 py-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-display text-[20px] text-[#2D312E]">
                    Upcoming Appointments
                  </h2>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                    Your scheduled consultations.
                  </p>
                </div>

                <select className="rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-2 font-body text-[11px] text-[#2D312E]/60 outline-none focus:border-[#3D5A4C]">
                  <option>All appointments</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2D312E]/[0.06] bg-[#FAF9F6] text-left">
                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Client
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Date & Time
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Type
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Mode
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Status
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-[#2D312E]/[0.05] last:border-0 hover:bg-[#FAF9F6]/60"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                            <UserRound size={18} />
                          </div>

                          <div>
                            <p className="font-body text-[12px] font-bold text-[#2D312E]">
                              {appointment.name}
                            </p>

                            <p className="font-body text-[9px] text-[#2D312E]/35">
                              Client #
                              {appointment.id.toString().padStart(3, "0")}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-body text-[11px] font-semibold text-[#2D312E]/75">
                          {appointment.date}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-[#2D312E]/40">
                          <Clock size={12} />

                          <span className="font-body text-[9px]">
                            {appointment.time}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-body text-[11px] text-[#2D312E]/60">
                        {appointment.type}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 font-body text-[10px] text-[#2D312E]/60">
                          {appointment.mode === "Online" ? (
                            <Video size={15} />
                          ) : (
                            <MapPin size={15} />
                          )}

                          {appointment.mode}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={appointment.status} />
                      </td>

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-[#2D312E]/40 transition hover:bg-[#E9F0EC] hover:text-[#3D5A4C]"
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 p-4 md:hidden">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6]/50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                        <UserRound size={18} />
                      </div>

                      <div>
                        <p className="font-body text-[12px] font-bold text-[#2D312E]">
                          {appointment.name}
                        </p>

                        <p className="font-body text-[9px] text-[#2D312E]/35">
                          Client #
                          {appointment.id.toString().padStart(3, "0")}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-[#2D312E]/35"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-body text-[10px] text-[#2D312E]/60">
                      <CalendarDays size={15} />
                      {appointment.date}
                    </div>

                    <div className="flex items-center gap-2 font-body text-[10px] text-[#2D312E]/60">
                      <Clock size={15} />
                      {appointment.time}
                    </div>

                    <div className="flex items-center gap-2 font-body text-[10px] text-[#2D312E]/60">
                      {appointment.mode === "Online" ? (
                        <Video size={15} />
                      ) : (
                        <MapPin size={15} />
                      )}

                      {appointment.mode}
                    </div>

                    <p className="font-body text-[10px] text-[#2D312E]/60">
                      {appointment.type}
                    </p>

                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* SIDEBAR LINK */

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 font-body text-[12.5px] font-semibold transition ${
        active
          ? "bg-[#E9F0EC] text-[#3D5A4C]"
          : "text-[#2D312E]/50 hover:bg-[#FAF9F6] hover:text-[#3D5A4C]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* SUMMARY CARD */

function SummaryCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-body text-[11px] font-semibold text-[#2D312E]/45">
          {label}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
          {icon}
        </div>
      </div>

      <h2 className="font-display text-[27px] text-[#2D312E]">
        {value}
      </h2>

      <p className="font-body mt-1 text-[10px] text-[#4E876E]">
        {note}
      </p>
    </div>
  );
}

/* STATUS BADGE */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 font-body text-[9px] font-bold ${
        status === "Confirmed"
          ? "bg-[#E9F0EC] text-[#3D5A4C]"
          : status === "Pending"
            ? "bg-[#DCC48E]/20 text-[#8A6D32]"
            : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  );
}