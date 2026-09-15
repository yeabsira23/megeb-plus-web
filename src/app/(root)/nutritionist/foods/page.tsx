"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
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
  id: number;
  name: string;
  category: Exclude<FoodCategory, "All"> | string;
  unit_based: boolean;
  unit_name: string;
  grams_per_unit: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  serving: string;
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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function FoodDatabasePage() {
  const { data: session, status } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [foods, setFoods] = useState<Food[]>([]);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<FoodCategory>("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* -------------------------------- */
  /* Fetch Foods                      */
  /* -------------------------------- */

  useEffect(() => {
    async function fetchFoods() {
      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated") {
        setError("Please log in to access the food database.");
        setLoading(false);
        return;
      }

      if (!session?.accessToken) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get<Food[]>(
          `${API_URL}/api/nutritionist/foods/`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        setFoods(response.data);
      } catch (err) {
        console.error("Failed to load food database:", err);

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError(
              "Your session has expired. Please log in again."
            );
          } else if (err.response?.status === 403) {
            setError(
              "You do not have permission to access the food database."
            );
          } else {
            setError(
              err.response?.data?.detail ||
                "Unable to load the food database."
            );
          }
        } else {
          setError("Unable to load the food database.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFoods();
  }, [session, status]);

  /* -------------------------------- */
  /* Filter Foods                     */
  /* -------------------------------- */

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesSearch =
        query.length === 0 ||
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        food.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [foods, search, selectedCategory]);

  /* -------------------------------- */
  /* Clear Filters                    */
  /* -------------------------------- */

  function clearFilters() {
    setSearch("");
    setSelectedCategory("All");
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
      <MobileHeader setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
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
              Browse foods and their nutritional information to use
              when creating personalized meals and nutrition plans.
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
                  Nutrition values are provided by the food database.
                  When building a meal, the system will automatically
                  calculate calories, protein, carbohydrates, fat and
                  fiber based on the selected food and quantity.
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

              {/* Filter count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-body text-[10px] font-semibold text-[#2D312E]/45">
                  <Filter
                    size={14}
                    className="text-[#4E876E]"
                  />

                  <span>
                    {loading
                      ? "Loading..."
                      : `${filteredFoods.length} foods`}
                  </span>
                </div>

                {(search || selectedCategory !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-body text-[10px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Category Filters */}
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

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <X size={17} />
                </div>

                <div>
                  <h2 className="font-body text-[11px] font-bold text-red-700">
                    Unable to load food database
                  </h2>

                  <p className="font-body mt-1 text-[10px] leading-5 text-red-600/75">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Food Table */}
          <div className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            {/* Table Header */}
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

            {/* Loading */}
            {loading ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#E9F0EC] border-t-[#3D5A4C]" />

                <p className="font-body mt-4 text-[11px] font-semibold text-[#2D312E]/50">
                  Loading foods...
                </p>
              </div>
            ) : filteredFoods.length > 0 ? (
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
                        {/* Food */}
                        <td className="px-5 py-4 sm:px-6">
                          <div>
                            <p className="font-body text-[11px] font-bold text-[#2D312E]">
                              {food.name}
                            </p>

                            <p className="font-body mt-0.5 text-[9px] text-[#2D312E]/35">
                              FOOD-
                              {String(food.id).padStart(3, "0")}
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-[#E9F0EC] px-3 py-1.5 font-body text-[9px] font-semibold text-[#3D5A4C]">
                            {food.category}
                          </span>
                        </td>

                        {/* Serving */}
                        <td className="px-4 py-4 font-body text-[10px] text-[#2D312E]/60">
                          {food.serving}
                        </td>

                        {/* Calories */}
                        <td className="px-4 py-4 text-right">
                          <span className="font-body text-[11px] font-bold text-[#2D312E]">
                            {formatNutrition(food.calories)}
                          </span>

                          <span className="ml-1 font-body text-[9px] text-[#2D312E]/35">
                            kcal
                          </span>
                        </td>

                        {/* Protein */}
                        <td className="px-4 py-4 text-right font-body text-[11px] font-semibold text-[#3D5A4C]">
                          {formatNutrition(food.protein)} g
                        </td>

                        {/* Carbs */}
                        <td className="px-4 py-4 text-right font-body text-[11px] text-[#2D312E]/65">
                          {formatNutrition(food.carbs)} g
                        </td>

                        {/* Fat */}
                        <td className="px-4 py-4 text-right font-body text-[11px] text-[#2D312E]/65">
                          {formatNutrition(food.fat)} g
                        </td>

                        {/* Fiber */}
                        <td className="px-5 py-4 text-right font-body text-[11px] text-[#2D312E]/65 sm:px-6">
                          {formatNutrition(food.fiber)} g
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
                  Try searching for another food or choose a
                  different category.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-[#3D5A4C] px-5 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#2D312E]"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Footer */}
            {!loading && filteredFoods.length > 0 && (
              <div className="border-t border-[#2D312E]/[0.06] bg-[#F8F9F7] px-5 py-3 sm:px-6">
                <p className="font-body text-[9px] text-[#2D312E]/35">
                  Showing {filteredFoods.length} of{" "}
                  {foods.length} foods
                </p>
              </div>
            )}
          </div>

          {/* Workflow */}
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

/* -------------------------------- */
/* Workflow Card                    */
/* -------------------------------- */

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

/* -------------------------------- */
/* Format Nutrition                 */
/* -------------------------------- */

function formatNutrition(value: string | number) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return Number.isInteger(number)
    ? number.toString()
    : number.toFixed(1);
}

/* -------------------------------- */
/* Mobile Header                    */
/* -------------------------------- */

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