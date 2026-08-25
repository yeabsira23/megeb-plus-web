"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Menu,
  MessageSquare,
  UserRound,
  Video,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type Client = {
  id: string;
  name: string;
  age: number;
};

const TEMPORARY_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Hana Tesfaye",
    age: 28,
  },
  {
    id: "2",
    name: "Selam Alemu",
    age: 34,
  },
  {
    id: "3",
    name: "Meron Kebede",
    age: 25,
  },
  {
    id: "4",
    name: "Liya Michael",
    age: 31,
  },
];

const APPOINTMENT_TYPES = [
  "Initial Consultation",
  "Follow-up Consultation",
  "Nutrition Assessment",
  "Online Consultation",
];

export default function NewAppointmentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [clientId, setClientId] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedClient = TEMPORARY_CLIENTS.find(
    (client) => client.id === clientId
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccess(false);

    /*
     * TEMPORARY
     *
     * Later, this will send the appointment to the backend.
     *
     * Example:
     *
     * await apiFetch("/nutritionist/appointments", {
     *   method: "POST",
     *   body: JSON.stringify({
     *     client: clientId,
     *     type: appointmentType,
     *     date,
     *     time,
     *     mode: "Online",
     *     notes,
     *   }),
     * });
     */

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* ========================================= */}
      {/* MOBILE HEADER */}
      {/* ========================================= */}

      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <Link href="/nutritionist/dashboard">
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

      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ========================================= */}
      {/* MAIN */}
      {/* ========================================= */}

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-4xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* ========================================= */}
          {/* BACK */}
          {/* ========================================= */}

          <Link
            href="/nutritionist/appointments"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Appointments
          </Link>

          {/* ========================================= */}
          {/* HEADER */}
          {/* ========================================= */}

          <div className="mb-7">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <CalendarDays size={21} />
            </div>

            <h1 className="font-display text-[30px] text-[#2D312E]">
              New Appointment
            </h1>

            <p className="font-body mt-2 text-[12px] text-[#2D312E]/45">
              Schedule a consultation with one of your clients.
            </p>
          </div>

          {/* ========================================= */}
          {/* SUCCESS MESSAGE */}
          {/* ========================================= */}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#CCD6C4] bg-[#E9F0EC] p-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#3D5A4C] text-white">
                <Check size={15} />
              </div>

              <div>
                <p className="font-body text-[11px] font-bold text-[#3D5A4C]">
                  Appointment scheduled successfully
                </p>

                <p className="font-body mt-1 text-[10px] text-[#3D5A4C]/60">
                  This is currently a mock appointment. It will be connected
                  to the backend later.
                </p>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* FORM */}
          {/* ========================================= */}

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm"
          >
            {/* ========================================= */}
            {/* CLIENT */}
            {/* ========================================= */}

            <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <UserRound size={17} />
                </div>

                <div>
                  <h2 className="font-display text-[19px]">
                    Client Information
                  </h2>

                  <p className="font-body text-[10px] text-[#2D312E]/40">
                    Select the client for this appointment.
                  </p>
                </div>
              </div>

              <label className="block">
                <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                  Client
                </span>

                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                >
                  <option value="">Select a client</option>

                  {TEMPORARY_CLIENTS.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} — {client.age} years old
                    </option>
                  ))}
                </select>
              </label>

              {selectedClient && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#E9F0EC]/60 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#3D5A4C]">
                    <UserRound size={15} />
                  </div>

                  <div>
                    <p className="font-body text-[10px] font-bold text-[#3D5A4C]">
                      {selectedClient.name}
                    </p>

                    <p className="font-body mt-0.5 text-[9px] text-[#3D5A4C]/50">
                      Client #{selectedClient.id}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================= */}
            {/* APPOINTMENT DETAILS */}
            {/* ========================================= */}

            <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Clock size={17} />
                </div>

                <div>
                  <h2 className="font-display text-[19px]">
                    Appointment Details
                  </h2>

                  <p className="font-body text-[10px] text-[#2D312E]/40">
                    Choose when and why the consultation will take place.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Type */}

                <label className="block sm:col-span-2">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Appointment Type
                  </span>

                  <select
                    required
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                  >
                    <option value="">Select appointment type</option>

                    {APPOINTMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Date */}

                <label className="block">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Date
                  </span>

                  <div className="relative mt-2">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
                    />

                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-4 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </div>
                </label>

                {/* Time */}

                <label className="block">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Time
                  </span>

                  <div className="relative mt-2">
                    <Clock
                      size={15}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
                    />

                    <input
                      required
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-4 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* ========================================= */}
            {/* CONSULTATION MODE */}
            {/* ========================================= */}

            <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="font-display text-[19px]">
                  Consultation Mode
                </h2>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  Appointments are conducted online through video consultation.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#4E876E] bg-[#E9F0EC] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#3D5A4C]">
                  <Video size={17} />
                </div>

                <div className="flex-1">
                  <p className="font-body text-[11px] font-bold text-[#2D312E]">
                    Online
                  </p>

                  <p className="mt-0.5 font-body text-[9px] text-[#2D312E]/40">
                    Video consultation
                  </p>
                </div>

                <Check size={16} className="text-[#4E876E]" />
              </div>
            </div>

            {/* ========================================= */}
            {/* NOTES */}
            {/* ========================================= */}

            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <MessageSquare size={17} />
                </div>

                <div>
                  <h2 className="font-display text-[19px]">
                    Notes
                  </h2>

                  <p className="font-body text-[10px] text-[#2D312E]/40">
                    Add any additional information about this appointment.
                  </p>
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write appointment notes..."
                rows={5}
                className="w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
              />

              {/* ========================================= */}
              {/* ACTIONS */}
              {/* ========================================= */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/nutritionist/appointments"
                  className="flex items-center justify-center rounded-xl border border-[#CCD6C4] px-6 py-3 font-body text-[11px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 font-body text-[11px] font-bold text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CalendarDays size={15} />

                  {isSubmitting
                    ? "Scheduling..."
                    : "Schedule Appointment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}