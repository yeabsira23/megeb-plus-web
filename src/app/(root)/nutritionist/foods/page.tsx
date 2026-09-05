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
  Plus,
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

export default function FoodDatabasePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Empty until foods are loaded from the backend API.
  const [foods, setFoods] = useState<Food[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FoodCategory>("All");

  const [showAddFood, setShowAddFood] = useState(false);

  const [newFood, setNewFood] = useState({
    name: "",
    category: "Protein" as Exclude<FoodCategory, "All">,
    serving: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    fiber: "",
  });

  const [showNutritionFilters, setShowNutritionFilters] =
    useState(false);

  const [nutritionFilters, setNutritionFilters] = useState({
    minCalories: "",
    maxCalories: "",
    minProtein: "",
    maxProtein: "",
    minCarbohydrates: "",
    maxCarbohydrates: "",
    minFat: "",
    maxFat: "",
    minFiber: "",
    maxFiber: "",
  });

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

      const minCalories =
        nutritionFilters.minCalories === ""
          ? 0
          : Number(nutritionFilters.minCalories);

      const maxCalories =
        nutritionFilters.maxCalories === ""
          ? Infinity
          : Number(nutritionFilters.maxCalories);

      const minProtein =
        nutritionFilters.minProtein === ""
          ? 0
          : Number(nutritionFilters.minProtein);

      const maxProtein =
        nutritionFilters.maxProtein === ""
          ? Infinity
          : Number(nutritionFilters.maxProtein);

      const minCarbohydrates =
        nutritionFilters.minCarbohydrates === ""
          ? 0
          : Number(nutritionFilters.minCarbohydrates);

      const maxCarbohydrates =
        nutritionFilters.maxCarbohydrates === ""
          ? Infinity
          : Number(nutritionFilters.maxCarbohydrates);

      const minFat =
        nutritionFilters.minFat === ""
          ? 0
          : Number(nutritionFilters.minFat);

      const maxFat =
        nutritionFilters.maxFat === ""
          ? Infinity
          : Number(nutritionFilters.maxFat);

      const minFiber =
        nutritionFilters.minFiber === ""
          ? 0
          : Number(nutritionFilters.minFiber);

      const maxFiber =
        nutritionFilters.maxFiber === ""
          ? Infinity
          : Number(nutritionFilters.maxFiber);

      const matchesNutrition =
        food.calories >= minCalories &&
        food.calories <= maxCalories &&
        food.protein >= minProtein &&
        food.protein <= maxProtein &&
        food.carbohydrates >= minCarbohydrates &&
        food.carbohydrates <= maxCarbohydrates &&
        food.fat >= minFat &&
        food.fat <= maxFat &&
        food.fiber >= minFiber &&
        food.fiber <= maxFiber;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesNutrition
      );
    });
  }, [
    foods,
    search,
    selectedCategory,
    nutritionFilters,
  ]);

  const hasNutritionFilters = Object.values(
    nutritionFilters
  ).some((value) => value !== "");

  const hasAnyFilters =
    search ||
    selectedCategory !== "All" ||
    hasNutritionFilters;

  function clearNutritionFilters() {
    setNutritionFilters({
      minCalories: "",
      maxCalories: "",
      minProtein: "",
      maxProtein: "",
      minCarbohydrates: "",
      maxCarbohydrates: "",
      minFat: "",
      maxFat: "",
      minFiber: "",
      maxFiber: "",
    });
  }

  function clearAllFilters() {
    setSearch("");
    setSelectedCategory("All");
    clearNutritionFilters();
  }

  function handleAddFood() {
    if (
      !newFood.name.trim() ||
      !newFood.serving.trim() ||
      newFood.calories === "" ||
      newFood.protein === "" ||
      newFood.carbohydrates === "" ||
      newFood.fat === "" ||
      newFood.fiber === ""
    ) {
      return;
    }

    const nextFood: Food = {
      id: `FOOD-${String(foods.length + 1).padStart(3, "0")}`,
      name: newFood.name.trim(),
      category: newFood.category,
      serving: newFood.serving.trim(),
      calories: Number(newFood.calories),
      protein: Number(newFood.protein),
      carbohydrates: Number(newFood.carbohydrates),
      fat: Number(newFood.fat),
      fiber: Number(newFood.fiber),
    };

    setFoods((currentFoods) => [
      ...currentFoods,
      nextFood,
    ]);

    setNewFood({
      name: "",
      category: "Protein",
      serving: "",
      calories: "",
      protein: "",
      carbohydrates: "",
      fat: "",
      fiber: "",
    });

    setShowAddFood(false);
  }

  function updateNewFood(
    field: keyof typeof newFood,
    value: string
  ) {
    setNewFood((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateNutritionFilter(
    field: keyof typeof nutritionFilters,
    value: string
  ) {
    setNutritionFilters((current) => ({
      ...current,
      [field]: value,
    }));
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
          <Link
            href="/nutritionist/dashboard"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

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

          <div className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-[19px]">
                  Add New Food
                </h2>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  Add a food and its nutritional information to the
                  database.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddFood((current) => !current)
                }
                className="flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#2D312E]"
              >
                {showAddFood ? (
                  <>
                    <X size={14} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Add Food
                  </>
                )}
              </button>
            </div>

            {showAddFood && (
              <div className="border-t border-[#2D312E]/[0.06] bg-[#F8F9F7] p-5 sm:p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="lg:col-span-2">
                    <label className="font-body mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/45">
                      Food Name
                    </label>

                    <input
                      type="text"
                      value={newFood.name}
                      onChange={(e) =>
                        updateNewFood(
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Chicken Breast"
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-white px-3 py-3 font-body text-[10px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </div>

                  <div>
                    <label className="font-body mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/45">
                      Category
                    </label>

                    <select
                      value={newFood.category}
                      onChange={(e) =>
                        updateNewFood(
                          "category",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-white px-3 py-3 font-body text-[10px] text-[#2D312E] outline-none transition focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    >
                      {CATEGORIES.filter(
                        (category) => category !== "All"
                      ).map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-body mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/45">
                      Serving
                    </label>

                    <input
                      type="text"
                      value={newFood.serving}
                      onChange={(e) =>
                        updateNewFood(
                          "serving",
                          e.target.value
                        )
                      }
                      placeholder="e.g. 100 g"
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-white px-3 py-3 font-body text-[10px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </div>

                  <NutritionInput
                    label="Calories (kcal)"
                    value={newFood.calories}
                    onChange={(value) =>
                      updateNewFood(
                        "calories",
                        value
                      )
                    }
                  />

                  <NutritionInput
                    label="Protein (g)"
                    value={newFood.protein}
                    onChange={(value) =>
                      updateNewFood(
                        "protein",
                        value
                      )
                    }
                  />

                  <NutritionInput
                    label="Carbs (g)"
                    value={newFood.carbohydrates}
                    onChange={(value) =>
                      updateNewFood(
                        "carbohydrates",
                        value
                      )
                    }
                  />

                  <NutritionInput
                    label="Fat (g)"
                    value={newFood.fat}
                    onChange={(value) =>
                      updateNewFood(
                        "fat",
                        value
                      )
                    }
                  />

                  <NutritionInput
                    label="Fiber (g)"
                    value={newFood.fiber}
                    onChange={(value) =>
                      updateNewFood(
                        "fiber",
                        value
                      )
                    }
                  />
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddFood}
                    className="rounded-xl bg-[#3D5A4C] px-5 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#2D312E]"
                  >
                    Add Food to Database
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
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

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-body text-[10px] font-semibold text-[#2D312E]/45">
                  <Filter
                    size={14}
                    className="text-[#4E876E]"
                  />

                  <span>
                    {filteredFoods.length} foods
                  </span>
                </div>

                {hasAnyFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="font-body text-[10px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((category) => {
                const active =
                  selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(category)
                    }
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

          <div className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="relative flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-[19px]">
                  Available Foods
                </h2>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  Nutritional values are shown per standard serving.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowNutritionFilters(
                    (current) => !current
                  )
                }
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  hasNutritionFilters ||
                  showNutritionFilters
                    ? "bg-[#3D5A4C] text-white"
                    : "bg-[#E9F0EC] text-[#3D5A4C] hover:bg-[#CCD6C4]"
                }`}
                aria-label="Adjust nutrition filters"
                title="Filter by nutrition values"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>

            {showNutritionFilters && (
              <div className="border-b border-[#2D312E]/[0.06] bg-[#F8F9F7] px-5 py-5 sm:px-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-body text-[11px] font-bold text-[#3D5A4C]">
                      Adjust nutritional values
                    </h3>

                    <p className="font-body mt-1 text-[9px] text-[#2D312E]/40">
                      Set minimum and maximum values to filter the
                      foods shown below.
                    </p>
                  </div>

                  {hasNutritionFilters && (
                    <button
                      type="button"
                      onClick={clearNutritionFilters}
                      className="font-body text-[9px] font-bold text-[#4E876E] hover:text-[#3D5A4C]"
                    >
                      Clear nutrition filters
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <NutritionFilter
                    label="Calories (kcal)"
                    minValue={
                      nutritionFilters.minCalories
                    }
                    maxValue={
                      nutritionFilters.maxCalories
                    }
                    onMinChange={(value) =>
                      updateNutritionFilter(
                        "minCalories",
                        value
                      )
                    }
                    onMaxChange={(value) =>
                      updateNutritionFilter(
                        "maxCalories",
                        value
                      )
                    }
                  />

                  <NutritionFilter
                    label="Protein (g)"
                    minValue={
                      nutritionFilters.minProtein
                    }
                    maxValue={
                      nutritionFilters.maxProtein
                    }
                    onMinChange={(value) =>
                      updateNutritionFilter(
                        "minProtein",
                        value
                      )
                    }
                    onMaxChange={(value) =>
                      updateNutritionFilter(
                        "maxProtein",
                        value
                      )
                    }
                  />

                  <NutritionFilter
                    label="Carbs (g)"
                    minValue={
                      nutritionFilters.minCarbohydrates
                    }
                    maxValue={
                      nutritionFilters.maxCarbohydrates
                    }
                    onMinChange={(value) =>
                      updateNutritionFilter(
                        "minCarbohydrates",
                        value
                      )
                    }
                    onMaxChange={(value) =>
                      updateNutritionFilter(
                        "maxCarbohydrates",
                        value
                      )
                    }
                  />

                  <NutritionFilter
                    label="Fat (g)"
                    minValue={
                      nutritionFilters.minFat
                    }
                    maxValue={
                      nutritionFilters.maxFat
                    }
                    onMinChange={(value) =>
                      updateNutritionFilter(
                        "minFat",
                        value
                      )
                    }
                    onMaxChange={(value) =>
                      updateNutritionFilter(
                        "maxFat",
                        value
                      )
                    }
                  />

                  <NutritionFilter
                    label="Fiber (g)"
                    minValue={
                      nutritionFilters.minFiber
                    }
                    maxValue={
                      nutritionFilters.maxFiber
                    }
                    onMinChange={(value) =>
                      updateNutritionFilter(
                        "minFiber",
                        value
                      )
                    }
                    onMaxChange={(value) =>
                      updateNutritionFilter(
                        "maxFiber",
                        value
                      )
                    }
                  />
                </div>
              </div>
            )}

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
                            {formatNumber(
                              food.calories
                            )}
                          </span>

                          <span className="ml-1 font-body text-[9px] text-[#2D312E]/35">
                            kcal
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right font-body text-[11px] font-semibold text-[#3D5A4C]">
                          {formatNumber(
                            food.protein
                          )}{" "}
                          g
                        </td>

                        <td className="px-4 py-4 text-right font-body text-[11px] text-[#2D312E]/65">
                          {formatNumber(
                            food.carbohydrates
                          )}{" "}
                          g
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
                  Try changing your search, category, or nutritional
                  filters.
                </p>

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl bg-[#3D5A4C] px-5 py-2.5 font-body text-[10px] font-bold text-white transition hover:bg-[#2D312E]"
                >
                  Clear filters
                </button>
              </div>
            )}

            {filteredFoods.length > 0 && (
              <div className="border-t border-[#2D312E]/[0.06] bg-[#F8F9F7] px-5 py-3 sm:px-6">
                <p className="font-body text-[9px] text-[#2D312E]/35">
                  Showing {filteredFoods.length} of{" "}
                  {foods.length} foods
                </p>
              </div>
            )}
          </div>

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

function NutritionInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="font-body mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/45">
        {label}
      </label>

      <input
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-white px-3 py-3 font-body text-[10px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
      />
    </div>
  );
}

function NutritionFilter({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="font-body mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/45">
        {label}
      </label>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min="0"
          step="0.1"
          value={minValue}
          onChange={(e) =>
            onMinChange(e.target.value)
          }
          placeholder="Min"
          className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-white px-3 py-2.5 font-body text-[10px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
        />

        <input
          type="number"
          min="0"
          step="0.1"
          value={maxValue}
          onChange={(e) =>
            onMaxChange(e.target.value)
          }
          placeholder="Max"
          className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-white px-3 py-2.5 font-body text-[10px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
        />
      </div>
    </div>
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
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1);
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