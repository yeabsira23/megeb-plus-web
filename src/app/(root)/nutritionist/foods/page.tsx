"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Filter,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type FoodCategory =
  | "All"
  | "Grains"
  | "Protein"
  | "Fruits"
  | "Vegetables"
  | "Dairy"
  | "Legumes"
  | "Nuts & Seeds";

type Food = {
  id: string;
  name: string;
  category: Exclude<FoodCategory, "All">;
  serving: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
};

const CATEGORIES: FoodCategory[] = [
  "All",
  "Grains",
  "Protein",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Legumes",
  "Nuts & Seeds",
];

/*
 * TEMPORARY FOOD DATABASE
 *
 * This is mock data for the frontend.
 *
 * Later this will come from:
 *
 * PostgreSQL
 *    ↓
 * Django REST API
 *    ↓
 * Next.js Food Database
 *
 * The nutritionist will NOT type these values when
 * creating a meal. The system will retrieve them
 * from the food database.
 */
const TEMPORARY_FOODS: Food[] = [
  {
    id: "FOOD-001",
    name: "Egg",
    category: "Protein",
    serving: "1 egg",
    calories: 70,
    protein: 6,
    carbohydrates: 0.4,
    fat: 5,
    fiber: 0,
  },
  {
    id: "FOOD-002",
    name: "Chicken Breast",
    category: "Protein",
    serving: "100 g",
    calories: 165,
    protein: 31,
    carbohydrates: 0,
    fat: 3.6,
    fiber: 0,
  },
  {
    id: "FOOD-003",
    name: "Fish",
    category: "Protein",
    serving: "100 g",
    calories: 130,
    protein: 26,
    carbohydrates: 0,
    fat: 2.5,
    fiber: 0,
  },
  {
    id: "FOOD-004",
    name: "Beef",
    category: "Protein",
    serving: "100 g",
    calories: 250,
    protein: 26,
    carbohydrates: 0,
    fat: 17,
    fiber: 0,
  },
  {
    id: "FOOD-005",
    name: "Injera",
    category: "Grains",
    serving: "100 g",
    calories: 170,
    protein: 5,
    carbohydrates: 35,
    fat: 1,
    fiber: 2,
  },
  {
    id: "FOOD-006",
    name: "Brown Rice",
    category: "Grains",
    serving: "100 g",
    calories: 123,
    protein: 2.7,
    carbohydrates: 25.6,
    fat: 1,
    fiber: 1.6,
  },
  {
    id: "FOOD-007",
    name: "Oatmeal",
    category: "Grains",
    serving: "100 g",
    calories: 389,
    protein: 16.9,
    carbohydrates: 66.3,
    fat: 6.9,
    fiber: 10.6,
  },
  {
    id: "FOOD-008",
    name: "Whole Wheat Bread",
    category: "Grains",
    serving: "1 slice",
    calories: 80,
    protein: 4,
    carbohydrates: 14,
    fat: 1.2,
    fiber: 2.5,
  },
  {
    id: "FOOD-009",
    name: "Avocado",
    category: "Fruits",
    serving: "100 g",
    calories: 160,
    protein: 2,
    carbohydrates: 8.5,
    fat: 15,
    fiber: 6.7,
  },
  {
    id: "FOOD-010",
    name: "Banana",
    category: "Fruits",
    serving: "1 medium",
    calories: 105,
    protein: 1.3,
    carbohydrates: 27,
    fat: 0.4,
    fiber: 3.1,
  },
  {
    id: "FOOD-011",
    name: "Apple",
    category: "Fruits",
    serving: "1 medium",
    calories: 95,
    protein: 0.5,
    carbohydrates: 25,
    fat: 0.3,
    fiber: 4.4,
  },
  {
    id: "FOOD-012",
    name: "Orange",
    category: "Fruits",
    serving: "1 medium",
    calories: 62,
    protein: 1.2,
    carbohydrates: 15.4,
    fat: 0.2,
    fiber: 3.1,
  },
  {
    id: "FOOD-013",
    name: "Tomato",
    category: "Vegetables",
    serving: "100 g",
    calories: 18,
    protein: 0.9,
    carbohydrates: 3.9,
    fat: 0.2,
    fiber: 1.2,
  },
  {
    id: "FOOD-014",
    name: "Carrot",
    category: "Vegetables",
    serving: "100 g",
    calories: 41,
    protein: 0.9,
    carbohydrates: 9.6,
    fat: 0.2,
    fiber: 2.8,
  },
  {
    id: "FOOD-015",
    name: "Spinach",
    category: "Vegetables",
    serving: "100 g",
    calories: 23,
    protein: 2.9,
    carbohydrates: 3.6,
    fat: 0.4,
    fiber: 2.2,
  },
  {
    id: "FOOD-016",
    name: "Broccoli",
    category: "Vegetables",
    serving: "100 g",
    calories: 34,
    protein: 2.8,
    carbohydrates: 7,
    fat: 0.4,
    fiber: 2.6,
  },
  {
    id: "FOOD-017",
    name: "Milk",
    category: "Dairy",
    serving: "1 cup",
    calories: 122,
    protein: 8.1,
    carbohydrates: 12,
    fat: 4.8,
    fiber: 0,
  },
  {
    id: "FOOD-018",
    name: "Greek Yogurt",
    category: "Dairy",
    serving: "100 g",
    calories: 59,
    protein: 10,
    carbohydrates: 3.6,
    fat: 0.4,
    fiber: 0,
  },
  {
    id: "FOOD-019",
    name: "Lentils",
    category: "Legumes",
    serving: "100 g cooked",
    calories: 116,
    protein: 9,
    carbohydrates: 20,
    fat: 0.4,
    fiber: 7.9,
  },
  {
    id: "FOOD-020",
    name: "Chickpeas",
    category: "Legumes",
    serving: "100 g cooked",
    calories: 164,
    protein: 8.9,
    carbohydrates: 27.4,
    fat: 2.6,
    fiber: 7.6,
  },
  {
    id: "FOOD-021",
    name: "Almonds",
    category: "Nuts & Seeds",
    serving: "30 g",
    calories: 174,
    protein: 6.4,
    carbohydrates: 6.1,
    fat: 15,
    fiber: 3.2,
  },
  {
    id: "FOOD-022",
    name: "Peanuts",
    category: "Nuts & Seeds",
    serving: "30 g",
    calories: 170,
    protein: 7.3,
    carbohydrates: 4.8,
    fat: 14.6,
    fiber: 2.4,
  },
];

export default function FoodDatabasePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FoodCategory>("All");

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();

    return TEMPORARY_FOODS.filter((food) => {
      const matchesSearch =
        query.length === 0 ||
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        food.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

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
            href="/nutritionist/dashboard"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <Database size={21} />
            </div>

            <h1 className="font-display text-[30px] text-[#2D312E]">
              Food Database
            </h1>

            <p className="font-body mt-2 max-w-2xl text-[12px] leading-5 text-[#2D312E]/45">
              Browse foods and their nutritional information to use when
              creating personalized meals and nutrition plans.
            </p>
          </div>

          {/* Information Card */}
          <div className="mb-6 rounded-2xl border border-[#CCD6C4] bg-[#E9F0EC] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D5A4C] text-white">
                <Database size={16} />
              </div>

              <div>
                <h2 className="font-body text-[11px] font-bold text-[#3D5A4C]">
                  Nutrition information
                </h2>

                <p className="font-body mt-1 text-[10px] leading-5 text-[#3D5A4C]/65">
                  Nutrition values are provided by the food database. When
                  building a meal, the system will automatically calculate
                  calories, protein, carbohydrates, fat and fiber based on
                  the selected food and quantity.
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search foods..."
                  className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-10 font-body text-[11px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#2D312E]/35 transition hover:bg-[#E9F0EC] hover:text-[#3D5A4C]"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter icon + count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-body text-[10px] font-semibold text-[#2D312E]/45">
                  <Filter size={14} className="text-[#4E876E]" />
                  <span>{filteredFoods.length} foods</span>
                </div>

                {(search || selectedCategory !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                    }}
                    className="font-body text-[10px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Category filters */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 font-body text-[10px] font-semibold transition ${
                      active
                        ? "bg-[#3D5A4C] text-white"
                        : "bg-[#F3F5F2] text-[#3D5A4C]/65 hover:bg-[#E9F0EC] hover:text-[#3D5A4C]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Table */}
          <div className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            {/* Table header */}
            <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-[19px]">
                  Available Foods
                </h2>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  Nutritional values are shown per standard serving.
                </p>
              </div>

              <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C] sm:flex">
                <SlidersHorizontal size={16} />
              </div>
            </div>

            {filteredFoods.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#2D312E]/[0.06] bg-[#F8F9F7]">
                      <th className="px-5 py-3 text-left font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40 sm:px-6">
                        Food
                      </th>

                      <th className="px-4 py-3 text-left font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                        Category
                      </th>

                      <th className="px-4 py-3 text-left font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                        Serving
                      </th>

                      <th className="px-4 py-3 text-right font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                        Calories
                      </th>

                      <th className="px-4 py-3 text-right font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                        Protein
                      </th>

                      <th className="px-4 py-3 text-right font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                        Carbs
                      </th>

                      <th className="px-4 py-3 text-right font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                        Fat
                      </th>

                      <th className="px-5 py-3 text-right font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40 sm:px-6">
                        Fiber
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredFoods.map((food) => (
                      <tr
                        key={food.id}
                        className="border-b border-[#2D312E]/[0.05] last:border-b-0 transition hover:bg-[#FAF9F6]"
                      >
                        <td className="px-5 py-4 sm:px-6">
                          <div>
                            <p className="font-body text-[11px] font-bold text-[#2D312E]">
                              {food.name}
                            </p>

                            <p className="font-body mt-0.5 text-[9px] text-[#2D312E]/35">
                              {food.id}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-[#E9F0EC] px-3 py-1.5 font-body text-[9px] font-semibold text-[#3D5A4C]">
                            {food.category}
                          </span>
                        </td>

                        <td className="px-4 py-4 font-body text-[10px] text-[#2D312E]/60">
                          {food.serving}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <span className="font-body text-[11px] font-bold text-[#2D312E]">
                            {formatNumber(food.calories)}
                          </span>

                          <span className="ml-1 font-body text-[9px] text-[#2D312E]/35">
                            kcal
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right font-body text-[11px] font-semibold text-[#3D5A4C]">
                          {formatNumber(food.protein)} g
                        </td>

                        <td className="px-4 py-4 text-right font-body text-[11px] text-[#2D312E]/65">
                          {formatNumber(food.carbohydrates)} g
                        </td>

                        <td className="px-4 py-4 text-right font-body text-[11px] text-[#2D312E]/65">
                          {formatNumber(food.fat)} g
                        </td>

                        <td className="px-5 py-4 text-right font-body text-[11px] text-[#2D312E]/65 sm:px-6">
                          {formatNumber(food.fiber)} g
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                  <Search size={20} />
                </div>

                <h3 className="font-display mt-4 text-[18px]">
                  No foods found
                </h3>

                <p className="font-body mx-auto mt-2 max-w-sm text-[10px] leading-5 text-[#2D312E]/40">
                  Try searching for another food or choose a different
                  category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 rounded-xl bg-[#3D5A4C] px-5 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#2D312E]"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Table footer */}
            {filteredFoods.length > 0 && (
              <div className="border-t border-[#2D312E]/[0.06] bg-[#F8F9F7] px-5 py-3 sm:px-6">
                <p className="font-body text-[9px] text-[#2D312E]/35">
                  Showing {filteredFoods.length} of{" "}
                  {TEMPORARY_FOODS.length} foods
                </p>
              </div>
            )}
          </div>

          {/* Future workflow */}
          <div className="mt-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-display text-[18px]">
              How this will be used
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <WorkflowCard
                number="01"
                title="Choose a food"
                description="The nutritionist selects a food from this database when building a meal."
              />

              <WorkflowCard
                number="02"
                title="Enter quantity"
                description="Only the amount or portion is entered. Nutrition values are not typed manually."
              />

              <WorkflowCard
                number="03"
                title="Automatic calculation"
                description="Calories, protein, carbs, fat and fiber are automatically calculated."
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function WorkflowCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[#2D312E]/[0.06] bg-[#FAF9F6] p-4">
      <span className="font-body text-[9px] font-bold tracking-widest text-[#4E876E]">
        {number}
      </span>

      <h3 className="font-body mt-2 text-[11px] font-bold text-[#2D312E]">
        {title}
      </h3>

      <p className="font-body mt-1.5 text-[10px] leading-5 text-[#2D312E]/40">
        {description}
      </p>
    </div>
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
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
        className="rounded-xl p-2 text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
    </div>
  );
}