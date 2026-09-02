"use client";

import { useEffect, useState } from "react";
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

import { getMe} from "@/app/libs/api/auth";
import {
  createAppointment,
  getNutritionistAppointments,
  type Appointment,
} from "@/app/libs/api/appointments";

type AppointmentType =
  | "consultation"
  | "follow_up"
  | "nutrition_plan";

type Client = {
  id: number;
  name: string;
};

const APPOINTMENT_TYPES = [
  {
    label: "Consultation",
    value: "consultation",
  },
  {
    label: "Follow-up",
    value: "follow_up",
  },
  {
    label: "Nutrition Plan",
    value: "nutrition_plan",
  },
];

export default function NewAppointmentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [nutritionistId, setNutritionistId] = useState<number | null>(null);

  const [clientId, setClientId] = useState("");
  const [appointmentType, setAppointmentType] =
  useState<AppointmentType | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load the authenticated nutritionist and their existing appointments.
   *
   * /api/auth/me/ gives us the nutritionist ID.
   * /api/appointments/nutritionist/ gives us client IDs/names.
   */
  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      setIsLoading(true);
      setError("");

      try {
        const [user, appointments] = await Promise.all([
          getMe(),
          getNutritionistAppointments(),
        ]);

        if (!isMounted) return;

        /*
         * The backend returns:
         *
         * {
         *   "id": 38,
         *   "role": "nutritionist",
         *   ...
         * }
         */
        if (!user.id) {
          throw new Error("Nutritionist ID was not returned.");
        }

        setNutritionistId(Number(user.id));

        /*
         * Build a unique client list from the nutritionist's appointments.
         * 
         * FIX: Check if appointments is an array before iterating
         */
        if (Array.isArray(appointments)) {
          const clientsMap = new Map<number, Client>();

          appointments.forEach((appointment: Appointment) => {
            if (!clientsMap.has(appointment.client)) {
              clientsMap.set(appointment.client, {
                id: appointment.client,
                name: appointment.client_name || `Client #${appointment.client}`,
              });
            }
          });

          setClients(Array.from(clientsMap.values()));
        } else {
          // If appointments is not an array, set clients to empty array
          setClients([]);
        }
      } catch (err) {
        console.error("Unable to load appointment data:", err);

        if (isMounted) {
          setError("Unable to load your clients. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedClient = clients.find(
    (client) => String(client.id) === clientId
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!nutritionistId) {
      setError("Unable to identify the nutritionist. Please try again.");
      return;
    }

    if (!clientId) {
      setError("Please select a client.");
      return;
    }

    if (!appointmentType) {
      setError("Please select an appointment type.");
      return;
    }

    if (!date || !time) {
      setError("Please select a date and time.");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * HTML <input type="time"> normally gives us:
       *
       * 11:00
       *
       * The backend expects:
       *
       * 11:00:00
       */
      const formattedTime =
        time.length === 5 ? `${time}:00` : time;

      // FIX: Ensure all required fields are properly formatted
      const appointmentData = {
        nutritionist: nutritionistId,
        client: Number(clientId),
        appointment_type: appointmentType,
        date: date,
        time: formattedTime,
        mode: "online" as const,
        notes: notes || undefined, // Only include notes if not empty
      };

      const appointment = await createAppointment(appointmentData);

      console.log(
        "APPOINTMENT CREATED:",
        appointment
      );

      setSuccess(true);

      /*
       * Clear the form after successful creation.
       */
      setClientId("");
      setAppointmentType("");
      setDate("");
      setTime("");
      setNotes("");
    } catch (err) {
      console.error(
        "Unable to create appointment:",
        err
      );

      /*
       * Try to show the backend's error message when available.
       */
      let errorMessage = "Unable to schedule the appointment. Please try again.";
      
      // FIX: Improved error handling for different error structures
      if (err && typeof err === 'object') {
        // Check for response data with detail
        const errorObj = err as {
          response?: {
            data?: {
              detail?: string;
              message?: string;
              error?: string;
            };
          };
          message?: string;
        };
        
        if (errorObj.response?.data?.detail) {
          errorMessage = errorObj.response.data.detail;
        } else if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
                  The appointment has been created successfully.
                </p>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* ERROR MESSAGE */}
          {/* ========================================= */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="font-body text-[11px] font-semibold text-red-600">
                {error}
              </p>
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
                  disabled={isLoading || clients.length === 0}
                  className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {isLoading
                      ? "Loading clients..."
                      : clients.length === 0
                        ? "No clients available"
                        : "Select a client"}
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
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
                    onChange={(e) =>
                      setAppointmentType(e.target.value as AppointmentType)
                    }
                    className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                  >
                    <option value="">
                      Select appointment type
                    </option>

                    {APPOINTMENT_TYPES.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
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
                      onChange={(e) =>
                        setDate(e.target.value)
                      }
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
                      onChange={(e) =>
                        setTime(e.target.value)
                      }
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
                onChange={(e) =>
                  setNotes(e.target.value)
                }
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
                  disabled={
                    isSubmitting ||
                    isLoading ||
                    clients.length === 0
                  }
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