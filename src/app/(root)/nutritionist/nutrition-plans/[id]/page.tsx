"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Flame,
  Menu,
  Target,
  Trash2,
  UserRound,
  Utensils,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import apiClient from "@/app/libs/api/client";

type NutritionPlanStatus = "Draft" | "Active" | "Completed";

type Nutrition = {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
};

type MealItem = {
  id: number;
  food: number;
  food_name: string;
  quantity: string;
  nutrition: Nutrition;
};

type Meal = {
  id: number;
  name: string;
  meal_type: "Breakfast" | "Snack" | "Lunch" | "Dinner";
  source: "library" | "custom";
  order: number;
  items: MealItem[];
  nutrition: Nutrition;
};

type NutritionPlan = {
  id: number;
  client: number;
  client_name: string;
  nutritionist: number;
  nutritionist_name: string;
  plan_name: string;
  goal: string;
  start_date: string;
  end_date: string;
  target_calories: string;
  notes: string;
  status: NutritionPlanStatus;
  meals: Meal[];
  nutrition: Nutrition;
  created_at: string;
  updated_at: string;
};

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function number(value: string | number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: string | number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(number(value));
}

export default function NutritionPlanDetailsPage() {
  const params = useParams();
  const planId = String(params.id);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plan, setPlan] = useState<NutritionPlan | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isApproving, setIsApproving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPlan() {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await apiClient.get<NutritionPlan>(
            `/api/nutritionist/nutrition-plans/${planId}/`
          );

        if (mounted) {
          setPlan(response.data);
        }
      } catch (error) {
        console.error("Unable to load nutrition plan:", error);

        if (mounted) {
          setError(
            "The nutrition plan could not be loaded."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    if (planId) {
      loadPlan();
    }

    return () => {
      mounted = false;
    };
  }, [planId]);

  async function approvePlan() {
    if (!plan || plan.status !== "Draft") return;

    try {
      setIsApproving(true);
      setError(null);

      const response =
        await apiClient.post<NutritionPlan>(
          `/api/nutritionist/nutrition-plans/${plan.id}/approve/`,
          {}
        );

      setPlan(response.data);
    } catch (error: any) {
      console.error("Unable to approve plan:", error);

      setError(
        error?.response?.data?.detail ||
          "Unable to approve this nutrition plan."
      );
    } finally {
      setIsApproving(false);
    }
  }

  async function deletePlan() {
    if (!plan) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this nutrition plan?"
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError(null);

      await apiClient.delete(
        `/api/nutritionist/nutrition-plans/${plan.id}/`
      );

      window.location.href =
        "/nutritionist/nutrition-plans";
    } catch (error) {
      console.error("Unable to delete nutrition plan:", error);

      setError(
        "Unable to delete this nutrition plan."
      );

      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <PageShell sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-12 text-center shadow-sm">
          <Utensils
            size={28}
            className="mx-auto animate-pulse text-[#4E876E]"
          />

          <p className="font-body mt-4 text-[12px] text-[#2D312E]/40">
            Loading nutrition plan…
          </p>
        </div>
      </PageShell>
    );
  }

  if (!plan) {
    return (
      <PageShell sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <Link
          href="/nutritionist/nutrition-plans"
          className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E]"
        >
          <ArrowLeft size={15} />
          Back to Nutrition Plans
        </Link>

        <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-10 text-center shadow-sm">
          <Utensils
            size={30}
            className="mx-auto text-[#4E876E]"
          />

          <h1 className="font-display mt-4 text-[22px]">
            Meal Plan Not Found
          </h1>

          <p className="font-body mt-2 text-[11px] text-[#2D312E]/40">
            {error ||
              "The nutrition plan you are looking for does not exist."}
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <Link
        href="/nutritionist/nutrition-plans"
        className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] hover:text-[#3D5A4C]"
      >
        <ArrowLeft size={15} />
        Back to Nutrition Plans
      </Link>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="font-body text-[10px] font-semibold text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Header */}
      <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <Utensils size={27} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-[25px]">
                  {plan.plan_name}
                </h1>

                <StatusBadge status={plan.status} />
              </div>

              <Link
                href={`/nutritionist/clients/${plan.client}`}
                className="mt-2 flex items-center gap-1.5 font-body text-[10px] font-semibold text-[#4E876E]"
              >
                <UserRound size={12} />
                {plan.client_name}
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {plan.status === "Draft" && (
              <>
                <Link
                  href={`/nutritionist/nutrition-plans/${plan.id}/edit`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#334B40]"
                >
                  <FileText size={14} />
                  Edit Plan
                </Link>

                <button
                  type="button"
                  onClick={approvePlan}
                  disabled={isApproving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] bg-white px-4 py-2.5 font-body text-[10px] font-bold text-[#3D5A4C] disabled:opacity-50"
                >
                  <Check size={14} />
                  {isApproving
                    ? "Approving..."
                    : "Approve Plan"}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={deletePlan}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 font-body text-[10px] font-bold text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={14} />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<Flame size={17} />}
          label="Daily Calories"
          value={`${formatNumber(plan.target_calories)} kcal`}
        />

        <SummaryCard
          icon={<Target size={17} />}
          label="Goal"
          value={plan.goal}
        />

        <SummaryCard
          icon={<CalendarDays size={17} />}
          label="Start Date"
          value={formatDate(plan.start_date)}
        />

        <SummaryCard
          icon={<Clock3 size={17} />}
          label="End Date"
          value={formatDate(plan.end_date)}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Notes */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                <FileText size={17} />
              </div>

              <div>
                <h2 className="font-display text-[19px]">
                  Plan Overview
                </h2>

                <p className="font-body text-[10px] text-[#2D312E]/40">
                  Notes and instructions for this plan
                </p>
              </div>
            </div>

            <p className="font-body whitespace-pre-wrap text-[11px] leading-6 text-[#2D312E]/60">
              {plan.notes || "No additional notes provided."}
            </p>
          </section>

          {/* Meals */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                <Utensils size={17} />
              </div>

              <div>
                <h2 className="font-display text-[19px]">
                  Daily Meal Plan
                </h2>

                <p className="font-body text-[10px] text-[#2D312E]/40">
                  Recommended meal options
                </p>
              </div>
            </div>

            {plan.meals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#CCD6C4] bg-[#FAF9F6] p-8 text-center">
                <Utensils
                  size={23}
                  className="mx-auto text-[#4E876E]"
                />

                <p className="font-body mt-3 text-[10px] text-[#2D312E]/40">
                  No meals have been added to this plan.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {plan.meals
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((meal) => (
                    <div
                      key={meal.id}
                      className="rounded-xl border border-[#2D312E]/[0.06] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-body text-[12px] font-bold">
                            {meal.name}
                          </h3>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-full bg-[#E9F0EC] px-2 py-1 font-body text-[7px] font-bold uppercase tracking-wider text-[#3D5A4C]">
                              {meal.meal_type}
                            </span>

                            <span className="font-body text-[8px] text-[#2D312E]/35">
                              {meal.source === "library"
                                ? "Meal Library"
                                : "Custom"}
                            </span>
                          </div>
                        </div>

                        <span className="rounded-lg bg-[#E9F0EC] px-2 py-1 font-body text-[8px] font-bold text-[#3D5A4C]">
                          {formatNumber(meal.nutrition.calories)} kcal
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {meal.items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg bg-[#FAF9F6] px-3 py-2.5"
                          >
                            <div className="flex items-start gap-2">
                              <CheckCircle2
                                size={13}
                                className="mt-0.5 flex-shrink-0 text-[#4E876E]"
                              />

                              <div>
                                <p className="font-body text-[10px] font-semibold">
                                  {item.food_name}
                                </p>

                                <p className="font-body mt-1 text-[8px] text-[#2D312E]/40">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-5 gap-2">
                        <MiniNutrition
                          label="Kcal"
                          value={formatNumber(
                            meal.nutrition.calories
                          )}
                        />

                        <MiniNutrition
                          label="Protein"
                          value={`${formatNumber(
                            meal.nutrition.protein
                          )}g`}
                        />

                        <MiniNutrition
                          label="Carbs"
                          value={`${formatNumber(
                            meal.nutrition.carbs
                          )}g`}
                        />

                        <MiniNutrition
                          label="Fat"
                          value={`${formatNumber(
                            meal.nutrition.fat
                          )}g`}
                        />

                        <MiniNutrition
                          label="Fiber"
                          value={`${formatNumber(
                            meal.nutrition.fiber
                          )}g`}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Nutrition */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                <Target size={17} />
              </div>

              <div>
                <h2 className="font-display text-[19px]">
                  Nutrition Information
                </h2>

                <p className="font-body text-[10px] text-[#2D312E]/40">
                  Calculated nutrition from the backend
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NutritionBox
                label="Calories"
                value={formatNumber(plan.nutrition.calories)}
                unit="kcal"
              />

              <NutritionBox
                label="Protein"
                value={formatNumber(plan.nutrition.protein)}
                unit="g"
              />

              <NutritionBox
                label="Carbs"
                value={formatNumber(plan.nutrition.carbs)}
                unit="g"
              />

              <NutritionBox
                label="Fat"
                value={formatNumber(plan.nutrition.fat)}
                unit="g"
              />

              <NutritionBox
                label="Fiber"
                value={formatNumber(plan.nutrition.fiber)}
                unit="g"
              />

              <NutritionBox
                label="Target"
                value={formatNumber(plan.target_calories)}
                unit="kcal"
              />
            </div>
          </section>

          {/* Plan */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-display text-[19px]">
              Plan Information
            </h2>

            <div className="mt-4 space-y-3">
              <InfoRow
                label="Goal"
                value={plan.goal}
              />

              <InfoRow
                label="Start Date"
                value={formatDate(plan.start_date)}
              />

              <InfoRow
                label="End Date"
                value={formatDate(plan.end_date)}
              />

              <InfoRow
                label="Status"
                value={plan.status}
              />

              <InfoRow
                label="Nutritionist"
                value={plan.nutritionist_name}
              />
            </div>
          </section>

          {/* Client */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-display text-[19px]">
              Client
            </h2>

            <Link
              href={`/nutritionist/clients/${plan.client}`}
              className="mt-4 flex items-center gap-3 rounded-xl bg-[#FAF9F6] p-4 transition hover:bg-[#E9F0EC]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                <UserRound size={17} />
              </div>

              <div>
                <p className="font-body text-[11px] font-bold">
                  {plan.client_name}
                </p>

                <p className="font-body mt-1 text-[9px] text-[#2D312E]/40">
                  View client profile
                </p>
              </div>
            </Link>
          </section>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({
  children,
  sidebarOpen,
  setSidebarOpen,
}: {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
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
        >
          <Menu size={22} />
        </button>
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {children}
        </div>
      </div>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: NutritionPlanStatus;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 font-body text-[9px] font-bold ${
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

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
          {icon}
        </div>

        <span className="font-body text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/30">
          {label}
        </span>
      </div>

      <p className="font-display mt-4 text-[18px]">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#FAF9F6] px-4 py-3">
      <span className="font-body text-[10px] text-[#2D312E]/45">
        {label}
      </span>

      <span className="font-body text-right text-[10px] font-bold text-[#3D5A4C]">
        {value}
      </span>
    </div>
  );
}

function MiniNutrition({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-[#F3F5F2] px-2 py-2 text-center">
      <p className="font-body text-[7px] font-bold uppercase tracking-wider text-[#2D312E]/35">
        {label}
      </p>

      <p className="font-body mt-1 text-[9px] font-bold text-[#3D5A4C]">
        {value}
      </p>
    </div>
  );
}

function NutritionBox({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl bg-[#FAF9F6] p-4">
      <p className="font-body text-[8px] font-bold uppercase tracking-wider text-[#2D312E]/35">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-[19px] text-[#3D5A4C]">
          {value}
        </span>

        <span className="font-body text-[8px] text-[#2D312E]/40">
          {unit}
        </span>
      </div>
    </div>
  );
}