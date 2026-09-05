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

type ClientStatus = "Active" | "Inactive";

type Appointment = {
  date: string;
  time: string;
  type: string;
  status: "Completed" | "Upcoming";
  notes: string;
};

type ClientDetails = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  status: ClientStatus;

  height: string;
  currentWeight: string;
  targetWeight: string;
  bmi: string;

  goal: string;
  goalDescription: string;

  medicalCondition: string;
  activityLevel: string;
  allergies: string;

  nutritionPlanId: string;
  nutritionPlan: string;
  calories: string;
  dietType: string[];

  progress: {
    startingWeight: string;
    currentWeight: string;
    weightLost: string;
  };

  nextAppointment: {
    date: string;
    time: string;
  };

  appointments: Appointment[];

  notes: string;
};

/*
 * Backend client endpoint is not available yet.
 *
 * This hook is intentionally kept without mock data.
 * Once the backend endpoint is ready, the API call can
 * be added here without changing the UI below.
 */
function useClient(clientId: string) {
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadClient() {
      setIsLoading(true);

      /*
       * Client API endpoint is not available yet.
       * No mock data is used here.
       */

      if (isMounted) {
        setClient(null);
        setIsLoading(false);
      }
    }

    if (clientId) {
      loadClient();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return {
    client,
    isLoading,
  };
}

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = String(params.id);

  const { client, isLoading } = useClient(clientId);

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

          {/* Back */}
          <Link
            href="/nutritionist/clients"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Clients
          </Link>

          {/* Client Header */}
          <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                  <UserRound size={27} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-[26px] text-[#2D312E]">
                      {client.name}
                    </h1>

                    <span
                      className={`rounded-full px-2.5 py-1 font-body text-[9px] font-bold ${
                        client.status === "Active"
                          ? "bg-[#E9F0EC] text-[#3D5A4C]"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/45">
                    {client.age} years old • {client.gender}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5">
                      <Phone
                        size={12}
                        className="text-[#4E876E]"
                      />

                      <span className="font-body text-[10px] text-[#2D312E]/55">
                        {client.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MessageCircle
                        size={12}
                        className="text-[#4E876E]"
                      />

                      <span className="font-body text-[10px] text-[#2D312E]/55">
                        {client.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex flex-wrap gap-2">

                {/* Message → Consultation */}
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

          {/* Summary Cards */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Goal */}
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
                {client.goal}
              </p>

              <p className="font-body mt-1 text-[10px] leading-5 text-[#2D312E]/40">
                {client.goalDescription}
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
                {client.bmi}
              </p>

              <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                Current body mass index
              </p>
            </div>

            {/* Weight Progress */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Weight size={17} />
                </div>

                <span className="font-body text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/30">
                  Progress
                </span>
              </div>

              <p className="font-display mt-4 text-[22px] text-[#3D5A4C]">
                {client.progress.weightLost}
              </p>

              <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                Weight lost since starting
              </p>
            </div>

            {/* Next Appointment */}
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
                {client.nextAppointment.date}
              </p>

              <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                {client.nextAppointment.time ||
                  "No appointment scheduled"}
              </p>
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">

            {/* LEFT COLUMN */}
            <div className="space-y-6">

              {/* Health Overview */}
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
                      {client.height}
                    </p>
                  </div>

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
                      {client.currentWeight}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#FAF9F6] p-4">
                    <div className="flex items-center gap-2">
                      <Target
                        size={14}
                        className="text-[#4E876E]"
                      />

                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                        Target Weight
                      </p>
                    </div>

                    <p className="font-display mt-2 text-[17px]">
                      {client.targetWeight}
                    </p>
                  </div>

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
                      {client.activityLevel}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <div className="rounded-xl border border-[#2D312E]/[0.06] p-4">
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                      Medical Condition
                    </p>

                    <p className="font-body mt-2 text-[11px] font-semibold text-[#2D312E]/70">
                      {client.medicalCondition}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#2D312E]/[0.06] p-4">
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                      Allergies
                    </p>

                    <p className="font-body mt-2 text-[11px] font-semibold text-[#2D312E]/70">
                      {client.allergies}
                    </p>
                  </div>

                </div>
              </section>

              {/* Weight Progress */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D312E] via-[#3D5A4C] to-[#4D6B5C] p-5 shadow-[0_18px_40px_-20px_rgba(45,49,46,0.35)] sm:p-6">
                {/* Decorative elements */}
                <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full border border-[#DCC48E]/15" />

                <div className="pointer-events-none absolute -bottom-20 right-16 h-40 w-40 rounded-full bg-[#DCC48E]/10 blur-2xl" />

                <div className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                      <Weight size={17} />
                    </div>

                    <div>
                      <h2 className="font-display text-[19px] text-white">
                        Weight Progress
                      </h2>

                      <p className="font-body text-[10px] text-white/60">
                        Client progress toward target weight
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-white/50">
                        Starting Weight
                      </p>

                      <p className="font-display mt-1 text-[20px] text-white">
                        {client.progress.startingWeight}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#DCC48E]/80">
                        Lost
                      </p>

                      <p className="font-display mt-1 text-[20px] text-[#DCC48E]">
                        {client.progress.weightLost}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-white/50">
                        Current
                      </p>

                      <p className="font-display mt-1 text-[20px] text-white">
                        {client.progress.currentWeight}
                      </p>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[#DCC48E]"
                      style={{
                        width: "62%",
                      }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="font-body text-[9px] text-white/45">
                      {client.progress.startingWeight}
                    </span>

                    <span className="font-body text-[9px] font-semibold text-[#DCC48E]">
                      Target {client.targetWeight}
                    </span>
                  </div>
                </div>
              </section>

              {/* Appointments */}
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

                <div className="space-y-3">
                  {client.appointments.map((appointment, index) => (
                    <div
                      key={`${appointment.date}-${index}`}
                      className="rounded-xl border border-[#2D312E]/[0.06] p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex gap-3">
                          <div
                            className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                              appointment.status === "Upcoming"
                                ? "bg-[#E9F0EC] text-[#3D5A4C]"
                                : "bg-[#FAF9F6] text-[#2D312E]/45"
                            }`}
                          >
                            {appointment.status === "Upcoming" ? (
                              <Clock3 size={14} />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                          </div>

                          <div>
                            <p className="font-body text-[11px] font-bold text-[#2D312E]">
                              {appointment.type}
                            </p>

                            <p className="mt-1 font-body text-[10px] text-[#2D312E]/40">
                              {appointment.date} • {appointment.time}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`self-start rounded-full px-2.5 py-1 font-body text-[9px] font-bold ${
                            appointment.status === "Upcoming"
                              ? "bg-[#E9F0EC] text-[#3D5A4C]"
                              : "bg-[#FAF9F6] text-[#2D312E]/50"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <p className="mt-3 border-t border-[#2D312E]/[0.05] pt-3 font-body text-[10px] leading-5 text-[#2D312E]/50">
                        {appointment.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">

              {/* Current Nutrition Plan */}
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

                <div className="rounded-xl bg-[#E9F0EC] p-4">
                  <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#3D5A4C]/60">
                    Nutrition Plan
                  </p>

                  <h3 className="font-display mt-2 text-[18px] text-[#3D5A4C]">
                    {client.nutritionPlan}
                  </h3>

                  <p className="font-body mt-1 text-[10px] text-[#3D5A4C]/60">
                    Daily target: {client.calories}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {client.dietType.map((type) => (
                    <span
                      key={type}
                      className="rounded-full border border-[#CCD6C4] bg-white px-3 py-1.5 font-body text-[9px] font-semibold text-[#3D5A4C]"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/nutritionist/nutrition-plans/${client.nutritionPlanId}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] py-3 font-body text-[10px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                >
                  <FileText size={14} />
                  View Full Meal Plan
                </Link>
              </section>

              {/* Nutritionist Notes */}
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
                    {client.notes}
                  </p>
                </div>

                <Link
                  href={`/nutritionist/clients/${client.id}/notes`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#3D5A4C] py-3 font-body text-[10px] font-bold text-white transition hover:bg-[#334B40]"
                >
                  Update Notes
                </Link>
              </section>

              {/* Quick Actions */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-display text-[19px]">
                  Quick Actions
                </h2>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  Manage this client's care
                </p>

                <div className="mt-5 space-y-2">

                  {/* Update Meal Plan */}
                  <Link
                    href={`/nutritionist/nutrition-plans/${client.nutritionPlanId}/edit`}
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

                  {/* Schedule Appointment */}
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

                  {/* Message Client → Consultation */}
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