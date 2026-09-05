"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Database,
  Menu,
  Plus,
  Search,
  Trash2,
  UserRound,
  Utensils,
  X,
  BookOpen,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import { apiFetch } from "@/app/lib/api";

/* =========================================================
   TYPES
========================================================= */

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type Food = {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  unitName: string;
  unitBased: boolean;
};

type MealFood = {
  id: string;
  foodId: string;
  quantity: number;
};

type Meal = {
  id: string;
  name: string;
  type: MealType;
  source: "library" | "custom";
  items: MealFood[];
};

type LibraryMeal = {
  id: string;
  name: string;
  type: MealType;
  items: MealFood[];
};

type Client = {
  id: string;
  name: string;
  preferences: string;
  allergies: string;
};

/* =========================================================
   EXISTING PLAN (as returned by the API)
========================================================= */

type ExistingPlan = {
  planName: string;
  goal: string;
  startDate: string;
  endDate: string;
  calories: string;
  notes: string;
  client: Client;
  meals: Meal[];
};

const GOALS = [
  "Healthy Weight Management",
  "Weight Gain",
  "Muscle Building",
  "Balanced Nutrition",
  "Diabetes Management",
  "Heart Health",
  "Improved Energy",
];

const MEAL_TYPES: MealType[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
];

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function calculateFoodNutrition(food: Food, quantity: number) {
  const multiplier = food.unitBased ? quantity : quantity / 100;

  return {
    calories: food.calories * multiplier,
    protein: food.protein * multiplier,
    carbs: food.carbs * multiplier,
    fat: food.fat * multiplier,
    fiber: food.fiber * multiplier,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function EditNutritionPlanPage() {
  const params = useParams();
  const router = useRouter();

  const planId =
    typeof params.id === "string" ? params.id : "NP-001";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [client, setClient] = useState<Client | null>(null);
  const [foodDatabase, setFoodDatabase] = useState<Food[]>([]);
  const [mealLibrary, setMealLibrary] = useState<LibraryMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [planName, setPlanName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");

  const [mealOptions, setMealOptions] =
    useState<Record<MealType, Meal[]>>({
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snack: [],
    });

  const [activeMealType, setActiveMealType] =
    useState<MealType>("Breakfast");

  const [showLibrary, setShowLibrary] = useState(false);
  const [showFoodDatabase, setShowFoodDatabase] =
    useState(false);

  const [editingMealId, setEditingMealId] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [foodCategory, setFoodCategory] = useState("All");
  const [isSaving, setIsSaving] = useState(false);

  /* =========================================================
     LOAD PLAN, CLIENT, FOOD DATABASE & MEAL LIBRARY
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);

      try {
        const [plan, foods, library] = await Promise.all([
          apiFetch<ExistingPlan>(
            `/nutritionist/nutrition-plans/${planId}`
          ),
          apiFetch<Food[]>("/nutritionist/food-database"),
          apiFetch<LibraryMeal[]>("/nutritionist/meal-library"),
        ]);

        if (!isMounted) return;

        setClient(plan.client);
        setPlanName(plan.planName);
        setGoal(plan.goal);
        setStartDate(plan.startDate);
        setEndDate(plan.endDate);
        setCalories(plan.calories);
        setNotes(plan.notes);
        setMealOptions({
          Breakfast: plan.meals.filter(
            (meal) => meal.type === "Breakfast"
          ),
          Lunch: plan.meals.filter(
            (meal) => meal.type === "Lunch"
          ),
          Dinner: plan.meals.filter(
            (meal) => meal.type === "Dinner"
          ),
          Snack: plan.meals.filter(
            (meal) => meal.type === "Snack"
          ),
        });
        setFoodDatabase(foods);
        setMealLibrary(library);
      } catch (err) {
        console.error("Unable to load nutrition plan:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [planId]);

  /* =========================================================
     FILTERS
  ========================================================= */

  const foodCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(foodDatabase.map((food) => food.category))
      ),
    ],
    []
  );

  const filteredLibraryMeals = useMemo(() => {
    const search = librarySearch.trim().toLowerCase();

    return mealLibrary.filter(
      (meal) =>
        meal.type === activeMealType &&
        (!search ||
          meal.name.toLowerCase().includes(search))
    );
  }, [librarySearch, activeMealType]);

  const filteredFoods = useMemo(() => {
    const search = foodSearch.trim().toLowerCase();

    return foodDatabase.filter(
      (food) =>
        (!search ||
          food.name.toLowerCase().includes(search)) &&
        (foodCategory === "All" ||
          food.category === foodCategory)
    );
  }, [foodSearch, foodCategory]);

  const totalMealOptions = Object.values(mealOptions).reduce(
    (total, meals) => total + meals.length,
    0
  );

  /* =========================================================
     NUTRITION
  ========================================================= */

  function getMealNutrition(meal: Meal) {
    return meal.items.reduce(
      (total, item) => {
        const food = foodDatabase.find(
          (entry) => entry.id === item.foodId
        );

        if (!food) return total;

        const nutrition = calculateFoodNutrition(
          food,
          item.quantity
        );

        return {
          calories: total.calories + nutrition.calories,
          protein: total.protein + nutrition.protein,
          carbs: total.carbs + nutrition.carbs,
          fat: total.fat + nutrition.fat,
          fiber: total.fiber + nutrition.fiber,
        };
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      }
    );
  }

  const dailyNutrition = useMemo(() => {
    const ranges = MEAL_TYPES.map((type) => {
      const meals = mealOptions[type];

      if (!meals.length) {
        return { minimum: 0, average: 0, maximum: 0 };
      }

      const calories = meals.map(
        (meal) => getMealNutrition(meal).calories
      );

      return {
        minimum: Math.min(...calories),
        average:
          calories.reduce((a, b) => a + b, 0) /
          calories.length,
        maximum: Math.max(...calories),
      };
    });

    return {
      minimum: ranges.reduce(
        (sum, item) => sum + item.minimum,
        0
      ),
      average: ranges.reduce(
        (sum, item) => sum + item.average,
        0
      ),
      maximum: ranges.reduce(
        (sum, item) => sum + item.maximum,
        0
      ),
    };
  }, [mealOptions]);

  const averagePlanNutrition = useMemo(() => {
    const meals = Object.values(mealOptions).flat();

    if (!meals.length) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      };
    }

    const total = meals.reduce(
      (sum, meal) => {
        const nutrition = getMealNutrition(meal);

        return {
          calories: sum.calories + nutrition.calories,
          protein: sum.protein + nutrition.protein,
          carbs: sum.carbs + nutrition.carbs,
          fat: sum.fat + nutrition.fat,
          fiber: sum.fiber + nutrition.fiber,
        };
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      }
    );

    return {
      calories: total.calories / meals.length,
      protein: total.protein / meals.length,
      carbs: total.carbs / meals.length,
      fat: total.fat / meals.length,
      fiber: total.fiber / meals.length,
    };
  }, [mealOptions]);

  /* =========================================================
     MEAL ACTIONS
  ========================================================= */

  function addMealFromLibrary(libraryMeal: LibraryMeal) {
    const exists = mealOptions[activeMealType].some(
      (meal) =>
        meal.name.toLowerCase().trim() ===
        libraryMeal.name.toLowerCase().trim()
    );

    if (exists) return;

    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: libraryMeal.name,
      type: activeMealType,
      source: "library",
      items: libraryMeal.items.map((item) => ({
        ...item,
        id: `food-${Date.now()}-${Math.random()}`,
      })),
    };

    setMealOptions((previous) => ({
      ...previous,
      [activeMealType]: [
        ...previous[activeMealType],
        newMeal,
      ],
    }));

    setShowLibrary(false);
  }

  function createCustomMeal() {
    const newMeal: Meal = {
      id: `custom-${Date.now()}`,
      name: `New ${activeMealType} Meal`,
      type: activeMealType,
      source: "custom",
      items: [],
    };

    setMealOptions((previous) => ({
      ...previous,
      [activeMealType]: [
        ...previous[activeMealType],
        newMeal,
      ],
    }));

    setEditingMealId(newMeal.id);
    setShowFoodDatabase(true);
  }

  function updateMeal(
    mealId: string,
    updates: Partial<Meal>
  ) {
    setMealOptions((previous) => ({
      ...previous,
      [activeMealType]: previous[activeMealType].map(
        (meal) =>
          meal.id === mealId
            ? { ...meal, ...updates }
            : meal
      ),
    }));
  }

  function deleteMeal(mealId: string) {
    setMealOptions((previous) => ({
      ...previous,
      [activeMealType]: previous[activeMealType].filter(
        (meal) => meal.id !== mealId
      ),
    }));

    if (editingMealId === mealId) {
      setEditingMealId("");
      setShowFoodDatabase(false);
    }
  }

  function addFoodToMeal(foodId: string) {
    if (!editingMealId) return;

    setMealOptions((previous) => ({
      ...previous,
      [activeMealType]: previous[activeMealType].map(
        (meal) => {
          if (meal.id !== editingMealId) return meal;

          const existing = meal.items.find(
            (item) => item.foodId === foodId
          );

          if (existing) {
            return {
              ...meal,
              items: meal.items.map((item) =>
                item.id === existing.id
                  ? {
                      ...item,
                      quantity:
                        item.quantity + 1,
                    }
                  : item
              ),
            };
          }

          const food = foodDatabase.find(
            (entry) => entry.id === foodId
          );

          return {
            ...meal,
            items: [
              ...meal.items,
              {
                id: `item-${Date.now()}`,
                foodId,
                quantity: food?.unitBased ? 1 : 100,
              },
            ],
          };
        }
      ),
    }));
  }

  function updateFoodQuantity(
    mealId: string,
    itemId: string,
    quantity: number
  ) {
    setMealOptions((previous) => ({
      ...previous,
      [activeMealType]: previous[activeMealType].map(
        (meal) =>
          meal.id === mealId
            ? {
                ...meal,
                items: meal.items.map((item) =>
                  item.id === itemId
                    ? {
                        ...item,
                        quantity: Math.max(
                          0,
                          quantity
                        ),
                      }
                    : item
                ),
              }
            : meal
      ),
    }));
  }

  function removeFood(
    mealId: string,
    itemId: string
  ) {
    setMealOptions((previous) => ({
      ...previous,
      [activeMealType]: previous[activeMealType].map(
        (meal) =>
          meal.id === mealId
            ? {
                ...meal,
                items: meal.items.filter(
                  (item) => item.id !== itemId
                ),
              }
            : meal
      ),
    }));
  }

  /* =========================================================
     SAVE
  ========================================================= */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsSaving(true);

    // Replace this with the real API request later.
    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    setIsSaving(false);

    router.push(
      `/nutritionist/nutrition-plans/${planId}`
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

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

          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-7 lg:px-8">
            <p className="font-body text-center text-[12px] text-[#2D312E]/40">
              Loading nutrition plan…
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      <MobileHeader
        setSidebarOpen={setSidebarOpen}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* BACK */}
          <Link
  href="/nutritionist/nutrition-plans"
  className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] hover:text-[#3D5A4C]"
>
  <ArrowLeft size={15} />
  Back to Nutrition Plan
</Link>
          {/* TITLE */}
          <div className="mb-6">
            <p className="font-body text-[9px] font-bold uppercase tracking-[0.18em] text-[#4E876E]">
              Nutrition Plans
            </p>

            <h1 className="font-display mt-1 text-[25px]">
              Edit Nutrition Plan
            </h1>

            <p className="font-body mt-2 text-[10px] text-[#2D312E]/40">
              Update the plan details, meal options,
              portions, and client instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* =================================================
                PLAN DETAILS
            ================================================= */}

            <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
              <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                <SectionHeader
                  icon={<ClipboardList size={17} />}
                  title="Plan Details"
                  description="Update the details of this nutrition plan."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* CLIENT */}
                  <div className="sm:col-span-2">
                    <Label text="Client" />

                    <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#DCE5DD] bg-[#F3F5F2] px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                        <UserRound size={15} />
                      </div>

                      <div>
                        <p className="font-body text-[11px] font-bold">
                          {client?.name}
                        </p>

                        <p className="font-body mt-0.5 text-[8px] text-[#2D312E]/40">
                          Client cannot be changed while
                          editing this plan.
                        </p>
                      </div>

                      <Check
                        size={16}
                        className="ml-auto text-[#3D5A4C]"
                      />
                    </div>
                  </div>

                  {/* CLIENT INFO */}
                  <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                    <InfoCard
                      title="Dietary Preferences"
                      value={client?.preferences ?? ""}
                    />

                    <InfoCard
                      title="Allergies / Restrictions"
                      value={client?.allergies ?? ""}
                    />
                  </div>

                  {/* PLAN NAME */}
                  <label className="block sm:col-span-2">
                    <Label text="Plan Name" />

                    <input
                      required
                      value={planName}
                      onChange={(e) =>
                        setPlanName(e.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] outline-none focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </label>

                  {/* GOAL */}
                  <label className="block sm:col-span-2">
                    <Label text="Nutrition Goal" />

                    <div className="relative mt-2">
                      <select
                        required
                        value={goal}
                        onChange={(e) =>
                          setGoal(e.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pr-10 font-body text-[11px] outline-none focus:border-[#4E876E]/50"
                      >
                        {GOALS.map((item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
                      />
                    </div>
                  </label>

                  {/* DATES */}
                  <DateInput
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                  />

                  <DateInput
                    label="End Date"
                    value={endDate}
                    min={startDate}
                    onChange={setEndDate}
                  />

                  {/* CALORIES */}
                  <label className="sm:col-span-2">
                    <Label text="Daily Calorie Target" />

                    <div className="relative mt-2">
                      <input
                        required
                        min="1"
                        type="number"
                        value={calories}
                        onChange={(e) =>
                          setCalories(e.target.value)
                        }
                        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pr-20 font-body text-[11px] outline-none focus:border-[#4E876E]/50"
                      />

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-body text-[10px] text-[#2D312E]/35">
                        kcal / day
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* =================================================
                MEALS
            ================================================= */}

            <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
              <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <SectionHeader
                    icon={<Utensils size={17} />}
                    title="Meal Options"
                    description="Update the meals available to this client."
                  />

                  <div className="rounded-xl bg-[#E9F0EC] px-4 py-3 text-center">
                    <p className="font-body text-[8px] font-bold uppercase tracking-wider text-[#3D5A4C]/60">
                      Meal Options
                    </p>

                    <p className="font-display mt-1 text-[20px] text-[#3D5A4C]">
                      {totalMealOptions}
                    </p>
                  </div>
                </div>
              </div>

              {/* TABS */}
              <div className="border-b border-[#2D312E]/[0.06] px-5 py-4 sm:px-6">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {MEAL_TYPES.map((type) => {
                    const active =
                      activeMealType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setActiveMealType(type);
                          setShowLibrary(false);
                          setShowFoodDatabase(false);
                          setEditingMealId("");
                        }}
                        className={`flex min-w-[140px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left ${
                          active
                            ? "border-[#3D5A4C] bg-[#3D5A4C] text-white"
                            : "border-[#2D312E]/[0.08] bg-[#FAF9F6]"
                        }`}
                      >
                        <span className="font-body text-[10px] font-bold">
                          {type}
                        </span>

                        <span
                          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-body text-[8px] font-bold ${
                            active
                              ? "bg-white/15 text-white"
                              : "bg-[#E9F0EC] text-[#3D5A4C]"
                          }`}
                        >
                          {mealOptions[type].length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* CATEGORY HEADER */}
                <div className="mb-5 flex flex-col gap-4 rounded-2xl bg-[#F3F5F2] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#4E876E]">
                      Editing
                    </p>

                    <h3 className="font-display mt-1 text-[21px]">
                      {activeMealType}
                    </h3>

                    <p className="font-body mt-1 max-w-xl text-[9px] leading-5 text-[#2D312E]/45">
                      Add another approved meal from the
                      Meal Library or adjust the foods and
                      portions of an existing meal.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setShowLibrary(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-3 font-body text-[10px] font-bold text-white hover:bg-[#2D312E]"
                    >
                      <BookOpen size={14} />
                      Add from Meal Library
                    </button>

                    <button
                      type="button"
                      onClick={createCustomMeal}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] bg-white px-4 py-3 font-body text-[10px] font-bold text-[#3D5A4C] hover:bg-[#E9F0EC]"
                    >
                      <Plus size={14} />
                      Create New Meal
                    </button>
                  </div>
                </div>

                {/* MEALS */}
                {mealOptions[activeMealType].length ===
                0 ? (
                  <EmptyMeals type={activeMealType} />
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {mealOptions[activeMealType].map(
                      (meal, index) => {
                        const nutrition =
                          getMealNutrition(meal);

                        const isEditing =
                          editingMealId === meal.id;

                        return (
                          <MealCard
                            key={meal.id}
                            meal={meal}
                            index={index}
                            nutrition={nutrition}
                            isEditing={isEditing}
                            foodDatabase={foodDatabase}
                            onDelete={() =>
                              deleteMeal(meal.id)
                            }
                            onUpdate={updateMeal}
                            onEdit={() => {
                              if (isEditing) {
                                setEditingMealId("");
                                setShowFoodDatabase(false);
                              } else {
                                setEditingMealId(meal.id);
                                setShowFoodDatabase(true);
                              }
                            }}
                            onAddFood={() => {
                              setEditingMealId(meal.id);
                              setShowFoodDatabase(true);
                            }}
                            onUpdateQuantity={
                              updateFoodQuantity
                            }
                            onRemoveFood={removeFood}
                          />
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                MEAL LIBRARY
            ================================================= */}

            {showLibrary && (
              <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
                <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <SectionHeader
                      icon={<BookOpen size={17} />}
                      title="Meal Library"
                      description={`Select an existing ${activeMealType} meal.`}
                    />

                    <CloseButton
                      onClick={() =>
                        setShowLibrary(false)
                      }
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <SearchInput
                    value={librarySearch}
                    onChange={setLibrarySearch}
                    placeholder={`Search ${activeMealType.toLowerCase()} meals...`}
                  />

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredLibraryMeals.map(
                      (meal) => {
                        const nutrition =
                          meal.items.reduce(
                            (total, item) => {
                              const food =
                                foodDatabase.find(
                                  (entry) =>
                                    entry.id ===
                                    item.foodId
                                );

                              if (!food) return total;

                              const result =
                                calculateFoodNutrition(
                                  food,
                                  item.quantity
                                );

                              return {
                                calories:
                                  total.calories +
                                  result.calories,
                                protein:
                                  total.protein +
                                  result.protein,
                              };
                            },
                            {
                              calories: 0,
                              protein: 0,
                            }
                          );

                        const alreadyAdded =
                          mealOptions[
                            activeMealType
                          ].some(
                            (existing) =>
                              existing.name
                                .toLowerCase()
                                .trim() ===
                              meal.name
                                .toLowerCase()
                                .trim()
                          );

                        return (
                          <div
                            key={meal.id}
                            className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-body text-[11px] font-bold">
                                  {meal.name}
                                </p>

                                <p className="font-body mt-1 text-[8px] uppercase tracking-wider text-[#4E876E]">
                                  {meal.type}
                                </p>
                              </div>

                              <span className="rounded-lg bg-[#E9F0EC] px-2 py-1 font-body text-[8px] font-bold text-[#3D5A4C]">
                                {formatNumber(
                                  nutrition.calories
                                )}{" "}
                                kcal
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <div>
                                <p className="font-body text-[8px] text-[#2D312E]/35">
                                  Protein
                                </p>

                                <p className="font-body text-[9px] font-semibold">
                                  {formatNumber(
                                    nutrition.protein
                                  )}
                                  g
                                </p>
                              </div>

                              <div>
                                <p className="font-body text-[8px] text-[#2D312E]/35">
                                  Foods
                                </p>

                                <p className="font-body text-[9px] font-semibold">
                                  {meal.items.length}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={alreadyAdded}
                              onClick={() =>
                                addMealFromLibrary(
                                  meal
                                )
                              }
                              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-3 py-2.5 font-body text-[9px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#CCD6C4] disabled:text-[#3D5A4C]/60"
                            >
                              {alreadyAdded ? (
                                <>
                                  <Check size={12} />
                                  Already Added
                                </>
                              ) : (
                                <>
                                  <Plus size={12} />
                                  Add to Plan
                                </>
                              )}
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {!filteredLibraryMeals.length && (
                    <EmptySearch text={`No ${activeMealType} meals found.`} />
                  )}
                </div>
              </section>
            )}

            {/* =================================================
                FOOD DATABASE
            ================================================= */}

            {showFoodDatabase && (
              <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
                <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <SectionHeader
                      icon={<Database size={17} />}
                      title="Food Database"
                      description="Add foods to the selected meal and adjust portions."
                    />

                    <CloseButton
                      onClick={() => {
                        setShowFoodDatabase(false);
                        setEditingMealId("");
                      }}
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {!editingMealId ? (
                    <EmptySearch text="Select a meal to edit" />
                  ) : (
                    <>
                      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                        <SearchInput
                          value={foodSearch}
                          onChange={setFoodSearch}
                          placeholder="Search foods..."
                        />

                        <select
                          value={foodCategory}
                          onChange={(e) =>
                            setFoodCategory(e.target.value)
                          }
                          className="rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] outline-none focus:border-[#4E876E]/50"
                        >
                          {foodCategories.map(
                            (category) => (
                              <option
                                key={category}
                                value={category}
                              >
                                {category}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredFoods.map((food) => (
                          <button
                            key={food.id}
                            type="button"
                            onClick={() =>
                              addFoodToMeal(food.id)
                            }
                            className="group rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4 text-left transition hover:border-[#4E876E]/40 hover:bg-[#F3F5F2]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-body text-[11px] font-bold">
                                  {food.name}
                                </p>

                                <p className="font-body mt-1 text-[8px] uppercase tracking-wider text-[#4E876E]">
                                  {food.category}
                                </p>
                              </div>

                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#3D5A4C]">
                                <Plus size={13} />
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <div>
                                <p className="font-body text-[8px] text-[#2D312E]/35">
                                  Calories
                                </p>

                                <p className="font-body text-[9px] font-semibold">
                                  {food.calories} kcal
                                </p>
                              </div>

                              <div>
                                <p className="font-body text-[8px] text-[#2D312E]/35">
                                  Protein
                                </p>

                                <p className="font-body text-[9px] font-semibold">
                                  {food.protein}g
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {!filteredFoods.length && (
                        <EmptySearch text="No foods found." />
                      )}
                    </>
                  )}
                </div>
              </section>
            )}

            {/* =================================================
                PLAN SUMMARY
            ================================================= */}

            <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
              <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                <SectionHeader
                  icon={<Utensils size={17} />}
                  title="Plan Summary"
                  description="Review the nutrition range before saving."
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <SummaryCard
                    label="Lowest Possible Day"
                    value={formatNumber(
                      dailyNutrition.minimum
                    )}
                    unit="kcal"
                  />

                  <SummaryCard
                    label="Average Choices"
                    value={formatNumber(
                      dailyNutrition.average
                    )}
                    unit="kcal"
                  />

                  <SummaryCard
                    label="Highest Possible Day"
                    value={formatNumber(
                      dailyNutrition.maximum
                    )}
                    unit="kcal"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-[#CCD6C4] bg-[#F3F5F2] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                        Daily Target
                      </p>

                      <p className="font-display mt-1 text-[20px] text-[#3D5A4C]">
                        {calories} kcal
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-body text-[9px] text-[#2D312E]/40">
                        Available choice range
                      </p>

                      <p className="font-body mt-1 text-[11px] font-bold text-[#3D5A4C]">
                        {formatNumber(
                          dailyNutrition.minimum
                        )}{" "}
                        –{" "}
                        {formatNumber(
                          dailyNutrition.maximum
                        )}{" "}
                        kcal
                      </p>
                    </div>
                  </div>

                  {dailyNutrition.minimum >
                    Number(calories) ||
                  dailyNutrition.maximum <
                    Number(calories) ? (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="font-body text-[9px] font-semibold text-amber-700">
                        Review meal choices
                      </p>

                      <p className="font-body mt-1 text-[8px] leading-4 text-amber-700/70">
                        The available meal choices do not
                        currently span the selected daily
                        calorie target.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-lg border border-[#CCD6C4] bg-[#E9F0EC] p-3">
                      <p className="font-body text-[9px] font-semibold text-[#3D5A4C]">
                        Good flexibility
                      </p>

                      <p className="font-body mt-1 text-[8px] leading-4 text-[#3D5A4C]/65">
                        Your available meal combinations can
                        reach the selected calorie target.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <p className="font-body mb-3 text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Average nutrition across meal options
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <NutritionSummary
                      label="Calories"
                      value={formatNumber(
                        averagePlanNutrition.calories
                      )}
                      unit="kcal"
                    />

                    <NutritionSummary
                      label="Protein"
                      value={formatNumber(
                        averagePlanNutrition.protein
                      )}
                      unit="g"
                    />

                    <NutritionSummary
                      label="Carbs"
                      value={formatNumber(
                        averagePlanNutrition.carbs
                      )}
                      unit="g"
                    />

                    <NutritionSummary
                      label="Fat"
                      value={formatNumber(
                        averagePlanNutrition.fat
                      )}
                      unit="g"
                    />

                    <NutritionSummary
                      label="Fiber"
                      value={formatNumber(
                        averagePlanNutrition.fiber
                      )}
                      unit="g"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                NOTES
            ================================================= */}

            <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<ClipboardList size={17} />}
                title="Additional Notes"
                description="Update instructions for the client."
              />

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={4}
                placeholder="Add instructions such as meal timing, hydration, portion guidance, or other recommendations..."
                className="w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50"
              />
            </section>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mb-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href={`/nutritionist/nutrition-plans/${planId}`}
                className="flex items-center justify-center rounded-xl border border-[#CCD6C4] bg-white px-6 py-3 font-body text-[11px] font-bold text-[#3D5A4C] hover:bg-[#E9F0EC]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 font-body text-[11px] font-bold text-white hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={15} />

                {isSaving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   REUSABLE UI
========================================================= */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
        {icon}
      </div>

      <div>
        <h2 className="font-display text-[19px]">
          {title}
        </h2>

        <p className="font-body text-[10px] text-[#2D312E]/40">
          {description}
        </p>
      </div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
      {text}
    </span>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#DCE5DD] bg-[#F3F5F2] p-4">
      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
        {title}
      </p>

      <p className="font-body mt-2 text-[11px] font-semibold text-[#3D5A4C]">
        {value}
      </p>

      <p className="font-body mt-2 text-[8px] leading-4 text-[#2D312E]/40">
        Automatically provided from the client's profile.
      </p>
    </div>
  );
}

function DateInput({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <Label text={label} />

      <div className="relative mt-2">
        <CalendarDays
          size={15}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
        />

        <input
          required
          type="date"
          min={min}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px] outline-none focus:border-[#4E876E]/50"
        />
      </div>
    </label>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
      />

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50"
      />
    </div>
  );
}

function CloseButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D312E]/[0.08] text-[#2D312E]/50 hover:bg-[#FAF9F6]"
    >
      <X size={15} />
    </button>
  );
}

function EmptySearch({ text }: { text: string }) {
  return (
    <div className="py-10 text-center">
      <Search
        size={22}
        className="mx-auto text-[#2D312E]/20"
      />

      <p className="font-body mt-3 text-[10px] text-[#2D312E]/40">
        {text}
      </p>
    </div>
  );
}

function EmptyMeals({
  type,
}: {
  type: MealType;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#CCD6C4] bg-[#FAF9F6] p-10 text-center">
      <BookOpen
        size={24}
        className="mx-auto text-[#4E876E]"
      />

      <h3 className="font-display mt-4 text-[18px]">
        No {type} meals
      </h3>

      <p className="font-body mx-auto mt-2 max-w-md text-[9px] leading-5 text-[#2D312E]/40">
        Add a meal from your Meal Library or create a new
        meal using the Food Database.
      </p>
    </div>
  );
}

/* =========================================================
   MEAL CARD
========================================================= */

function MealCard({
  meal,
  index,
  nutrition,
  isEditing,
  foodDatabase,
  onDelete,
  onUpdate,
  onEdit,
  onAddFood,
  onUpdateQuantity,
  onRemoveFood,
}: {
  meal: Meal;
  index: number;
  nutrition: ReturnType<typeof calculateFoodNutrition>;
  isEditing: boolean;
  foodDatabase: Food[];
  onDelete: () => void;
  onUpdate: (
    id: string,
    updates: Partial<Meal>
  ) => void;
  onEdit: () => void;
  onAddFood: () => void;
  onUpdateQuantity: (
    mealId: string,
    itemId: string,
    quantity: number
  ) => void;
  onRemoveFood: (
    mealId: string,
    itemId: string
  ) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.08] bg-white">
      {/* HEADER */}
      <div className="border-b border-[#2D312E]/[0.06] bg-[#FAF9F6] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <span className="font-body text-[10px] font-bold">
                {index + 1}
              </span>
            </div>

            <div className="min-w-0">
              <input
                type="text"
                value={meal.name}
                onChange={(e) =>
                  onUpdate(meal.id, {
                    name: e.target.value,
                  })
                }
                className="w-full bg-transparent font-body text-[12px] font-bold outline-none"
              />

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#E9F0EC] px-2 py-1 font-body text-[7px] font-bold uppercase tracking-wider text-[#3D5A4C]">
                  {meal.source === "library"
                    ? "Meal Library"
                    : "Custom"}
                </span>

                <span className="font-body text-[8px] text-[#2D312E]/35">
                  {meal.items.length} food
                  {meal.items.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* FOODS */}
      <div className="p-4">
        {meal.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#CCD6C4] bg-[#FAF9F6] p-6 text-center">
            <Database
              size={20}
              className="mx-auto text-[#4E876E]"
            />

            <p className="font-body mt-2 text-[9px] font-semibold text-[#3D5A4C]">
              No foods added
            </p>

            <button
              type="button"
              onClick={onAddFood}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#3D5A4C] px-3 py-2 font-body text-[8px] font-bold text-white"
            >
              <Plus size={11} />
              Add Food
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {meal.items.map((item) => {
              const food = foodDatabase.find(
                (entry) => entry.id === item.foodId
              );

              if (!food) return null;

              const itemNutrition =
                calculateFoodNutrition(
                  food,
                  item.quantity
                );

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#2D312E]/[0.06] bg-[#FAF9F6] p-3"
                >
                  <div className="min-w-0">
                    <p className="font-body truncate text-[10px] font-semibold">
                      {food.name}
                    </p>

                    <p className="font-body mt-1 text-[8px] text-[#2D312E]/40">
                      {item.quantity} {food.unitName} ·{" "}
                      {formatNumber(
                        itemNutrition.calories
                      )}{" "}
                      kcal
                    </p>
                  </div>

                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(
                            meal.id,
                            item.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-20 rounded-lg border border-[#2D312E]/[0.08] bg-white px-2 py-2 font-body text-[9px] outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          onRemoveFood(
                            meal.id,
                            item.id
                          )
                        }
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NUTRITION */}
        <div className="mt-4 grid grid-cols-5 gap-2">
          <MiniNutrition
            label="Kcal"
            value={formatNumber(
              nutrition.calories
            )}
          />

          <MiniNutrition
            label="Protein"
            value={`${formatNumber(
              nutrition.protein
            )}g`}
          />

          <MiniNutrition
            label="Carbs"
            value={`${formatNumber(
              nutrition.carbs
            )}g`}
          />

          <MiniNutrition
            label="Fat"
            value={`${formatNumber(
              nutrition.fat
            )}g`}
          />

          <MiniNutrition
            label="Fiber"
            value={`${formatNumber(
              nutrition.fiber
            )}g`}
          />
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] bg-white px-3 py-2.5 font-body text-[9px] font-bold text-[#3D5A4C] hover:bg-[#E9F0EC]"
        >
          <Database size={13} />

          {isEditing
            ? "Done Editing"
            : "Edit Foods & Portions"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   NUTRITION COMPONENTS
========================================================= */

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

function SummaryCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4">
      <p className="font-body text-[8px] font-bold uppercase tracking-wider text-[#2D312E]/35">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-[21px] text-[#3D5A4C]">
          {value}
        </span>

        <span className="font-body text-[8px] text-[#2D312E]/40">
          {unit}
        </span>
      </div>
    </div>
  );
}

function NutritionSummary({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4">
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

/* =========================================================
   MOBILE HEADER
========================================================= */

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
            Megeb
            <span className="text-[#4E876E]">+</span>
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
