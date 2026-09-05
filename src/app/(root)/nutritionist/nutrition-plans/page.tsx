"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Plus,
  Search,
  UserRound,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Pencil,
  Eye,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import { apiFetch } from "@/app/lib/api";

type NutritionPlanStatus = "Active" | "Draft" | "Completed";

type NutritionPlan = {
  id: string;
  clientName: string;
  planName: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: NutritionPlanStatus;
};

function useNutritionPlans() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchNutritionPlans() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiFetch<NutritionPlan[]>(
          "/nutritionist/nutrition-plans"
        );

        if (isMounted) {
          setPlans(data);
        }
      } catch (err) {
        console.error("Unable to load nutrition plans:", err);

        if (isMounted) {
          setError("Unable to load nutrition plans.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchNutritionPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    plans,
    isLoading,
    error,
  };
}

export default function NutritionPlansPage() {
  const { plans, isLoading, error } = useNutritionPlans();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All plans");

  const filteredPlans = plans.filter((plan) => {
    const searchQuery = query.toLowerCase();

    const matchesSearch =
      plan.clientName.toLowerCase().includes(searchQuery) ||
      plan.planName.toLowerCase().includes(searchQuery) ||
      plan.goal.toLowerCase().includes(searchQuery);

    const matchesStatus =
      statusFilter === "All plans" || plan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPlans = plans.length;

  const activePlans = plans.filter(
    (plan) => plan.status === "Active"
  ).length;

  const draftPlans = plans.filter(
    (plan) => plan.status === "Draft"
  ).length;

  const completedPlans = plans.filter(
    (plan) => plan.status === "Completed"
  ).length;

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
          aria-label="Open menu"
        >
          <ClipboardList size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Page Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                <ClipboardList size={21} />
              </div>

              <h1 className="font-display text-[28px] text-[#2D312E]">
                Nutrition Plans
              </h1>

              <p className="font-body mt-1 text-[12px] text-[#2D312E]/45">
                Create and manage personalized nutrition plans for your
                clients.
              </p>
            </div>

            {/* Create Plan */}
            <Link
              href="/nutritionist/nutrition-plans/new"
              className="flex w-fit items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[12px] font-semibold text-white transition hover:bg-[#2D312E]"
            >
              <Plus size={18} />
              Create Plan
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total Plans"
              value={totalPlans.toString()}
              note="All nutrition plans"
              icon={<ClipboardList size={20} />}
            />

            <SummaryCard
              label="Active"
              value={activePlans.toString()}
              note="Currently active"
              icon={<CheckCircle2 size={20} />}
            />

            <SummaryCard
              label="Drafts"
              value={draftPlans.toString()}
              note="Not published"
              icon={<FileText size={20} />}
            />

            <SummaryCard
              label="Completed"
              value={completedPlans.toString()}
              note="Completed plans"
              icon={<Clock size={20} />}
            />
          </div>

          {/* Plans Section */}
          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            {/* Section Header */}
            <div className="border-b border-[#2D312E]/[0.06] px-6 py-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-display text-[20px] text-[#2D312E]">
                    All Nutrition Plans
                  </h2>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                    Manage your clients&apos; personalized nutrition plans.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D312E]/30"
                    />

                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search plans"
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-2 pl-9 pr-3 font-body text-[11px] text-[#2D312E] outline-none focus:border-[#3D5A4C] sm:w-52"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-2 font-body text-[11px] text-[#2D312E]/60 outline-none focus:border-[#3D5A4C]"
                  >
                    <option>All plans</option>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-6 py-4">
                <p className="font-body text-[12px] font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2D312E]/[0.06] bg-[#FAF9F6] text-left">
                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Client
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Plan
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Goal
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Duration
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Status
                    </th>

                    <th className="px-6 py-4 font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center font-body text-[12px] text-[#2D312E]/40"
                      >
                        Loading nutrition plans…
                      </td>
                    </tr>
                  ) : filteredPlans.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                          <ClipboardList size={21} />
                        </div>

                        <p className="mt-4 font-display text-[17px] text-[#2D312E]">
                          No nutrition plans found
                        </p>

                        <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                          Try changing your search or filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPlans.map((plan) => (
                      <tr
                        key={plan.id}
                        className="border-b border-[#2D312E]/[0.05] last:border-0 hover:bg-[#FAF9F6]/60"
                      >
                        {/* Client */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                              <UserRound size={18} />
                            </div>

                            <div>
                              <p className="font-body text-[12px] font-bold text-[#2D312E]">
                                {plan.clientName}
                              </p>

                              <p className="font-body text-[9px] text-[#2D312E]/35">
                                Plan #{plan.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <FileText
                              size={15}
                              className="text-[#4E876E]"
                            />

                            <p className="font-body text-[11px] font-semibold text-[#2D312E]/75">
                              {plan.planName}
                            </p>
                          </div>
                        </td>

                        {/* Goal */}
                        <td className="px-6 py-5 font-body text-[11px] text-[#2D312E]/60">
                          {plan.goal}
                        </td>

                        {/* Duration */}
                        <td className="px-6 py-5">
                          <p className="font-body text-[10px] text-[#2D312E]/60">
                            {plan.startDate}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 text-[#2D312E]/40">
                            <CalendarDays size={12} />

                            <span className="font-body text-[9px]">
                              to {plan.endDate}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <StatusBadge status={plan.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {/* View */}
                            <Link
                              href={`/nutritionist/nutrition-plans/${plan.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CCD6C4] px-3 py-2 font-body text-[10px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                            >
                              <Eye size={13} />
                              View
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/nutritionist/nutrition-plans/${plan.id}/edit`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#3D5A4C] px-3 py-2 font-body text-[10px] font-bold text-white transition hover:bg-[#334B40]"
                            >
                              <Pencil size={13} />
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {isLoading ? (
                <p className="py-8 text-center font-body text-[12px] text-[#2D312E]/40">
                  Loading nutrition plans…
                </p>
              ) : filteredPlans.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                    <ClipboardList size={21} />
                  </div>

                  <p className="mt-4 font-display text-[17px] text-[#2D312E]">
                    No nutrition plans found
                  </p>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                    Try changing your search or filter.
                  </p>
                </div>
              ) : (
                filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6]/50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                          <UserRound size={18} />
                        </div>

                        <div>
                          <p className="font-body text-[12px] font-bold text-[#2D312E]">
                            {plan.clientName}
                          </p>

                          <p className="font-body text-[9px] text-[#2D312E]/35">
                            Plan #{plan.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-body text-[10px] text-[#2D312E]/60">
                        <FileText size={15} />
                        {plan.planName}
                      </div>

                      <p className="font-body text-[10px] text-[#2D312E]/60">
                        Goal: {plan.goal}
                      </p>

                      <div className="flex items-center gap-2 font-body text-[10px] text-[#2D312E]/60">
                        <CalendarDays size={15} />
                        {plan.startDate} — {plan.endDate}
                      </div>

                      <StatusBadge status={plan.status} />

                      {/* Mobile Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {/* View */}
                        <Link
                          href={`/nutritionist/nutrition-plans/${plan.id}`}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-[#CCD6C4] px-3 py-2.5 font-body text-[10px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                        >
                          <Eye size={13} />
                          View
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/nutritionist/nutrition-plans/${plan.id}/edit`}
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#3D5A4C] px-3 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#334B40]"
                        >
                          <Pencil size={13} />
                          Edit
                        </Link>
                      </div>
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

/* Summary Card */

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

/* Status Badge */

function StatusBadge({
  status,
}: {
  status: NutritionPlanStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 font-body text-[9px] font-bold ${
        status === "Active"
          ? "bg-[#E9F0EC] text-[#3D5A4C]"
          : status === "Draft"
            ? "bg-[#DCC48E]/20 text-[#8A6D32]"
            : "bg-[#2D312E]/[0.08] text-[#2D312E]/60"
      }`}
    >
      {status}
    </span>
  );
}