"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Menu,
  MessageCircle,
  Phone,
  Ruler,
  Scale,
  Target,
  UserRound,
  Utensils,
  Weight,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import apiClient from "@/app/libs/api/client";

type NutritionPlan = {
  id: number;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
};

type HealthProfile = {
  age: number | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  activity_level: string | null;
  medical_conditions: string[];
  health_goal: string | null;
  diet_preference: string | null;
};

type Appointment = {
  id: number;
  date: string;
  time: string;
  appointment_type: string;
  mode: string;
  status: string;
};

type Client = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_picture: string | null;
  is_verified: boolean;
  preferences: string[];
  allergies: string[];
  nutrition_plans: NutritionPlan[];
  health_profile: HealthProfile | null;
  appointments: Appointment[];
};

type ClientNote = {
  id: number;
  nutritionist: number;
  client: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

function formatText(value: string | null | undefined) {
  if (!value) return "Not provided";

  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string) {
  if (!date) return "Not scheduled";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const hour = Number(hours);

  if (Number.isNaN(hour)) {
    return time;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${suffix}`;
}

function calculateBMI(
  height: string | null | undefined,
  weight: string | null | undefined
) {
  const heightNumber = Number(height);
  const weightNumber = Number(weight);

  if (!heightNumber || !weightNumber) {
    return null;
  }

  const heightMeters = heightNumber / 100;
  const bmi = weightNumber / (heightMeters * heightMeters);

  return bmi.toFixed(1);
}

function calculateWeightLost(
  startingWeight: string | null | undefined,
  currentWeight: string | null | undefined
) {
  const starting = Number(startingWeight);
  const current = Number(currentWeight);

  if (!starting || !current) {
    return null;
  }

  const lost = starting - current;

  return `${lost.toFixed(1)} kg`;
}

function calculateProgress(
  currentWeight: string | null | undefined,
  targetWeight: string | null | undefined,
  startingWeight: string | null | undefined
) {
  const current = Number(currentWeight);
  const target = Number(targetWeight);
  const starting = Number(startingWeight);

  if (!current || !target || !starting || starting === target) {
    return 0;
  }

  const progress = ((starting - current) / (starting - target)) * 100;

  return Math.min(100, Math.max(0, progress));
}

function useClient(clientId: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [note, setNote] = useState<ClientNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadClient() {
      setIsLoading(true);

      try {
        const [clientResponse, notesResponse] = await Promise.all([
          apiClient.get(`/api/nutritionists/clients/${clientId}/`),
          apiClient
            .get(`/api/nutritionists/clients/${clientId}/notes/`)
            .catch(() => ({ data: null })),
        ]);

        console.log("CLIENT DETAILS:", clientResponse.data);
        console.log("CLIENT NOTES:", notesResponse.data);

        if (isMounted) {
          setClient(clientResponse.data);
          setNote(notesResponse.data);
        }
      } catch (error) {
        console.error("Unable to load client:", error);

        if (isMounted) {
          setClient(null);
          setNote(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (clientId) {
      loadClient();
    }

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return {
    client,
    note,
    isLoading,
  };
}

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = String(params.id);

  const { client, note, isLoading } = useClient(clientId);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <MobileHeader setSidebarOpen={setSidebarOpen} />

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="flex min-h-[70vh] items-center justify-center px-5">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                <UserRound size={21} />
              </div>

              <h2 className="font-display mt-4 text-[20px]">
                Loading client...
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                Please wait while the client profile is loaded.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <MobileHeader setSidebarOpen={setSidebarOpen} />

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-7 lg:px-8">
            <Link
              href="/nutritionist/clients"
              className="mb-8 inline-flex items-center gap-2 font-body text-[12px] font-semibold text-[#4E876E] hover:text-[#3D5A4C]"
            >
              <ArrowLeft size={15} />
              Back to Clients
            </Link>

            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white px-6 py-12 text-center shadow-sm">
              <UserRound
                size={28}
                className="mx-auto text-[#4E876E]"
              />

              <h1 className="font-display mt-4 text-[22px]">
                Client not found
              </h1>

              <p className="font-body mt-2 text-[11px] text-[#2D312E]/40">
                The client profile you are looking for does not exist.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const health = client.health_profile;

  const activePlan =
    client.nutrition_plans?.find(
      (plan) => plan.status?.toLowerCase() === "active"
    ) ?? client.nutrition_plans?.[0];

  const bmi = calculateBMI(
    health?.height,
    health?.weight
  );

  const targetWeight =
    activePlan && health?.weight
      ? null
      : null;

  const upcomingAppointments = [...(client.appointments || [])]
    .filter((appointment) =>
      ["confirmed", "pending"].includes(
        appointment.status?.toLowerCase()
      )
    )
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
    );

  const nextAppointment = upcomingAppointments[0];

  const completedAppointments = (client.appointments || []).filter(
    (appointment) =>
      appointment.status?.toLowerCase() === "completed"
  );

  const currentWeight = health?.weight
    ? `${Number(health.weight).toFixed(1)} kg`
    : "Not provided";

  const height = health?.height
    ? `${Number(health.height).toFixed(0)} cm`
    : "Not provided";

  const medicalCondition =
    health?.medical_conditions?.length
      ? health.medical_conditions.map(formatText).join(", ")
      : "None reported";

  const allergies =
    client.allergies?.length
      ? client.allergies.map(formatText).join(", ")
      : "No known allergies";

  const goal = formatText(health?.health_goal);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      <MobileHeader setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* BACK */}
          <Link
            href="/nutritionist/clients"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Clients
          </Link>

          {/* CLIENT HEADER */}
          <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                  {client.profile_picture ? (
                    <img
                      src={client.profile_picture}
                      alt={client.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={27} />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-[26px] text-[#2D312E]">
                      {client.full_name}
                    </h1>

                    <span className="rounded-full bg-[#E9F0EC] px-2.5 py-1 font-body text-[9px] font-bold text-[#3D5A4C]">
                      {client.is_verified
                        ? "Verified"
                        : "Client"}
                    </span>
                  </div>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/45">
                    {health?.age
                      ? `${health.age} years old`
                      : "Age not provided"}{" "}
                    • {formatText(health?.gender)}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5">
                      <Phone
                        size={12}
                        className="text-[#4E876E]"
                      />

                      <span className="font-body text-[10px] text-[#2D312E]/55">
                        {client.phone || "Not provided"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MessageCircle
                        size={12}
                        className="text-[#4E876E]"
                      />

                      <span className="font-body text-[10px] text-[#2D312E]/55">
                        {client.email || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HEADER ACTIONS */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/nutritionist/consultations?clientId=${client.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] px-4 py-2.5 font-body text-[10px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                >
                  <MessageCircle size={14} />
                  Message
                </Link>

                <Link
                  href={`/nutritionist/appointments/new?clientId=${client.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#334B40]"
                >
                  <CalendarDays size={14} />
                  Schedule
                </Link>
              </div>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* GOAL */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Target size={17} />
                </div>

                <span className="font-body text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/30">
                  Goal
                </span>
              </div>

              <p className="font-display mt-4 text-[18px] text-[#2D312E]">
                {goal}
              </p>

              <p className="font-body mt-1 text-[10px] leading-5 text-[#2D312E]/40">
                Current health goal from the client profile.
              </p>
            </div>

            {/* BMI */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Activity size={17} />
                </div>

                <span className="font-body text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/30">
                  BMI
                </span>
              </div>

              <p className="font-display mt-4 text-[26px] text-[#3D5A4C]">
                {bmi ?? "—"}
              </p>

              <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                Calculated from current height and weight
              </p>
            </div>

            {/* CURRENT WEIGHT */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Weight size={17} />
                </div>

                <span className="font-body text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/30">
                  Weight
                </span>
              </div>

              <p className="font-display mt-4 text-[22px] text-[#3D5A4C]">
                {currentWeight}
              </p>

              <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                Current recorded weight
              </p>
            </div>

            {/* NEXT APPOINTMENT */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <CalendarDays size={17} />
                </div>

                <span className="font-body text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/30">
                  Next Visit
                </span>
              </div>

              <p className="font-display mt-4 text-[18px] text-[#2D312E]">
                {nextAppointment
                  ? formatDate(nextAppointment.date)
                  : "Not scheduled"}
              </p>

              <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                {nextAppointment
                  ? formatTime(nextAppointment.time)
                  : "No upcoming appointment"}
              </p>
            </div>
          </section>

          {/* MAIN GRID */}
          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            {/* LEFT */}
            <div className="space-y-6">
              {/* HEALTH OVERVIEW */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <HeartPulse size={17} />
                  </div>

                  <div>
                    <h2 className="font-display text-[19px]">
                      Health Overview
                    </h2>

                    <p className="font-body text-[10px] text-[#2D312E]/40">
                      Current health and lifestyle information
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* HEIGHT */}
                  <div className="rounded-xl bg-[#FAF9F6] p-4">
                    <div className="flex items-center gap-2">
                      <Ruler
                        size={14}
                        className="text-[#4E876E]"
                      />

                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                        Height
                      </p>
                    </div>

                    <p className="font-display mt-2 text-[17px]">
                      {height}
                    </p>
                  </div>

                  {/* WEIGHT */}
                  <div className="rounded-xl bg-[#FAF9F6] p-4">
                    <div className="flex items-center gap-2">
                      <Scale
                        size={14}
                        className="text-[#4E876E]"
                      />

                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                        Current Weight
                      </p>
                    </div>

                    <p className="font-display mt-2 text-[17px]">
                      {currentWeight}
                    </p>
                  </div>

                  {/* ACTIVITY */}
                  <div className="rounded-xl bg-[#FAF9F6] p-4">
                    <div className="flex items-center gap-2">
                      <Activity
                        size={14}
                        className="text-[#4E876E]"
                      />

                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                        Activity Level
                      </p>
                    </div>

                    <p className="font-display mt-2 text-[17px]">
                      {formatText(health?.activity_level)}
                    </p>
                  </div>

                  {/* DIET */}
                  <div className="rounded-xl bg-[#FAF9F6] p-4">
                    <div className="flex items-center gap-2">
                      <Utensils
                        size={14}
                        className="text-[#4E876E]"
                      />

                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                        Diet Preference
                      </p>
                    </div>

                    <p className="font-display mt-2 text-[17px]">
                      {formatText(health?.diet_preference)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {/* MEDICAL */}
                  <div className="rounded-xl border border-[#2D312E]/[0.06] p-4">
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                      Medical Condition
                    </p>

                    <p className="font-body mt-2 text-[11px] font-semibold text-[#2D312E]/70">
                      {medicalCondition}
                    </p>
                  </div>

                  {/* ALLERGIES */}
                  <div className="rounded-xl border border-[#2D312E]/[0.06] p-4">
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                      Allergies
                    </p>

                    <p className="font-body mt-2 text-[11px] font-semibold text-[#2D312E]/70">
                      {allergies}
                    </p>
                  </div>
                </div>

                {/* PREFERENCES */}
                {client.preferences?.length > 0 && (
                  <div className="mt-4 rounded-xl border border-[#2D312E]/[0.06] p-4">
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                      Preferences
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {client.preferences.map((preference) => (
                        <span
                          key={preference}
                          className="rounded-full border border-[#CCD6C4] bg-[#E9F0EC] px-3 py-1.5 font-body text-[9px] font-semibold text-[#3D5A4C]"
                        >
                          {formatText(preference)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* APPOINTMENTS */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                      <CalendarDays size={17} />
                    </div>

                    <div>
                      <h2 className="font-display text-[19px]">
                        Appointments
                      </h2>

                      <p className="font-body text-[10px] text-[#2D312E]/40">
                        Recent and upcoming appointments
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/nutritionist/appointments?clientId=${client.id}`}
                    className="font-body text-[10px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
                  >
                    View All
                  </Link>
                </div>

                {client.appointments?.length > 0 ? (
                  <div className="space-y-3">
                    {client.appointments.slice(0, 5).map(
                      (appointment) => {
                        const isUpcoming =
                          ["confirmed", "pending"].includes(
                            appointment.status?.toLowerCase()
                          );

                        return (
                          <div
                            key={appointment.id}
                            className="rounded-xl border border-[#2D312E]/[0.06] p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex gap-3">
                                <div
                                  className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                                    isUpcoming
                                      ? "bg-[#E9F0EC] text-[#3D5A4C]"
                                      : "bg-[#FAF9F6] text-[#2D312E]/45"
                                  }`}
                                >
                                  {isUpcoming ? (
                                    <Clock3 size={14} />
                                  ) : (
                                    <CheckCircle2 size={14} />
                                  )}
                                </div>

                                <div>
                                  <p className="font-body text-[11px] font-bold text-[#2D312E]">
                                    {formatText(
                                      appointment.appointment_type
                                    )}
                                  </p>

                                  <p className="mt-1 font-body text-[10px] text-[#2D312E]/40">
                                    {formatDate(
                                      appointment.date
                                    )}{" "}
                                    •{" "}
                                    {formatTime(
                                      appointment.time
                                    )}
                                  </p>

                                  <p className="mt-1 font-body text-[9px] text-[#2D312E]/35">
                                    {formatText(appointment.mode)}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`self-start rounded-full px-2.5 py-1 font-body text-[9px] font-bold ${
                                  isUpcoming
                                    ? "bg-[#E9F0EC] text-[#3D5A4C]"
                                    : appointment.status?.toLowerCase() ===
                                      "cancelled"
                                    ? "bg-red-50 text-red-500"
                                    : "bg-[#FAF9F6] text-[#2D312E]/50"
                                }`}
                              >
                                {formatText(appointment.status)}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#FAF9F6] px-4 py-8 text-center">
                    <CalendarDays
                      size={22}
                      className="mx-auto text-[#4E876E]"
                    />

                    <p className="font-body mt-3 text-[11px] text-[#2D312E]/45">
                      No appointments found.
                    </p>
                  </div>
                )}

                <div className="mt-4 rounded-xl bg-[#FAF9F6] p-4">
                  <div className="flex justify-between">
                    <span className="font-body text-[10px] text-[#2D312E]/45">
                      Total appointments
                    </span>

                    <span className="font-body text-[10px] font-bold text-[#3D5A4C]">
                      {client.appointments?.length || 0}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="font-body text-[10px] text-[#2D312E]/45">
                      Completed
                    </span>

                    <span className="font-body text-[10px] font-bold text-[#3D5A4C]">
                      {completedAppointments.length}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* CURRENT NUTRITION PLAN */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <Utensils size={17} />
                  </div>

                  <div>
                    <h2 className="font-display text-[19px]">
                      Current Nutrition Plan
                    </h2>

                    <p className="font-body text-[10px] text-[#2D312E]/40">
                      Active meal plan
                    </p>
                  </div>
                </div>

                {activePlan ? (
                  <>
                    <div className="rounded-xl bg-[#E9F0EC] p-4">
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#3D5A4C]/60">
                        Nutrition Plan
                      </p>

                      <h3 className="font-display mt-2 text-[18px] text-[#3D5A4C]">
                        {activePlan.plan_name}
                      </h3>

                      <p className="font-body mt-1 text-[10px] text-[#3D5A4C]/60">
                        {formatDate(activePlan.start_date)} —{" "}
                        {formatDate(activePlan.end_date)}
                      </p>

                      <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 font-body text-[9px] font-bold text-[#3D5A4C]">
                        {formatText(activePlan.status)}
                      </span>
                    </div>

                    <Link
                      href={`/nutritionist/nutrition-plans/${activePlan.id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] py-3 font-body text-[10px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                    >
                      <FileText size={14} />
                      View Full Meal Plan
                    </Link>
                  </>
                ) : (
                  <div className="rounded-xl bg-[#FAF9F6] px-4 py-8 text-center">
                    <Utensils
                      size={22}
                      className="mx-auto text-[#4E876E]"
                    />

                    <p className="font-body mt-3 text-[11px] text-[#2D312E]/45">
                      No nutrition plan assigned.
                    </p>
                  </div>
                )}
              </section>

              {/* NUTRITIONIST NOTES */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <FileText size={17} />
                  </div>

                  <div>
                    <h2 className="font-display text-[19px]">
                      Nutritionist Notes
                    </h2>

                    <p className="font-body text-[10px] text-[#2D312E]/40">
                      Private clinical notes
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#FAF9F6] p-4">
                  <p className="font-body text-[11px] leading-6 text-[#2D312E]/65">
                    {note?.notes ||
                      "No notes have been added for this client yet."}
                  </p>
                </div>

                <Link
                  href={`/nutritionist/clients/${client.id}/notes`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#3D5A4C] py-3 font-body text-[10px] font-bold text-white transition hover:bg-[#334B40]"
                >
                  {note?.notes ? "Update Notes" : "Add Notes"}
                </Link>
              </section>

              {/* QUICK ACTIONS */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-display text-[19px]">
                  Quick Actions
                </h2>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  Manage this client's care
                </p>

                <div className="mt-5 space-y-2">
                  {activePlan && (
                    <Link
                      href={`/nutritionist/nutrition-plans/${activePlan.id}/edit`}
                      className="flex w-full items-center gap-3 rounded-xl border border-[#2D312E]/[0.07] px-4 py-3 text-left transition hover:bg-[#FAF9F6]"
                    >
                      <Utensils
                        size={15}
                        className="text-[#4E876E]"
                      />

                      <span className="font-body text-[10px] font-semibold text-[#2D312E]/70">
                        Update Meal Plan
                      </span>
                    </Link>
                  )}

                  <Link
                    href={`/nutritionist/appointments/new?clientId=${client.id}`}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#2D312E]/[0.07] px-4 py-3 text-left transition hover:bg-[#FAF9F6]"
                  >
                    <CalendarDays
                      size={15}
                      className="text-[#4E876E]"
                    />

                    <span className="font-body text-[10px] font-semibold text-[#2D312E]/70">
                      Schedule Appointment
                    </span>
                  </Link>

                  <Link
                    href={`/nutritionist/consultations?clientId=${client.id}`}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#2D312E]/[0.07] px-4 py-3 text-left transition hover:bg-[#FAF9F6]"
                  >
                    <MessageCircle
                      size={15}
                      className="text-[#4E876E]"
                    />

                    <span className="font-body text-[10px] font-semibold text-[#2D312E]/70">
                      Message Client
                    </span>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MobileHeader({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
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
  );
}