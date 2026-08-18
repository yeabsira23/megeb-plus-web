"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Menu,
  MessageSquare,
  Users,
  ChevronRight,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import StatCard from "@/app/components/nutritionist/StatCard";
import Appointment from "@/app/components/nutritionist/Appointment";
import UpcomingAppointment from "@/app/components/nutritionist/UpcomingAppointment";
import ClientCard from "@/app/components/nutritionist/ClientCard";

export default function NutritionistDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
<div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
  <Link
    href="/nutritionist/dashboard"
    className="flex items-center"
  >
    <div className="rounded-full border border-[#CCD6C4] bg-[#E9F0EC] px-4 py-1.5">
      <span className="font-display text-xl font-bold text-[#3D5A4C]">
        Megeb<span className="text-[#4E876E]">+</span>
      </span>
    </div>
  </Link>

  <button
    type="button"
    onClick={() => setSidebarOpen(true)}
    className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
    aria-label="Open menu"
  >
    <Menu size={22} />
  </button>
</div>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-[250px]">
        {/*  Topbar */}
        <Topbar />

        {/* Dashboard Content */}
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">

          {/* Welcome Section */}
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

          {/* Main Dashboard Grid */}
          <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">

            {/* Today's Appointments */}
            <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-[0_15px_35px_-18px_rgba(45,49,46,0.2)]">
              <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-display text-[20px] text-[#2D312E]">
                    Today&apos;s Appointments
                  </h2>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                    Monday, August 18
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

              {/* Upcoming Appointments */}
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
                    day="Tuesday"
                    time="11:00 AM"
                    client="Rahel Tadesse"
                  />

                  <UpcomingAppointment
                    day="Tuesday"
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

                    <Link
                      href="/nutritionist/nutrition-plans"
                      className="font-body mt-3 inline-block text-[11px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
                    >
                      Review tasks →
                    </Link>
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

              <Link
                href="/nutritionist/clients"
                className="font-body inline-flex items-center gap-1 text-[11px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
              >
                View clients
                <ChevronRight size={14} />
              </Link>
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