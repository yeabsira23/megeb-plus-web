
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Search,
  UserRound,
  X,
} from "lucide-react";

import Link from "next/link";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import {
  getNutritionistAppointments,
  type Appointment as BackendAppointment,
  confirmAppointment,
  cancelAppointment,
} from "@/app/libs/api/appointments";

type AppointmentStatus =
  | "Confirmed"
  | "Pending"
  | "Completed"
  | "Cancelled";

type Appointment = {
  id: string;
  clientId: number;
  name: string;
  type: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  rawDate?: string;
  rawTime?: string;
};

function formatAppointmentType(type: string): string {
  switch (type) {
    case "consultation":
      return "Consultation";
    case "follow_up":
      return "Follow-up Consultation";
    case "nutrition_plan":
      return "Nutrition Plan";
    default:
      return type;
  }
}

function formatAppointmentDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAppointmentTime(time: string): string {
  const parsedTime = new Date(`1970-01-01T${time}`);

  if (Number.isNaN(parsedTime.getTime())) {
    return time;
  }

  return parsedTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAppointmentStatus(status: string): AppointmentStatus {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

// Helper function to sort appointments: upcoming first, then past
function sortAppointmentsByDateTime(
  appointments: Appointment[]
): Appointment[] {
  const now = new Date();

  return [...appointments].sort((a, b) => {
    const dateA = new Date(
      `${a.rawDate || a.date}T${a.rawTime || a.time}`
    );

    const dateB = new Date(
      `${b.rawDate || b.date}T${b.rawTime || b.time}`
    );

    const isAUpcoming = dateA >= now;
    const isBUpcoming = dateB >= now;

    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;

    if (isAUpcoming && isBUpcoming) {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
}

function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getNutritionistAppointments();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }

      const mappedAppointments: Appointment[] = data.map(
        (appointment: BackendAppointment) => ({
          id: String(appointment.id),
          clientId: appointment.client,
          name:
            appointment.client_name ||
            `Client #${appointment.client}`,
          type: formatAppointmentType(
            appointment.appointment_type
          ),
          date: formatAppointmentDate(appointment.date),
          time: formatAppointmentTime(appointment.time),
          status: formatAppointmentStatus(appointment.status),
          rawDate: appointment.date,
          rawTime: appointment.time,
        })
      );

      const sortedAppointments =
        sortAppointmentsByDateTime(mappedAppointments);

      setAppointments(sortedAppointments);
    } catch (err) {
      console.error("Unable to load appointments:", err);
      setError("Unable to load appointments. Please try again.");
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return {
    appointments,
    isLoading,
    error,
    loadAppointments,
  };
}

export default function AppointmentsPage() {
  const {
    appointments,
    isLoading,
    error,
    loadAppointments,
  } = useAppointments();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All appointments");
  const [openActionId, setOpenActionId] = useState<string | null>(
    null
  );
  const [actionLoadingId, setActionLoadingId] = useState<
    string | null
  >(null);
  const [actionError, setActionError] = useState<string | null>(
    null
  );

  const [successPopup, setSuccessPopup] = useState<{
    show: boolean;
    message: string;
    type: "confirm" | "cancel";
  }>({
    show: false,
    message: "",
    type: "confirm",
  });

  // Filter appointments
  const filteredAppointments = appointments.filter(
    (appointment) => {
      const searchText = query.toLowerCase().trim();

      const matchesSearch =
        appointment.name
          .toLowerCase()
          .includes(searchText) ||
        appointment.type
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All appointments" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // Summary numbers
  const totalAppointments = appointments.length;

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Confirmed" ||
      appointment.status === "Pending"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  // Handle appointment actions
  async function handleAppointmentAction(
    appointmentId: string,
    action: "confirm" | "cancel"
  ) {
    setActionLoadingId(appointmentId);
    setActionError(null);

    try {
      if (action === "confirm") {
        await confirmAppointment(Number(appointmentId));

        setSuccessPopup({
          show: true,
          message: "Appointment confirmed successfully!",
          type: "confirm",
        });
      } else {
        await cancelAppointment(Number(appointmentId));

        setSuccessPopup({
          show: true,
          message: "Appointment cancelled successfully.",
          type: "cancel",
        });
      }

      await loadAppointments();
      setOpenActionId(null);

      setTimeout(() => {
        setSuccessPopup({
          show: false,
          message: "",
          type: "confirm",
        });
      }, 5000);
    } catch (err) {
      console.error("Unable to update appointment:", err);

      let errorMessage =
        "Unable to update the appointment. Please try again.";

      if (err && typeof err === "object") {
        const errorObj = err as {
          response?: {
            data?: {
              detail?: string;
              message?: string;
            };
          };
          message?: string;
        };

        if (errorObj.response?.data?.detail) {
          errorMessage = errorObj.response.data.detail;
        } else if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      }

      setActionError(errorMessage);
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* ================= SUCCESS POPUP ================= */}
      {successPopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() =>
              setSuccessPopup({
                show: false,
                message: "",
                type: "confirm",
              })
            }
          />

          {/* Modal */}
          <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-300">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Decorative gradient bar */}
              <div
                className={`h-1.5 w-full ${
                  successPopup.type === "confirm"
                    ? "bg-gradient-to-r from-[#3D5A4C] to-[#4E876E]"
                    : "bg-gradient-to-r from-amber-400 to-amber-600"
                }`}
              />

              <div className="p-6">
                {/* Close button */}
                <button
                  onClick={() =>
                    setSuccessPopup({
                      show: false,
                      message: "",
                      type: "confirm",
                    })
                  }
                  className="absolute right-4 top-4 rounded-full p-1.5 text-[#2D312E]/40 transition hover:bg-[#FAF9F6] hover:text-[#2D312E]"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                      successPopup.type === "confirm"
                        ? "bg-[#E9F0EC] text-[#3D5A4C]"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {successPopup.type === "confirm" ? (
                      <CheckCircle2
                        size={32}
                        strokeWidth={1.5}
                      />
                    ) : (
                      <X size={32} strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-semibold text-[#2D312E]">
                    {successPopup.type === "confirm"
                      ? "Success!"
                      : "Cancelled"}
                  </h3>

                  {/* Message */}
                  <p className="mt-2 font-body text-[13px] text-[#2D312E]/60">
                    {successPopup.message}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() =>
                      setSuccessPopup({
                        show: false,
                        message: "",
                        type: "confirm",
                      })
                    }
                    className={`mt-6 w-full rounded-xl px-6 py-3 font-body text-[12px] font-semibold text-white transition hover:shadow-md ${
                      successPopup.type === "confirm"
                        ? "bg-[#3D5A4C] hover:bg-[#2D312E]"
                        : "bg-amber-500 hover:bg-amber-600"
                    }`}
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE HEADER ================= */}
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
          aria-label="Open menu"
        >
          <MoreHorizontal size={22} />
        </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* ================= PAGE HEADER ================= */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="font-display text-[28px] text-[#2D312E]">
                Appointments
              </h1>

              <p className="font-body mt-1 text-[12px] text-[#2D312E]/45">
                Manage your upcoming and past consultations.
              </p>
            </div>

            {/* ================= HEADER ACTIONS ================= */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/nutritionist/appointments/availability"
                className="flex w-fit items-center gap-2 rounded-xl border border-[#2D312E]/[0.08] bg-white px-5 py-3 font-body text-[12px] font-semibold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
              >
                <Clock size={17} />
                Availability
              </Link>

              <Link
                href="/nutritionist/appointments/new"
                className="flex w-fit items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[12px] font-semibold text-white transition hover:bg-[#2D312E]"
              >
                <CalendarDays size={18} />
                New Appointment
              </Link>
            </div>
          </div>

          {/* ================= SUMMARY CARDS ================= */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total"
              value={totalAppointments.toString()}
              note="This month"
              icon={<CalendarDays size={20} />}
            />

            <SummaryCard
              label="Upcoming"
              value={upcomingAppointments.toString()}
              note="Appointments"
              icon={<Clock size={20} />}
            />

            <SummaryCard
              label="Completed"
              value={completedAppointments.toString()}
              note="This month"
              icon={<CheckCircle2 size={20} />}
            />

            <SummaryCard
              label="Pending"
              value={pendingAppointments.toString()}
              note="Need confirmation"
              icon={<Clock size={20} />}
            />
          </div>

          {/* ================= APPOINTMENTS ================= */}
          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            {/* Section Header */}
            <div className="border-b border-[#2D312E]/[0.06] px-6 py-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-display text-[20px] text-[#2D312E]">
                    Upcoming Appointments
                  </h2>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                    Your scheduled online consultations.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D312E]/30"
                    />

                    <input
                      type="text"
                      value={query}
                      onChange={(e) =>
                        setQuery(e.target.value)
                      }
                      placeholder="Search appointments"
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-2 pl-9 pr-3 font-body text-[11px] text-[#2D312E] outline-none focus:border-[#3D5A4C] sm:w-52"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-2 font-body text-[11px] text-[#2D312E]/60 outline-none focus:border-[#3D5A4C]"
                  >
                    <option>All appointments</option>
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ================= ERROR ================= */}
            {(error || actionError) && (
              <div className="px-6 py-4">
                <p className="font-body text-[12px] font-medium text-red-600">
                  {error || actionError}
                </p>
              </div>
            )}

            {/* ================= DESKTOP TABLE ================= */}
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
                      Status
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center font-body text-[12px] text-[#2D312E]/40"
                      >
                        Loading appointments…
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center font-body text-[12px] text-[#2D312E]/40"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appointment) => (
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
                                Client #{appointment.clientId}
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

                        <td className="px-6 py-5">
                          <span className="font-body text-[11px] text-[#2D312E]/60">
                            {appointment.type}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge
                            status={appointment.status}
                          />
                        </td>

                        <td className="px-6 py-5">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenActionId(
                                  openActionId === appointment.id
                                    ? null
                                    : appointment.id
                                )
                              }
                              className="rounded-lg p-2 text-[#2D312E]/40 transition hover:bg-[#E9F0EC] hover:text-[#3D5A4C]"
                              aria-label="Appointment actions"
                            >
                              <MoreHorizontal size={19} />
                            </button>

                            {openActionId === appointment.id && (
                              <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-[#2D312E]/[0.08] bg-white py-1 shadow-lg">
                                {appointment.status ===
                                  "Pending" && (
                                  <button
                                    type="button"
                                    disabled={
                                      actionLoadingId ===
                                      appointment.id
                                    }
                                    onClick={() =>
                                      handleAppointmentAction(
                                        appointment.id,
                                        "confirm"
                                      )
                                    }
                                    className="w-full px-4 py-2.5 text-left font-body text-[11px] text-[#3D5A4C] hover:bg-[#E9F0EC] disabled:opacity-50"
                                  >
                                    {actionLoadingId ===
                                    appointment.id
                                      ? "Updating..."
                                      : "Confirm"}
                                  </button>
                                )}

                                {(appointment.status ===
                                  "Pending" ||
                                  appointment.status ===
                                    "Confirmed") && (
                                  <button
                                    type="button"
                                    disabled={
                                      actionLoadingId ===
                                      appointment.id
                                    }
                                    onClick={() =>
                                      handleAppointmentAction(
                                        appointment.id,
                                        "cancel"
                                      )
                                    }
                                    className="w-full px-4 py-2.5 text-left font-body text-[11px] text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    {actionLoadingId ===
                                    appointment.id
                                      ? "Updating..."
                                      : "Cancel"}
                                  </button>
                                )}

                                {(appointment.status ===
                                  "Completed" ||
                                  appointment.status ===
                                    "Cancelled") && (
                                  <p className="px-4 py-2.5 font-body text-[11px] text-[#2D312E]/40">
                                    No actions available
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="space-y-4 p-4 md:hidden">
              {isLoading ? (
                <p className="py-8 text-center font-body text-[12px] text-[#2D312E]/40">
                  Loading appointments…
                </p>
              ) : filteredAppointments.length === 0 ? (
                <p className="py-8 text-center font-body text-[12px] text-[#2D312E]/40">
                  No appointments found.
                </p>
              ) : (
                filteredAppointments.map((appointment) => (
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
                            Client #{appointment.clientId}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="rounded-lg p-1 text-[#2D312E]/35 hover:bg-[#E9F0EC]"
                        aria-label="Appointment actions"
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

                      <div>
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-[#2D312E]/35">
                          Type
                        </p>

                        <p className="mt-1 font-body text-[10px] text-[#2D312E]/60">
                          {appointment.type}
                        </p>
                      </div>

                      <StatusBadge
                        status={appointment.status}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ================= SUMMARY CARD ================= */

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

/* ================= STATUS BADGE ================= */

function StatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 font-body text-[9px] font-bold ${
        status === "Confirmed"
          ? "bg-[#E9F0EC] text-[#3D5A4C]"
          : status === "Pending"
          ? "bg-[#DCC48E]/20 text-[#8A6D32]"
          : status === "Completed"
          ? "bg-[#DDE8E0] text-[#315B45]"
          : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  );
}

