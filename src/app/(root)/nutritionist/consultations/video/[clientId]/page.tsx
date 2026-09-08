"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  UserRound,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  age?: number;
  gender?: string;
  height?: number;
  currentWeight?: number;
  targetWeight?: number | null;
  bmi?: number;
  goal?: string;
  medicalCondition?: string[];
  activityLevel?: string;
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

function formatAppointmentDate(
  dateString: string
): string {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAppointmentTime(time: string): string {
  const [hoursString, minutesString] =
    time.split(":");

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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function VideoConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, status: sessionStatus } =
    useSession();

  const clientId = Number(params.clientId);

  const appointmentIdParam =
    searchParams.get("appointmentId");

  const appointmentId = appointmentIdParam
    ? Number(appointmentIdParam)
    : null;

  const [client, setClient] =
    useState<Client | null>(null);

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Load real client list and real nutritionist
   * appointments using the NextAuth Django access token.
   */
  useEffect(() => {
    async function loadConsultation() {
      if (sessionStatus === "loading") {
        return;
      }

      if (!session?.accessToken) {
        setLoading(false);
        setError(
          "Authentication session not found."
        );
        return;
      }

      if (
        !Number.isInteger(clientId) ||
        clientId <= 0
      ) {
        setLoading(false);
        setError("Invalid client ID.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${session.accessToken}`,
        };

        /*
         * IMPORTANT:
         *
         * There is no:
         *
         * /api/nutritionist/clients/<id>/
         *
         * endpoint in the current backend.
         *
         * Therefore we get the client from the client list.
         */
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
          const text =
            await clientsResponse.text();

          throw new Error(
            text ||
              `Failed to load clients (${clientsResponse.status}).`
          );
        }

        if (!appointmentsResponse.ok) {
          const text =
            await appointmentsResponse.text();

          throw new Error(
            text ||
              `Failed to load appointments (${appointmentsResponse.status}).`
          );
        }

        const clientsData =
          (await clientsResponse.json()) as Client[];

        const appointmentsData =
          (await appointmentsResponse.json()) as Appointment[];

        const foundClient =
          clientsData.find(
            (item) => item.id === clientId
          );

        if (!foundClient) {
          throw new Error(
            "Client was not found."
          );
        }

        /*
         * Find the requested appointment when the URL
         * contains ?appointmentId=...
         */
        let foundAppointment: Appointment | null =
          null;

        if (
          appointmentId &&
          Number.isInteger(appointmentId)
        ) {
          foundAppointment =
            appointmentsData.find(
              (item) =>
                item.id === appointmentId &&
                item.client === clientId
            ) ?? null;

          if (!foundAppointment) {
            throw new Error(
              "The selected appointment was not found for this client."
            );
          }
        } else {
          /*
           * Fallback:
           *
           * If someone opens:
           *
           * /video/39
           *
           * without an appointmentId, find the latest
           * non-cancelled online appointment.
           */
          const clientAppointments =
            appointmentsData
              .filter(
                (item) =>
                  item.client === clientId &&
                  item.mode === "online" &&
                  item.status !== "cancelled"
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

          foundAppointment =
            clientAppointments[0] ?? null;
        }

        if (!foundAppointment) {
          throw new Error(
            "No online appointment exists for this client."
          );
        }

        if (
          foundAppointment.mode !== "online"
        ) {
          throw new Error(
            "This appointment is not an online consultation."
          );
        }

        if (
          foundAppointment.status ===
          "cancelled"
        ) {
          throw new Error(
            "This appointment has been cancelled."
          );
        }

        setClient(foundClient);
        setAppointment(foundAppointment);
      } catch (err) {
        console.error(
          "Failed to load video consultation:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load video consultation."
        );
      } finally {
        setLoading(false);
      }
    }

    loadConsultation();
  }, [
    session?.accessToken,
    sessionStatus,
    clientId,
    appointmentId,
  ]);

  /*
   * Each APPOINTMENT gets its own Jitsi room.
   *
   * Example:
   *
   * Appointment 18
   * -> megeb-consultation-18
   *
   * Appointment 29
   * -> megeb-consultation-29
   *
   * This prevents two different consultations for the
   * same client from accidentally sharing a room.
   */
  const roomName = useMemo(() => {
    if (!appointment) {
      return "";
    }

    return `megeb-consultation-${appointment.id}`;
  }, [appointment]);

  function goBack() {
    if (client) {
      router.push(
        `/nutritionist/consultations?clientId=${client.id}`
      );
    } else {
      router.push(
        "/nutritionist/consultations"
      );
    }
  }

  if (
    sessionStatus === "loading" ||
    loading
  ) {
    return (
      <main className="min-h-screen bg-[#1F2522] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-body text-[11px] text-white/50">
            Loading consultation...
          </p>
        </div>
      </main>
    );
  }

  if (error || !client || !appointment) {
    return (
      <main className="min-h-screen bg-[#1F2522] text-white">
        <header className="flex h-16 items-center border-b border-white/10 bg-[#252C28] px-5 sm:px-7">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Back to consultations"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="ml-4">
            <div className="flex items-center gap-2">
              <Video
                size={15}
                className="text-[#8FC5A8]"
              />

              <h1 className="font-display text-[16px]">
                Video Consultation
              </h1>
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#252C28] p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <Video
                size={21}
                className="text-[#8FC5A8]"
              />
            </div>

            <h2 className="font-display mt-5 text-[20px]">
              Unable to open consultation
            </h2>

            <p className="font-body mt-2 text-[11px] leading-5 text-white/45">
              {error ||
                "The requested consultation could not be loaded."}
            </p>

            <button
              type="button"
              onClick={goBack}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#4E876E]"
            >
              <ArrowLeft size={13} />
              Back to Consultations
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1F2522] text-white">
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#252C28] px-5 sm:px-7">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Back to consultations"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Video
                size={15}
                className="text-[#8FC5A8]"
              />

              <h1 className="font-display text-[16px]">
                Video Consultation
              </h1>
            </div>

            <p className="font-body mt-0.5 text-[9px] text-white/40">
              Secure online consultation
            </p>
          </div>
        </div>

        {/* Consultation Info */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
            <UserRound size={15} />
          </div>

          <div>
            <p className="font-body text-[10px] font-semibold text-white">
              {client.full_name}
            </p>

            <div className="mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1 font-body text-[8px] text-white/40">
                <CalendarDays size={10} />

                {formatAppointmentDate(
                  appointment.date
                )}
              </span>

              <span className="flex items-center gap-1 font-body text-[8px] text-white/40">
                <Clock size={10} />

                {formatAppointmentTime(
                  appointment.time
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <div className="flex min-h-[calc(100vh-64px)] flex-col">
        <div className="flex flex-1 items-center justify-center p-3 sm:p-5">
          <div className="h-[calc(100vh-90px)] min-h-[520px] w-full max-w-7xl overflow-hidden rounded-2xl bg-[#151A18] shadow-2xl">
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={roomName}
              userInfo={{
                displayName:
                  "Megeb+ Nutritionist",
                email:
                  "nutritionist@megebplus.com",
              }}
              configOverwrite={{
                startWithAudioMuted: false,
                startWithVideoMuted: false,

                prejoinConfig: {
                  enabled: true,
                },

                disableModeratorIndicator: true,
                enableEmailInStats: false,
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                MOBILE_APP_PROMO: false,
                TILE_VIEW_MAX_COLUMNS: 2,
              }}
              onReadyToClose={() => {
                goBack();
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.width = "100%";
                iframeRef.style.height = "100%";
                iframeRef.style.border = "0";
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}