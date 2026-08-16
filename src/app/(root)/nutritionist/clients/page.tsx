"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Menu,
  MessageSquare,
  Search,
  UserRound,
  Users,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const clients = [
  {
    name: "Hana Tesfaye",
    age: 28,
    goal: "Weight Management",
    lastAppointment: "Today",
    status: "Active",
  },
  {
    name: "Selam Alemu",
    age: 34,
    goal: "Diabetes Nutrition",
    lastAppointment: "Yesterday",
    status: "Active",
  },
  {
    name: "Meron Kebede",
    age: 25,
    goal: "Healthy Lifestyle",
    lastAppointment: "Aug 11",
    status: "Active",
  },
  {
    name: "Liya Michael",
    age: 31,
    goal: "Nutrition Consultation",
    lastAppointment: "Aug 10",
    status: "Active",
  },
  {
    name: "Mimi Yohannes",
    age: 29,
    goal: "Weight Management",
    lastAppointment: "Aug 8",
    status: "Active",
  },
  {
    name: "Rahel Tadesse",
    age: 37,
    goal: "Healthy Lifestyle",
    lastAppointment: "Aug 6",
    status: "Active",
  },
];

export default function ClientsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Mobile Overlay */}
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
          <Link href="/nutritionist/dashboard" className="flex items-center">
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

          {/* Dashboard */}
          <SidebarLink
            href="/nutritionist/dashboard"
            icon={<Users size={18} />}
            label="Dashboard"
          />

          {/* Clients */}
          <SidebarLink
            href="/nutritionist/clients"
            icon={<Users size={18} />}
            label="Clients"
            active
          />

          {/* Appointments */}
          <SidebarLink
            href="/nutritionist/appointments"
            icon={<CalendarDays size={18} />}
            label="Appointments"
          />

          {/* Nutrition Plans */}
          <SidebarLink
            href="/nutritionist/nutrition-plans"
            icon={<Users size={18} />}
            label="Nutrition Plans"
          />

          {/* Consultations */}
          <SidebarLink
            href="/nutritionist/consultations"
            icon={<MessageSquare size={18} />}
            label="Consultations & Messages"
          />

          <div className="my-6 h-px bg-[#2D312E]/[0.07]" />

          <p className="mb-3 px-3 font-body text-[9px] font-bold uppercase tracking-[0.16em] text-[#2D312E]/35">
            Account
          </p>

          {/* Profile */}
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

          <div className="flex items-center gap-3">
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
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Page Header */}
          <div className="mb-7">
           

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Users size={21} />
                </div>

                <h1 className="font-display text-[30px] text-[#2D312E]">
                  Clients
                </h1>

                <p className="font-body mt-2 text-[12px] text-[#2D312E]/45">
                  Manage and view your clients and their nutrition progress.
                </p>
              </div>

              <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
                <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-[#2D312E]/40">
                  Total Clients
                </p>

                <p className="font-display mt-1 text-[24px] text-[#3D5A4C]">
                  {clients.length}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-4 font-body text-[12px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/40 focus:ring-2 focus:ring-[#4E876E]/10"
              />
            </div>
          </section>

          {/* Client List */}
          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
              <h2 className="font-display text-[20px] text-[#2D312E]">
                All Clients
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                {filteredClients.length} client
                {filteredClients.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredClients.length > 0 ? (
              <div className="divide-y divide-[#2D312E]/[0.06]">
                {filteredClients.map((client) => (
                  <ClientRow key={client.name} client={client} />
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                  <Users size={21} />
                </div>

                <h3 className="font-display mt-4 text-[18px] text-[#2D312E]">
                  No clients found
                </h3>

                <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                  Try searching for a different name.
                </p>
              </div>
            )}
          </section>
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

/* CLIENT ROW */

function ClientRow({
  client,
}: {
  client: {
    name: string;
    age: number;
    goal: string;
    lastAppointment: string;
    status: string;
  };
}) {
  return (
    <div className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FAF9F6]/70 sm:flex-row sm:items-center sm:px-6">
      {/* Client */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
          <UserRound size={19} />
        </div>

        <div className="min-w-0">
          <p className="truncate font-body text-[12.5px] font-bold text-[#2D312E]">
            {client.name}
          </p>

          <p className="mt-1 font-body text-[10px] text-[#2D312E]/40">
            {client.age} years old
          </p>
        </div>
      </div>

      {/* Goal */}
      <div className="sm:w-[180px]">
        <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
          Nutrition Goal
        </p>

        <p className="mt-1 font-body text-[11px] text-[#2D312E]/65">
          {client.goal}
        </p>
      </div>

      {/* Last Appointment */}
      <div className="sm:w-[140px]">
        <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
          Last Appointment
        </p>

        <div className="mt-1 flex items-center gap-1.5">
          <CalendarDays size={12} className="text-[#4E876E]" />

          <p className="font-body text-[11px] text-[#2D312E]/65">
            {client.lastAppointment}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="sm:w-[90px]">
        <span className="inline-flex rounded-full bg-[#E9F0EC] px-2.5 py-1 font-body text-[9px] font-bold text-[#3D5A4C]">
          {client.status}
        </span>
      </div>

      {/* Action */}
      <Link
        href="/nutritionist/clients"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#4E876E] transition hover:bg-[#E9F0EC]"
        aria-label={`View ${client.name}`}
      >
        <ChevronRight size={17} />
      </Link>
    </div>
  );
}