"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Flame,
  Menu,
  Target,
  UserRound,
  Utensils,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type Meal = {
  name: string;
  time: string;
  foods: string[];
};

type NutritionPlan = {
  id: string;
  clientId: string;
  clientName: string;
  planName: string;
  description: string;
  calories: string;
  goal: string;
  dietType: string[];
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
  meals: Meal[];
  recommendations: string[];
};

const NUTRITION_PLANS: NutritionPlan[] = [
  {
    id: "NP-001",
    clientId: "1",
    clientName: "Hana Tesfaye",
    planName: "High-Protein Balanced Diet",
    description:
      "A balanced nutrition plan designed to support gradual weight management while providing enough protein, fiber, and essential nutrients.",
    calories: "1,800 kcal/day",
    goal: "Weight Management",
    dietType: ["High Protein", "Low Sugar", "Fiber Rich"],
    startDate: "Aug 1, 2026",
    endDate: "Aug 31, 2026",
    status: "Active",
    meals: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        foods: [
          "2 boiled eggs",
          "Whole grain bread",
          "Avocado",
          "Fresh fruit",
        ],
      },
      {
        name: "Morning Snack",
        time: "11:00 AM",
        foods: ["Greek yogurt", "Handful of almonds"],
      },
      {
        name: "Lunch",
        time: "1:30 PM",
        foods: [
          "Grilled chicken breast",
          "Brown rice",
          "Mixed vegetables",
          "Green salad",
        ],
      },
      {
        name: "Afternoon Snack",
        time: "4:30 PM",
        foods: ["Apple", "Plain yogurt"],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: [
          "Grilled fish",
          "Steamed vegetables",
          "Sweet potato",
        ],
      },
    ],
    recommendations: [
      "Drink at least 2.5L of water every day.",
      "Limit added sugar and highly processed foods.",
      "Include protein with every main meal.",
      "Do strength training twice per week.",
    ],
  },

  {
    id: "NP-002",
    clientId: "2",
    clientName: "Selam Alemu",
    planName: "Diabetes-Friendly Meal Plan",
    description:
      "A balanced meal plan focused on blood sugar management, portion control, and high-fiber foods.",
    calories: "1,700 kcal/day",
    goal: "Diabetes Nutrition",
    dietType: ["Low Sugar", "High Fiber", "Balanced"],
    startDate: "Aug 1, 2026",
    endDate: "Aug 31, 2026",
    status: "Active",
    meals: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        foods: ["Oatmeal", "Boiled egg", "Fresh berries"],
      },
      {
        name: "Morning Snack",
        time: "11:00 AM",
        foods: ["Plain yogurt", "Small handful of nuts"],
      },
      {
        name: "Lunch",
        time: "1:30 PM",
        foods: ["Grilled chicken", "Lentils", "Mixed vegetables"],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: ["Grilled fish", "Vegetable salad", "Sweet potato"],
      },
    ],
    recommendations: [
      "Monitor carbohydrate portions.",
      "Avoid sugary drinks.",
      "Eat meals at consistent times.",
      "Stay hydrated throughout the day.",
    ],
  },

  {
    id: "NP-003",
    clientId: "3",
    clientName: "Meron Kebede",
    planName: "Balanced Lifestyle Plan",
    description:
      "A flexible whole-food meal plan designed to maintain a healthy weight and support an active lifestyle.",
    calories: "2,000 kcal/day",
    goal: "Healthy Lifestyle",
    dietType: ["Balanced", "Whole Foods", "High Fiber"],
    startDate: "Aug 1, 2026",
    endDate: "Aug 31, 2026",
    status: "Active",
    meals: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        foods: ["Oatmeal", "Banana", "Greek yogurt"],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        foods: ["Chicken", "Brown rice", "Vegetables", "Salad"],
      },
      {
        name: "Snack",
        time: "4:00 PM",
        foods: ["Fresh fruit", "Yogurt"],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: ["Lentil stew", "Whole grain bread", "Vegetables"],
      },
    ],
    recommendations: [
      "Continue regular physical activity.",
      "Prioritize whole foods.",
      "Maintain adequate hydration.",
      "Keep meals balanced throughout the day.",
    ],
  },

  {
    id: "NP-004",
    clientId: "4",
    clientName: "Liya Michael",
    planName: "Balanced Weight Management Plan",
    description:
      "A moderate-calorie meal plan focused on sustainable weight management and healthier eating habits.",
    calories: "1,750 kcal/day",
    goal: "Weight Management",
    dietType: ["Balanced", "High Fiber", "Low Processed Foods"],
    startDate: "Aug 1, 2026",
    endDate: "Aug 31, 2026",
    status: "Inactive",
    meals: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        foods: ["Eggs", "Whole grain toast", "Fresh fruit"],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        foods: ["Chicken", "Brown rice", "Vegetables"],
      },
      {
        name: "Snack",
        time: "4:00 PM",
        foods: ["Fruit", "Plain yogurt"],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: ["Vegetable soup", "Grilled protein", "Salad"],
      },
    ],
    recommendations: [
      "Reduce highly processed foods.",
      "Drink enough water every day.",
      "Maintain regular physical activity.",
      "Follow recommended portion sizes.",
    ],
  },
];

export default function NutritionPlanDetailsPage() {
  const params = useParams();
  const planId = String(params.id);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const plan = NUTRITION_PLANS.find(
    (item) => item.id === planId
  );

  if (!plan) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <MobileHeader setSidebarOpen={setSidebarOpen} />

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="mx-auto max-w-4xl px-5 py-10 sm:px-7 lg:px-8">
            <Link
              href="/nutritionist/clients"
              className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E]"
            >
              <ArrowLeft size={15} />
              Back to Clients
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
                The nutrition plan you are looking for does not exist.
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
            href={`/nutritionist/clients/${plan.clientId}`}
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Client
          </Link>

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
                      {plan.planName}
                    </h1>

                    <span
                      className={`rounded-full px-2.5 py-1 font-body text-[9px] font-bold ${
                        plan.status === "Active"
                          ? "bg-[#E9F0EC] text-[#3D5A4C]"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>

                  <Link
                    href={`/nutritionist/clients/${plan.clientId}`}
                    className="mt-2 flex items-center gap-1.5 font-body text-[10px] font-semibold text-[#4E876E]"
                  >
                    <UserRound size={12} />
                    {plan.clientName}
                  </Link>
                </div>
              </div>

              <Link
                href={`/nutritionist/nutrition-plans/${plan.id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#334B40]"
              >
                <FileText size={14} />
                Edit Meal Plan
              </Link>
            </div>
          </section>

          {/* Summary */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              icon={<Flame size={17} />}
              label="Daily Calories"
              value={plan.calories}
            />

            <SummaryCard
              icon={<Target size={17} />}
              label="Goal"
              value={plan.goal}
            />

            <SummaryCard
              icon={<CalendarDays size={17} />}
              label="Start Date"
              value={plan.startDate}
            />

            <SummaryCard
              icon={<Clock3 size={17} />}
              label="End Date"
              value={plan.endDate}
            />

          </section>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">

            {/* LEFT */}
            <div className="space-y-6">

              {/* Description */}
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
                      About this nutrition plan
                    </p>
                  </div>
                </div>

                <p className="font-body text-[11px] leading-6 text-[#2D312E]/60">
                  {plan.description}
                </p>

                <div className="mt-5">
                  <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                    Diet Type
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {plan.dietType.map((type) => (
                      <span
                        key={type}
                        className="rounded-full border border-[#CCD6C4] bg-white px-3 py-1.5 font-body text-[9px] font-semibold text-[#3D5A4C]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
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
                      Recommended meals for the client
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {plan.meals.map((meal) => (
                    <div
                      key={meal.name}
                      className="rounded-xl border border-[#2D312E]/[0.06] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-body text-[12px] font-bold">
                            {meal.name}
                          </h3>

                          <p className="mt-1 flex items-center gap-1.5 font-body text-[10px] text-[#2D312E]/40">
                            <Clock3 size={11} />
                            {meal.time}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {meal.foods.map((food) => (
                          <div
                            key={food}
                            className="flex items-center gap-2 rounded-lg bg-[#FAF9F6] px-3 py-2.5"
                          >
                            <CheckCircle2
                              size={13}
                              className="flex-shrink-0 text-[#4E876E]"
                            />

                            <span className="font-body text-[10px] text-[#2D312E]/65">
                              {food}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* Nutrition Information */}
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
                      Current plan targets
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  <InfoRow
                    label="Daily Calories"
                    value={plan.calories}
                  />

                  <InfoRow
                    label="Goal"
                    value={plan.goal}
                  />

                  <InfoRow
                    label="Start Date"
                    value={plan.startDate}
                  />

                  <InfoRow
                    label="End Date"
                    value={plan.endDate}
                  />

                </div>
              </section>

              {/* Recommendations */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <CheckCircle2 size={17} />
                  </div>

                  <div>
                    <h2 className="font-display text-[19px]">
                      Recommendations
                    </h2>

                    <p className="font-body text-[10px] text-[#2D312E]/40">
                      Nutritionist recommendations
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.recommendations.map((recommendation) => (
                    <div
                      key={recommendation}
                      className="flex gap-3 rounded-xl bg-[#FAF9F6] p-3"
                    >
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-[#4E876E]"
                      />

                      <p className="font-body text-[10px] leading-5 text-[#2D312E]/60">
                        {recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Client */}
              <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-display text-[19px]">
                  Client
                </h2>

                <Link
                  href={`/nutritionist/clients/${plan.clientId}`}
                  className="mt-4 flex items-center gap-3 rounded-xl bg-[#FAF9F6] p-4 transition hover:bg-[#E9F0EC]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                    <UserRound size={17} />
                  </div>

                  <div>
                    <p className="font-body text-[11px] font-bold">
                      {plan.clientName}
                    </p>

                    <p className="font-body mt-1 text-[9px] text-[#2D312E]/40">
                      View client profile
                    </p>
                  </div>
                </Link>
              </section>

            </div>
          </div>
        </div>
      </div>
    </main>
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

      <p className="font-display mt-4 text-[18px] text-[#2D312E]">
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

      <span className="font-body text-[10px] font-bold text-[#3D5A4C]">
        {value}
      </span>
    </div>
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