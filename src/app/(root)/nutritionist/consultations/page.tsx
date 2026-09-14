"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MessageCircle,
  Search,
  UserRound,
  Video,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

type Client = {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  profile_picture?: string | null;
  is_verified?: boolean;
  preferences?: string[];
  allergies?: string[];
  nutrition_plans?: {
    id: number;
    plan_name: string;
    status: string;
    start_date: string;
    end_date: string;
  }[];
};

type Appointment = {
  id: number;
  nutritionist: number;
  nutritionist_name?: string;
  client: number;
  client_name?: string;
  appointment_type:
    | "consultation"
    | "follow_up"
    | "nutrition_plan";
  date: string;
  time: string;
  mode: "online" | string;
  status: "pending" | "confirmed" | "cancelled" | string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

type Message = {
  id: number;
  sender: "nutritionist" | "client";
  text: string;
  time: string;
};

/*
 * The backend currently provides the client list and the
 * nutritionist appointment list separately.
 *
 * There is no:
 *
 * GET /api/nutritionist/clients/<id>/
 *
 * so we intentionally do NOT call that endpoint.
 */

function formatConsultationDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);

  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAppointmentTime(time: string): string {
  const [hoursString, minutesString] = time.split(":");

  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDurationInMinutes(
  startTime: string,
  endTime?: string
): number {
  if (!endTime) {
    return 30;
  }

  const parseTime = (time: string) => {
    const [timePart, modifier] = time.split(" ");

    let [hours, minutes] = timePart
      .split(":")
      .map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  let start = parseTime(startTime);
  let end = parseTime(endTime);

  if (end < start) {
    end += 24 * 60;
  }

  return end - start;
}

function formatLastMessageTime(
  appointment?: Appointment
): string {
  if (!appointment) {
    return "No consultation";
  }

  return formatAppointmentTime(appointment.time);
}

function ConsultationsContent() {
  const { data: session, status: sessionStatus } =
    useSession();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [selectedClientId, setSelectedClientId] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] =
    useState<Record<number, Message[]>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Load real clients and real appointments.
   */
  useEffect(() => {
    async function loadData() {
      if (sessionStatus === "loading") {
        return;
      }

      if (!session?.accessToken) {
        setLoading(false);
        setError("Authentication session not found.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${session.accessToken}`,
        };

        const [clientsResponse, appointmentsResponse] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/api/nutritionist/clients/`,
              {
                method: "GET",
                headers,
              }
            ),

            fetch(
              `${API_BASE_URL}/api/appointments/nutritionist/`,
              {
                method: "GET",
                headers,
              }
            ),
          ]);

        if (!clientsResponse.ok) {
          const text = await clientsResponse.text();

          throw new Error(
            text ||
              `Failed to load clients (${clientsResponse.status}).`
          );
        }

        if (!appointmentsResponse.ok) {
          const text = await appointmentsResponse.text();

          throw new Error(
            text ||
              `Failed to load appointments (${appointmentsResponse.status}).`
          );
        }

        const clientsData =
          (await clientsResponse.json()) as Client[];

        const appointmentsData =
          (await appointmentsResponse.json()) as Appointment[];

        setClients(
          Array.isArray(clientsData)
            ? clientsData
            : []
        );

        setAppointments(
          Array.isArray(appointmentsData)
            ? appointmentsData
            : []
        );

        /*
         * Select the first client that actually has an
         * online consultation appointment.
         */
        const firstClientWithAppointment =
          clientsData.find((client) =>
            appointmentsData.some(
              (appointment) =>
                appointment.client === client.id &&
                appointment.mode === "online" &&
                appointment.status !== "cancelled"
            )
          );

        if (firstClientWithAppointment) {
          setSelectedClientId(
            firstClientWithAppointment.id
          );
        } else if (clientsData.length > 0) {
          setSelectedClientId(clientsData[0].id);
        }
      } catch (err) {
        console.error(
          "Failed to load consultations:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load consultations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session?.accessToken, sessionStatus]);

  /*
   * Client selected from the real API.
   */
  const selectedClient = useMemo(() => {
    if (clients.length === 0) {
      return null;
    }

    return (
      clients.find(
        (client) => client.id === selectedClientId
      ) ?? clients[0]
    );
  }, [clients, selectedClientId]);

  /*
   * All appointments belonging to the selected client.
   */
  const selectedClientAppointments = useMemo(() => {
    if (!selectedClient) {
      return [];
    }

    return appointments
      .filter(
        (appointment) =>
          appointment.client === selectedClient.id
      )
      .sort((a, b) => {
        const first = new Date(
          `${a.date}T${a.time}`
        ).getTime();

        const second = new Date(
          `${b.date}T${b.time}`
        ).getTime();

        return second - first;
      });
  }, [appointments, selectedClient]);

  /*
   * Prefer a confirmed online appointment.
   *
   * If there is no confirmed appointment, use the most
   * recent non-cancelled online appointment.
   */
  const selectedConsultation = useMemo(() => {
    const onlineAppointments =
      selectedClientAppointments.filter(
        (appointment) =>
          appointment.mode === "online" &&
          appointment.status !== "cancelled"
      );

    return (
      onlineAppointments.find(
        (appointment) =>
          appointment.status === "confirmed"
      ) ??
      onlineAppointments[0] ??
      null
    );
  }, [selectedClientAppointments]);

  /*
   * Search clients from the real API.
   */
  const filteredClients = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter(
      (client) =>
        client.full_name
          .toLowerCase()
          .includes(query) ||
        client.email
          .toLowerCase()
          .includes(query)
    );
  }, [clients, search]);

  /*
   * Find the next upcoming non-cancelled online appointment.
   */
  const nextConsultation = useMemo(() => {
    const now = new Date();

    return (
      appointments
        .filter(
          (appointment) =>
            appointment.mode === "online" &&
            appointment.status !== "cancelled"
        )
        .filter((appointment) => {
          const appointmentDate = new Date(
            `${appointment.date}T${appointment.time}`
          );

          return appointmentDate >= now;
        })
        .sort((a, b) => {
          const first = new Date(
            `${a.date}T${a.time}`
          ).getTime();

          const second = new Date(
            `${b.date}T${b.time}`
          ).getTime();

          return first - second;
        })[0] ?? null
    );
  }, [appointments]);

  const nextConsultationClient = useMemo(() => {
    if (!nextConsultation) {
      return null;
    }

    return (
      clients.find(
        (client) =>
          client.id === nextConsultation.client
      ) ?? null
    );
  }, [clients, nextConsultation]);

  const activeClients = useMemo(() => {
    const clientIds = new Set(
      appointments
        .filter(
          (appointment) =>
            appointment.status !== "cancelled"
        )
        .map((appointment) => appointment.client)
    );

    return clients.filter((client) =>
      clientIds.has(client.id)
    ).length;
  }, [clients, appointments]);

  /*
   * The backend appointment response does not currently
   * provide an end_time/duration field.
   *
   * We therefore use the existing UI's 30-minute default.
   */
  const duration = 30;

  function getInitials(name: string) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function handleSendMessage(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!selectedClient) {
      return;
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      sender: "nutritionist",
      text: trimmedMessage,
      time: "Just now",
    };

    setMessages((currentMessages) => ({
      ...currentMessages,

      [selectedClient.id]: [
        ...(currentMessages[selectedClient.id] ??
          []),
        newMessage,
      ],
    }));

    setMessage("");
  }

  if (sessionStatus === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-body text-[11px] text-[#2D312E]/40">
            Loading consultations...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <h1 className="font-display text-[20px] text-[#2D312E]">
              Unable to load consultations
            </h1>

            <p className="font-body mt-2 text-[11px] leading-5 text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-xl bg-[#3D5A4C] px-4 py-2.5 font-body text-[10px] font-bold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <Link href="/nutritionist/dashboard">
          <div className="rounded-full border border-[#CCD6C4] bg-[#E9F0EC] px-4 py-1.5">
            <span className="font-display text-xl font-bold text-[#3D5A4C]">
              Megeb
              <span className="text-[#4E876E]">
                +
              </span>
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
          aria-label="Open menu"
        >
          <span className="text-lg">☰</span>
        </button>
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Page Header */}
          <div className="mb-7">
            <Link
              href="/nutritionist/dashboard"
              className="mb-5 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </Link>

            <h1 className="font-display text-[28px] text-[#2D312E]">
              Consultations
            </h1>

            <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
              Manage your consultations and communicate
              with your clients.
            </p>
          </div>

          {/* Consultation Summary */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {/* Next Consultation */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="font-body text-[9px] font-semibold uppercase tracking-wide text-[#2D312E]/35">
                    Next Consultation
                  </p>

                  {nextConsultation ? (
                    <>
                      <p className="font-display mt-1 text-[15px]">
                        {formatConsultationDate(
                          nextConsultation.date
                        )}
                        ,{" "}
                        {formatAppointmentTime(
                          nextConsultation.time
                        )}
                      </p>

                      <p className="font-body mt-0.5 text-[9px] text-[#2D312E]/35">
                        {nextConsultationClient?.full_name ??
                          nextConsultation.client_name ??
                          "Client"}
                      </p>
                    </>
                  ) : (
                    <p className="font-display mt-1 text-[15px]">
                      No upcoming consultation
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Clock size={18} />
                </div>

                <div>
                  <p className="font-body text-[9px] font-semibold uppercase tracking-wide text-[#2D312E]/35">
                    Duration
                  </p>

                  <p className="font-display mt-1 text-[15px]">
                    {duration} Minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Active Clients */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <MessageCircle size={18} />
                </div>

                <div>
                  <p className="font-body text-[9px] font-semibold uppercase tracking-wide text-[#2D312E]/35">
                    Active Clients
                  </p>

                  <p className="font-display mt-1 text-[15px]">
                    {activeClients} Clients
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation / Messages */}
          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="grid min-h-[620px] lg:grid-cols-[310px_1fr]">
              {/* Clients */}
              <aside className="border-b border-[#2D312E]/[0.06] lg:border-b-0 lg:border-r">
                <div className="border-b border-[#2D312E]/[0.06] p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                      <UserRound size={16} />
                    </div>

                    <div>
                      <h2 className="font-display text-[18px]">
                        My Clients
                      </h2>

                      <p className="font-body text-[9px] text-[#2D312E]/35">
                        Select a client to view consultations
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D312E]/30"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search clients..."
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-2.5 pl-9 pr-3 font-body text-[10px] text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <p className="font-body text-[10px] text-[#2D312E]/40">
                        No clients found.
                      </p>
                    </div>
                  ) : (
                    filteredClients.map((client) => {
                      const isSelected =
                        client.id ===
                        selectedClient?.id;

                      const clientAppointment =
                        appointments
                          .filter(
                            (appointment) =>
                              appointment.client ===
                                client.id &&
                              appointment.mode ===
                                "online" &&
                              appointment.status !==
                                "cancelled"
                          )
                          .sort((a, b) => {
                            const first =
                              new Date(
                                `${a.date}T${a.time}`
                              ).getTime();

                            const second =
                              new Date(
                                `${b.date}T${b.time}`
                              ).getTime();

                            return second - first;
                          })[0];

                      return (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setSelectedClientId(
                              client.id
                            );
                            setMessage("");
                          }}
                          className={`w-full border-b border-[#2D312E]/[0.05] px-5 py-4 text-left transition ${
                            isSelected
                              ? "bg-[#E9F0EC]"
                              : "bg-white hover:bg-[#FAF9F6]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                isSelected
                                  ? "bg-[#3D5A4C] text-white"
                                  : "bg-[#E9F0EC] text-[#3D5A4C]"
                              }`}
                            >
                              {getInitials(
                                client.full_name
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate font-body text-[11px] font-bold text-[#2D312E]">
                                  {client.full_name}
                                </p>

                                <span className="font-body text-[8px] text-[#2D312E]/30">
                                  {formatLastMessageTime(
                                    clientAppointment
                                  )}
                                </span>
                              </div>

                              <p className="mt-1 truncate font-body text-[9px] text-[#2D312E]/40">
                                {clientAppointment
                                  ? `${clientAppointment.appointment_type
                                      .replace(
                                        "_",
                                        " "
                                      )
                                      .replace(
                                        /^\w/,
                                        (c) =>
                                          c.toUpperCase()
                                      )} • ${clientAppointment.status}`
                                  : "No upcoming consultation"}
                              </p>

                              <div className="mt-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-body text-[8px] font-bold ${
                                    clientAppointment &&
                                    clientAppointment.status ===
                                      "confirmed"
                                      ? "bg-[#E9F0EC] text-[#3D5A4C]"
                                      : "bg-[#F1F1EE] text-[#2D312E]/50"
                                  }`}
                                >
                                  {clientAppointment &&
                                    clientAppointment.status ===
                                      "confirmed" && (
                                      <CheckCircle2
                                        size={10}
                                      />
                                    )}

                                  {clientAppointment
                                    ?.status ??
                                    "No appointment"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* Conversation */}
              <div className="flex min-h-[620px] flex-col">
                {selectedClient ? (
                  <>
                    {/* Conversation Header */}
                    <div className="flex flex-col gap-4 border-b border-[#2D312E]/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                          {getInitials(
                            selectedClient.full_name
                          )}
                        </div>

                        <div>
                          <h2 className="font-display text-[20px]">
                            {selectedClient.full_name}
                          </h2>

                          <p className="font-body mt-0.5 text-[9px] text-[#2D312E]/35">
                            {selectedClient.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/nutritionist/clients/${selectedClient.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#2D312E]/[0.08] px-3 py-2.5 font-body text-[9px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                        >
                          <UserRound size={13} />
                          View Profile
                        </Link>

                        {selectedConsultation ? (
                          <Link
                            href={`/nutritionist/consultations/video/${selectedClient.id}?appointmentId=${selectedConsultation.id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-3 py-2.5 font-body text-[9px] font-bold text-white transition hover:bg-[#2D312E]"
                          >
                            <Video size={13} />
                            Video Call
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-[#3D5A4C]/40 px-3 py-2.5 font-body text-[9px] font-bold text-white"
                          >
                            <Video size={13} />
                            No Online Call
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Consultation Details */}
                    <div className="border-b border-[#2D312E]/[0.05] bg-[#FAF9F6] px-5 py-3">
                      {selectedConsultation ? (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                          <span className="flex items-center gap-1.5 font-body text-[9px] text-[#2D312E]/45">
                            <CalendarDays
                              size={13}
                              className="text-[#4E876E]"
                            />

                            {formatConsultationDate(
                              selectedConsultation.date
                            )}
                          </span>

                          <span className="flex items-center gap-1.5 font-body text-[9px] text-[#2D312E]/45">
                            <Clock
                              size={13}
                              className="text-[#4E876E]"
                            />

                            {formatAppointmentTime(
                              selectedConsultation.time
                            )}
                          </span>

                          <span className="flex items-center gap-1.5 font-body text-[9px] text-[#2D312E]/45">
                            <Video
                              size={13}
                              className="text-[#4E876E]"
                            />

                            {selectedConsultation.appointment_type
                              .replace("_", " ")
                              .replace(
                                /^\w/,
                                (c) =>
                                  c.toUpperCase()
                              )}{" "}
                            •{" "}
                            {selectedConsultation.status}
                          </span>
                        </div>
                      ) : (
                        <p className="font-body text-[9px] text-[#2D312E]/40">
                          No online consultation is currently
                          scheduled for this client.
                        </p>
                      )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAF9F6] p-5 sm:p-6">
                      {(messages[selectedClient.id] ??
                        []).length === 0 ? (
                        <div className="flex min-h-[350px] items-center justify-center">
                          <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                              <MessageCircle size={21} />
                            </div>

                            <h3 className="font-display mt-4 text-[18px]">
                              No messages yet
                            </h3>

                            <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                              Start the conversation with{" "}
                              {selectedClient.full_name}.
                            </p>
                          </div>
                        </div>
                      ) : (
                        (
                          messages[
                            selectedClient.id
                          ] ?? []
                        ).map((item) => (
                          <div
                            key={item.id}
                            className={`flex ${
                              item.sender ===
                              "nutritionist"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`flex max-w-[80%] flex-col sm:max-w-[65%] ${
                                item.sender ===
                                "nutritionist"
                                  ? "items-end"
                                  : "items-start"
                              }`}
                            >
                              <div
                                className={`rounded-2xl px-4 py-3 ${
                                  item.sender ===
                                  "nutritionist"
                                    ? "rounded-br-md bg-[#3D5A4C] text-white"
                                    : "rounded-bl-md border border-[#2D312E]/[0.06] bg-white text-[#2D312E]"
                                }`}
                              >
                                <p className="font-body text-[11px] leading-5">
                                  {item.text}
                                </p>
                              </div>

                              <span
                                className={`mt-1 font-body text-[9px] text-[#2D312E]/35 ${
                                  item.sender ===
                                  "nutritionist"
                                    ? "mr-1"
                                    : "ml-1"
                                }`}
                              >
                                {item.time}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    <form
                      onSubmit={handleSendMessage}
                      className="border-t border-[#2D312E]/[0.06] bg-white p-4 sm:p-5"
                    >
                      <div className="flex items-end gap-3">
                        <textarea
                          value={message}
                          onChange={(e) =>
                            setMessage(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              !e.shiftKey
                            ) {
                              e.preventDefault();

                              const form =
                                e.currentTarget.form;

                              if (form) {
                                form.requestSubmit();
                              }
                            }
                          }}
                          placeholder={`Write a message to ${selectedClient.full_name}...`}
                          rows={2}
                          className="min-h-[48px] flex-1 resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                        />

                        <button
                          type="submit"
                          disabled={!message.trim()}
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D5A4C] text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Send message"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                          </svg>
                        </button>
                      </div>

                      <p className="font-body mt-2 text-[9px] text-[#2D312E]/30">
                        Press Enter to send • Shift + Enter
                        for a new line
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                      <UserRound
                        size={30}
                        className="mx-auto text-[#3D5A4C]/40"
                      />

                      <p className="font-body mt-3 text-[11px] text-[#2D312E]/40">
                        Select a client to begin.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ConsultationsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
          <div className="flex min-h-screen items-center justify-center">
            <p className="font-body text-[11px] text-[#2D312E]/40">
              Loading consultations...
            </p>
          </div>
        </main>
      }
    >
      <ConsultationsContent />
    </Suspense>
  );
}