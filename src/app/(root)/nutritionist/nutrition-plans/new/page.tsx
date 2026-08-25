"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ClipboardList,
  Menu,
  MessageSquare,
  UserRound,
  Utensils,
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

const GOALS = [
  "Weight Management",
  "Healthy Weight Gain",
  "Balanced Nutrition",
  "Diabetes Management",
  "Heart Health",
  "Improved Energy",
  "General Wellness",
];

export default function CreateNutritionPlanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [clientId, setClientId] = useState("");
  const [planName, setPlanName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calories, setCalories] = useState("");
  const [preferences, setPreferences] = useState("");
  const [allergies, setAllergies] = useState("");
  const [mealPlan, setMealPlan] = useState("");
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
     * Later this will be replaced with the backend API request.
     *
     * Example:
     *
     * await apiFetch("/nutritionist/nutrition-plans", {
     *   method: "POST",
     *   body: JSON.stringify({
     *     client: clientId,
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
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
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

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-4xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Back */}
          <Link
            href="/nutritionist/nutrition-plans"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Nutrition Plans
          </Link>

          {/* Header */}
          <div className="mb-7">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <ClipboardList size={21} />
            </div>

            <h1 className="font-display text-[30px] text-[#2D312E]">
              Create Nutrition Plan
            </h1>

            <p className="font-body mt-2 text-[12px] text-[#2D312E]/45">
              Create a personalized nutrition plan for your client.
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
                  Nutrition plan created successfully
                </p>

                <p className="font-body mt-1 text-[10px] text-[#3D5A4C]/60">
                  This is currently a mock plan. It will be connected to the
                  backend later.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm"
          >
            {/* Client Information */}
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
                    Select the client this plan is for.
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
                    className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                    className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-4 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-4 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                      type="number"
                      min="0"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      placeholder="e.g. 1800"
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pr-20 font-body text-[11px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                    className="mt-2 w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                    className="mt-2 w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                  className="mt-2 w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-6 text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                className="w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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

                  {isSubmitting
                    ? "Creating..."
                    : "Create Nutrition Plan"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}