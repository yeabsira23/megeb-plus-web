"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ClipboardList,
  Loader2,
  Menu,
  MessageSquare,
  UserRound,
  Utensils,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type NutritionPlan = {
  id: string;
  clientId: string;
  clientName: string;
  planName: string;
  goal: string;
  startDate: string;
  endDate: string;
  calories: string;
  preferences: string;
  allergies: string;
  mealPlan: string;
  notes: string;
};

const GOALS = [
  "Weight Management",
  "Healthy Weight Gain",
  "Balanced Nutrition",
  "Diabetes Management",
  "Heart Health",
  "Improved Energy",
  "General Wellness",
];

const TEMPORARY_NUTRITION_PLANS: NutritionPlan[] = [
  {
    id: "NP-001",
    clientId: "1",
    clientName: "Hana Tesfaye",
    planName: "Healthy Weight Management",
    goal: "Weight Management",
    startDate: "2026-08-12",
    endDate: "2026-09-12",
    calories: "1800",
    preferences: "High-protein, high-fiber, low-sugar",
    allergies: "No known allergies",
    mealPlan: `Breakfast: Oatmeal with berries and Greek yogurt
Lunch: Grilled chicken, brown rice and vegetables
Snack: Fresh fruit and a handful of almonds
Dinner: Grilled fish with vegetables and whole grains`,
    notes:
      "Focus on gradual and sustainable weight loss. Encourage adequate hydration and consistent meal timing.",
  },
  {
    id: "NP-002",
    clientId: "2",
    clientName: "Selam Alemu",
    planName: "Balanced Nutrition Plan",
    goal: "Balanced Nutrition",
    startDate: "2026-08-05",
    endDate: "2026-09-05",
    calories: "1700",
    preferences: "Balanced, high-fiber, low-sugar",
    allergies: "No known allergies",
    mealPlan: `Breakfast: Whole grain toast, eggs and avocado
Lunch: Grilled chicken, vegetables and brown rice
Snack: Greek yogurt and fresh fruit
Dinner: Lentil stew with vegetables and whole grains`,
    notes:
      "Monitor portion sizes and maintain consistent carbohydrate intake throughout the day.",
  },
  {
    id: "NP-003",
    clientId: "3",
    clientName: "Meron Kebede",
    planName: "Energy & Wellness Plan",
    goal: "Improved Energy",
    startDate: "2026-07-20",
    endDate: "2026-08-20",
    calories: "2000",
    preferences: "Whole foods, high-fiber, balanced",
    allergies: "Peanuts",
    mealPlan: `Breakfast: Eggs, whole grain toast and fresh fruit
Lunch: Grilled chicken, quinoa and mixed vegetables
Snack: Greek yogurt with berries
Dinner: Baked fish, sweet potato and vegetables`,
    notes:
      "Continue regular physical activity and maintain a balanced intake of protein, carbohydrates and healthy fats.",
  },
  {
    id: "NP-004",
    clientId: "4",
    clientName: "Liya Michael",
    planName: "Healthy Weight Gain Plan",
    goal: "Healthy Weight Gain",
    startDate: "2026-08-18",
    endDate: "2026-10-18",
    calories: "2200",
    preferences: "High-calorie, protein-rich, nutrient-dense",
    allergies: "No known allergies",
    mealPlan: `Breakfast: Oatmeal with banana, peanut butter and milk
Lunch: Chicken, rice, avocado and vegetables
Snack: Greek yogurt, fruit and nuts
Dinner: Beef or lentil stew with whole grains and vegetables`,
    notes:
      "Increase calorie intake gradually using nutrient-dense foods while maintaining adequate protein intake.",
  },
  {
    id: "NP-005",
    clientId: "1",
    clientName: "Hana Tesfaye",
    planName: "Heart Healthy Nutrition",
    goal: "Heart Health",
    startDate: "2026-08-10",
    endDate: "2026-09-10",
    calories: "1800",
    preferences: "Low-sodium, high-fiber, heart-healthy",
    allergies: "No known allergies",
    mealPlan: `Breakfast: Oatmeal with berries and low-fat yogurt
Lunch: Grilled fish, brown rice and steamed vegetables
Snack: Fresh fruit and unsalted nuts
Dinner: Lentil soup with whole grain bread and vegetables`,
    notes:
      "Prioritize whole foods and limit highly processed and high-sodium foods.",
  },
  {
    id: "NP-006",
    clientId: "3",
    clientName: "Meron Kebede",
    planName: "General Wellness Plan",
    goal: "General Wellness",
    startDate: "2026-07-01",
    endDate: "2026-08-01",
    calories: "2000",
    preferences: "Balanced, whole foods, high-fiber",
    allergies: "Peanuts",
    mealPlan: `Breakfast: Eggs, whole grain toast and fruit
Lunch: Chicken, rice and mixed vegetables
Snack: Yogurt and fresh fruit
Dinner: Fish, potatoes and steamed vegetables`,
    notes:
      "Maintain a balanced eating pattern and continue regular physical activity.",
  },
];

export default function EditNutritionPlanPage() {
  const params = useParams();
  const router = useRouter();

  const planId = String(params.id);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [clientName, setClientName] = useState("");
  const [planName, setPlanName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calories, setCalories] = useState("");
  const [preferences, setPreferences] = useState("");
  const [allergies, setAllergies] = useState("");
  const [mealPlan, setMealPlan] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadNutritionPlan() {
      setIsLoading(true);

      try {
        /*
         * TEMPORARY MOCK DATA
         *
         * Later replace this with:
         *
         * const data = await apiFetch<NutritionPlan>(
         *   `/nutritionist/nutrition-plans/${planId}`
         * );
         */

        await new Promise((resolve) => setTimeout(resolve, 300));

        const plan = TEMPORARY_NUTRITION_PLANS.find(
          (item) => item.id === planId
        );

        if (!isMounted) return;

        if (!plan) {
          setNotFound(true);
          return;
        }

        setClientName(plan.clientName);
        setPlanName(plan.planName);
        setGoal(plan.goal);
        setStartDate(plan.startDate);
        setEndDate(plan.endDate);
        setCalories(plan.calories);
        setPreferences(plan.preferences);
        setAllergies(plan.allergies);
        setMealPlan(plan.mealPlan);
        setNotes(plan.notes);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadNutritionPlan();

    return () => {
      isMounted = false;
    };
  }, [planId]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccess(false);

    /*
     * TEMPORARY
     *
     * Later this will be replaced with the backend API request.
     *
     * Example:
     *
     * await apiFetch(`/nutritionist/nutrition-plans/${planId}`, {
     *   method: "PUT",
     *   body: JSON.stringify({
     *     planName,
     *     goal,
     *     startDate,
     *     endDate,
     *     calories,
     *     preferences,
     *     allergies,
     *     mealPlan,
     *     notes,
     *   }),
     * });
     */

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/nutritionist/nutrition-plans");
      }, 1000);
    }, 700);
  }

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
                <Loader2 size={21} className="animate-spin" />
              </div>

              <h2 className="font-display mt-4 text-[20px]">
                Loading nutrition plan...
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                Please wait while the plan is loaded.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <MobileHeader setSidebarOpen={setSidebarOpen} />

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-7 lg:px-8">
            <Link
              href="/nutritionist/nutrition-plans"
              className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] hover:text-[#3D5A4C]"
            >
              <ArrowLeft size={15} />
              Back to Nutrition Plans
            </Link>

            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white px-6 py-12 text-center shadow-sm">
              <ClipboardList
                size={28}
                className="mx-auto text-[#4E876E]"
              />

              <h1 className="font-display mt-4 text-[22px]">
                Nutrition plan not found
              </h1>

              <p className="font-body mt-2 text-[11px] text-[#2D312E]/40">
                The nutrition plan you are trying to edit does not exist.
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
            href="/nutritionist/nutrition-plans"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Nutrition Plans
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <ClipboardList size={21} />
            </div>

            <h1 className="font-display text-[30px] text-[#2D312E]">
              Edit Nutrition Plan
            </h1>

            <p className="font-body mt-2 text-[12px] text-[#2D312E]/45">
              Update this personalized nutrition plan for your client.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#CCD6C4] bg-[#E9F0EC] p-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#3D5A4C] text-white">
                <Check size={15} />
              </div>

              <div>
                <p className="font-body text-[11px] font-bold text-[#3D5A4C]">
                  Nutrition plan updated successfully
                </p>

                <p className="font-body mt-1 text-[10px] text-[#3D5A4C]/60">
                  Your changes have been saved.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm"
          >
            {/* Plan Details */}
            <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <ClipboardList size={17} />
                </div>

                <div>
                  <h2 className="font-display text-[19px]">
                    Plan Details
                  </h2>

                  <p className="font-body text-[10px] text-[#2D312E]/40">
                    Define the purpose and duration of the plan.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Client Name */}
                <label className="block sm:col-span-2">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Client Name
                  </span>

                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#2D312E]/[0.08] bg-[#F3F5F2] px-4 py-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                      <UserRound size={15} />
                    </div>

                    <span className="font-body text-[11px] font-semibold text-[#2D312E]">
                      {clientName}
                    </span>
                  </div>
                </label>

                {/* Plan Name */}
                <label className="block sm:col-span-2">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Plan Name
                  </span>

                  <input
                    required
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="e.g. Healthy Weight Management Plan"
                    className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                  />
                </label>

                {/* Goal */}
                <label className="block sm:col-span-2">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Nutrition Goal
                  </span>

                  <select
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] text-[#2D312E] outline-none focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                  >
                    <option value="">Select a goal</option>

                    {GOALS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Start Date */}
                <label className="block">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Start Date
                  </span>

                  <div className="relative mt-2">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
                    />

                    <input
                      required
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px] text-[#2D312E] outline-none focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </div>
                </label>

                {/* End Date */}
                <label className="block">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    End Date
                  </span>

                  <div className="relative mt-2">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
                    />

                    <input
                      required
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px] text-[#2D312E] outline-none focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </div>
                </label>

                {/* Calories */}
                <label className="block sm:col-span-2">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Daily Calorie Target
                  </span>

                  <div className="relative mt-2">
                    <input
                      required
                      type="number"
                      min="1"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      placeholder="e.g. 1800"
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pr-20 font-body text-[11px] text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-body text-[10px] text-[#2D312E]/35">
                      kcal / day
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Dietary Information */}
            <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Utensils size={17} />
                </div>

                <div>
                  <h2 className="font-display text-[19px]">
                    Dietary Information
                  </h2>

                  <p className="font-body text-[10px] text-[#2D312E]/40">
                    Add dietary preferences and restrictions.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Preferences */}
                <label className="block">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Dietary Preferences
                  </span>

                  <textarea
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="e.g. Vegetarian, high-protein, low-sodium..."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                  />
                </label>

                {/* Allergies */}
                <label className="block">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Allergies / Restrictions
                  </span>

                  <textarea
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="List any food allergies, intolerances, or restrictions..."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                  />
                </label>
              </div>
            </div>

            {/* Meal Plan */}
            <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Utensils size={17} />
                </div>

                <div>
                  <h2 className="font-display text-[19px]">
                    Meal Plan
                  </h2>

                  <p className="font-body text-[10px] text-[#2D312E]/40">
                    Add the meal recommendations for this client.
                  </p>
                </div>
              </div>

              <label className="block">
                <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                  Meal Plan Details
                </span>

                <textarea
                  required
                  value={mealPlan}
                  onChange={(e) => setMealPlan(e.target.value)}
                  placeholder={`Breakfast: Oatmeal with fruit and yogurt
Lunch: Grilled chicken, rice and vegetables
Snack: Fresh fruit and nuts
Dinner: Fish with vegetables and whole grains`}
                  rows={8}
                  className="mt-2 w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-6 text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                />
              </label>
            </div>

            {/* Notes */}
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <MessageSquare size={17} />
                </div>

                <div>
                  <h2 className="font-display text-[19px]">
                    Additional Notes
                  </h2>

                  <p className="font-body text-[10px] text-[#2D312E]/40">
                    Add any other information for this nutrition plan.
                  </p>
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add additional notes..."
                rows={4}
                className="w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
              />

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/nutritionist/nutrition-plans"
                  className="flex items-center justify-center rounded-xl border border-[#CCD6C4] px-6 py-3 font-body text-[11px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 font-body text-[11px] font-bold text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ClipboardList size={15} />

                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
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
        <div className="flex items-center">
          <span className="font-display text-[27px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[33px] font-black leading-none text-[#DCC48E]">
            +
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