"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
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
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import apiClient from "@/app/libs/api/client";

type MealType =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Snack";

type MealSource = "library" | "custom";

type Client = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_picture: string | null;
  is_verified: boolean;
  preferences: string[];
  allergies: string[];
};

type Food = {
  id: number;
  name: string;
  category: string;
  unit_based: boolean;
  unit_name: string;
  grams_per_unit: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  is_active: boolean;
  serving: string;
};

type MealLibraryResponse = {
  id: number;
  name: string;
  meal_type: MealType;
  ingredients: {
    id: number;
    food_id: number;
    food_name: string;
    quantity: string;
  }[];
};

type MealItem = {
  id: string;
  foodId: number;
  quantity: number;
};

type Meal = {
  id: string;
  name: string;
  type: MealType;
  source: MealSource;
  items: MealItem[];
};

type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

const MEAL_TYPES: MealType[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
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

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";

  return value % 1 === 0
    ? String(value)
    : value.toFixed(1);
}

function calculateFoodNutrition(
  food: Food,
  quantity: number
): Nutrition {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  }

  const multiplier = food.unit_based
    ? quantity
    : quantity / 100;

  return {
    calories: Number(food.calories) * multiplier,
    protein: Number(food.protein) * multiplier,
    carbs: Number(food.carbs) * multiplier,
    fat: Number(food.fat) * multiplier,
    fiber: Number(food.fiber) * multiplier,
  };
}

function getMealNutrition(
  meal: Meal,
  foods: Food[]
): Nutrition {
  return meal.items.reduce<Nutrition>(
    (total, item) => {
      const food = foods.find(
        (entry) => entry.id === item.foodId
      );

      if (!food) return total;

      const nutrition = calculateFoodNutrition(
        food,
        item.quantity
      );

      return {
        calories:
          total.calories + nutrition.calories,
        protein:
          total.protein + nutrition.protein,
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

export default function CreateNutritionPlanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [mealLibrary, setMealLibrary] = useState<
    Meal[]
  >([]);

  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(
    null
  );

  const [selectedClientId, setSelectedClientId] =
    useState("");

  const [clientSearch, setClientSearch] =
    useState("");

  const [showClientSearch, setShowClientSearch] =
    useState(false);

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

  const [librarySearch, setLibrarySearch] =
    useState("");

  const [foodSearch, setFoodSearch] =
    useState("");

  const [foodCategory, setFoodCategory] =
    useState("All");

  const [editingMealId, setEditingMealId] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoadingData(true);
        setDataError(null);

        const [
          clientsResponse,
          foodsResponse,
          libraryResponse,
        ] = await Promise.all([
          apiClient.get<Client[]>(
            "/api/nutritionist/clients/"
          ),
          apiClient.get<Food[]>(
            "/api/nutritionist/foods/"
          ),
          apiClient.get<MealLibraryResponse[]>(
            "/api/nutritionist/meal-library/"
          ),
        ]);

        if (!mounted) return;

        setClients(clientsResponse.data);
        setFoods(foodsResponse.data);

        setMealLibrary(
          libraryResponse.data.map((meal) => ({
            id: String(meal.id),
            name: meal.name,
            type: meal.meal_type,
            source: "library",
            items: meal.ingredients.map(
              (item) => ({
                id: String(item.id),
                foodId: item.food_id,
                quantity: Number(item.quantity),
              })
            ),
          }))
        );
      } catch (error) {
        console.error("Unable to load nutrition data:", error);

        if (mounted) {
          setDataError(
            "Unable to load clients, foods, or meal library."
          );
        }
      } finally {
        if (mounted) {
          setLoadingData(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedClient = clients.find(
    (client) =>
      String(client.id) === selectedClientId
  );

  const filteredClients = useMemo(() => {
    const search = clientSearch
      .trim()
      .toLowerCase();

    if (!search) return clients;

    return clients.filter((client) =>
      client.full_name
        .toLowerCase()
        .includes(search)
    );
  }, [clients, clientSearch]);

  const filteredLibraryMeals = useMemo(() => {
    const search = librarySearch
      .trim()
      .toLowerCase();

    return mealLibrary.filter(
      (meal) =>
        meal.type === activeMealType &&
        (!search ||
          meal.name.toLowerCase().includes(search))
    );
  }, [
    mealLibrary,
    activeMealType,
    librarySearch,
  ]);

  const foodCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(foods.map((food) => food.category))
      ),
    ],
    [foods]
  );

  const filteredFoods = useMemo(() => {
    const search = foodSearch
      .trim()
      .toLowerCase();

    return foods.filter(
      (food) =>
        food.is_active &&
        (!search ||
          food.name.toLowerCase().includes(search)) &&
        (foodCategory === "All" ||
          food.category === foodCategory)
    );
  }, [foods, foodSearch, foodCategory]);

  const totalMealOptions = Object.values(
    mealOptions
  ).reduce(
    (total, meals) => total + meals.length,
    0
  );

  const dailyNutrition = useMemo(() => {
    const availableTypes = MEAL_TYPES.filter(
      (type) => mealOptions[type].length > 0
    );

    if (!availableTypes.length) {
      return {
        minimum: 0,
        average: 0,
        maximum: 0,
      };
    }

    let minimum = 0;
    let average = 0;
    let maximum = 0;

    availableTypes.forEach((type) => {
      const values = mealOptions[type].map(
        (meal) =>
          getMealNutrition(meal, foods).calories
      );

      minimum += Math.min(...values);
      maximum += Math.max(...values);

      average +=
        values.reduce(
          (sum, value) => sum + value,
          0
        ) / values.length;
    });

    return {
      minimum,
      average,
      maximum,
    };
  }, [mealOptions, foods]);

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
        const nutrition = getMealNutrition(
          meal,
          foods
        );

        return {
          calories:
            sum.calories + nutrition.calories,
          protein:
            sum.protein + nutrition.protein,
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
  }, [mealOptions, foods]);

  function selectClient(client: Client) {
    setSelectedClientId(String(client.id));
    setClientSearch(client.full_name);
    setShowClientSearch(false);
  }

  function addMealFromLibrary(
    libraryMeal: Meal
  ) {
    const exists = mealOptions[
      activeMealType
    ].some(
      (meal) =>
        meal.name.trim().toLowerCase() ===
        libraryMeal.name.trim().toLowerCase()
    );

    if (exists) return;

    const newMeal: Meal = {
      id: createId("plan-meal"),
      name: libraryMeal.name,
      type: activeMealType,
      source: "library",
      items: libraryMeal.items.map((item) => ({
        ...item,
        id: createId("item"),
      })),
    };

    setMealOptions((current) => ({
      ...current,
      [activeMealType]: [
        ...current[activeMealType],
        newMeal,
      ],
    }));

    setShowLibrary(false);
    setLibrarySearch("");
  }

  function createCustomMeal() {
    const newMeal: Meal = {
      id: createId("custom-meal"),
      name: `New ${activeMealType} Meal`,
      type: activeMealType,
      source: "custom",
      items: [],
    };

    setMealOptions((current) => ({
      ...current,
      [activeMealType]: [
        ...current[activeMealType],
        newMeal,
      ],
    }));

    setEditingMealId(newMeal.id);
    setShowFoodDatabase(true);
  }

  function updateMeal(
    mealId: string,
    changes: Partial<Meal>
  ) {
    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].map((meal) =>
          meal.id === mealId
            ? { ...meal, ...changes }
            : meal
        ),
    }));
  }

  function deleteMeal(mealId: string) {
    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].filter(
          (meal) => meal.id !== mealId
        ),
    }));

    if (editingMealId === mealId) {
      setEditingMealId("");
      setShowFoodDatabase(false);
    }
  }

  function addFoodToMeal(foodId: number) {
    if (!editingMealId) return;

    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].map((meal) => {
          if (meal.id !== editingMealId) {
            return meal;
          }

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

          const food = foods.find(
            (entry) => entry.id === foodId
          );

          return {
            ...meal,
            items: [
              ...meal.items,
              {
                id: createId("item"),
                foodId,
                quantity: food?.unit_based
                  ? 1
                  : 100,
              },
            ],
          };
        }),
    }));
  }

  function updateFoodQuantity(
    mealId: string,
    itemId: string,
    quantity: number
  ) {
    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].map((meal) =>
          meal.id === mealId
            ? {
                ...meal,
                items: meal.items.map((item) =>
                  item.id === itemId
                    ? {
                        ...item,
                        quantity: Math.max(
                          0,
                          Number.isFinite(quantity)
                            ? quantity
                            : 0
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
    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].map((meal) =>
          meal.id === mealId
            ? {
                ...meal,
                items: meal.items.filter(
                  (item) =>
                    item.id !== itemId
                ),
              }
            : meal
        ),
    }));
  }

  async function saveMealToLibrary(
    meal: Meal
  ) {
    if (!meal.name.trim()) {
      alert("Please enter a meal name.");
      return;
    }

    if (!meal.items.length) {
      alert(
        "Please add at least one food before saving the meal."
      );
      return;
    }

    const alreadyExists = mealLibrary.some(
      (item) =>
        item.name.trim().toLowerCase() ===
        meal.name.trim().toLowerCase()
    );

    if (alreadyExists) {
      alert(
        "A meal with this name already exists in the Meal Library."
      );
      return;
    }

    try {
      const response =
        await apiClient.post<MealLibraryResponse>(
          "/api/nutritionist/meal-library/",
          {
            name: meal.name.trim(),
            meal_type: meal.type,
            ingredients: meal.items.map((item) => ({
              food_id: item.foodId,
              quantity: item.quantity.toFixed(2),
            })),
          }
        );

      const savedMeal: Meal = {
        id: String(response.data.id),
        name: response.data.name,
        type: response.data.meal_type,
        source: "library",
        items: response.data.ingredients.map(
          (item) => ({
            id: String(item.id),
            foodId: item.food_id,
            quantity: Number(item.quantity),
          })
        ),
      };

      setMealLibrary((current) => [
        ...current,
        savedMeal,
      ]);

      alert(
        `"${meal.name}" was saved to the Meal Library.`
      );
    } catch (error: any) {
      console.error(
        "Unable to save meal to library:",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Unable to save this meal to the Meal Library."
      );
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedClientId) {
      alert("Please select a client.");
      return;
    }

    if (!planName.trim()) {
      alert("Please enter a plan name.");
      return;
    }

    if (!goal) {
      alert("Please select a nutrition goal.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select the plan dates.");
      return;
    }

    if (endDate < startDate) {
      alert(
        "End date cannot be before the start date."
      );
      return;
    }

    if (!calories || Number(calories) <= 0) {
      alert(
        "Please enter a valid daily calorie target."
      );
      return;
    }

    if (totalMealOptions === 0) {
      alert(
        "Please add at least one meal option."
      );
      return;
    }

    const incompleteMeal = Object.values(
      mealOptions
    )
      .flat()
      .find(
        (meal) =>
          !meal.name.trim() ||
          meal.items.length === 0
      );

    if (incompleteMeal) {
      alert(
        `Please complete "${
          incompleteMeal.name || "New Meal"
        }" before creating the plan.`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const mealOptionsPayload = {
        Breakfast: mealOptions.Breakfast.map(
          toBackendMeal
        ),
        Lunch: mealOptions.Lunch.map(
          toBackendMeal
        ),
        Snack: mealOptions.Snack.map(
          toBackendMeal
        ),
        Dinner: mealOptions.Dinner.map(
          toBackendMeal
        ),
      };

      const response =
        await apiClient.post(
          "/api/nutritionist/nutrition-plans/",
          {
            client: Number(selectedClientId),
            plan_name: planName.trim(),
            goal,
            start_date: startDate,
            end_date: endDate,
            target_calories:
              Number(calories).toFixed(2),
            notes: notes.trim(),
            status: "Draft",
            meal_options:
              mealOptionsPayload,
          }
        );

      setSuccess(true);

      const createdId = response.data?.id;

      setTimeout(() => {
        if (createdId) {
          window.location.href =
            `/nutritionist/nutrition-plans/${createdId}`;
        } else {
          window.location.href =
            "/nutritionist/nutrition-plans";
        }
      }, 900);
    } catch (error: any) {
      console.error(
        "Unable to create nutrition plan:",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Unable to create the nutrition plan."
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <Link
            href="/nutritionist/nutrition-plans"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E]"
          >
            <ArrowLeft size={15} />
            Back to Nutrition Plans
          </Link>

          <div className="mb-8">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <ClipboardList size={21} />
            </div>

            <h1 className="font-display text-[30px]">
              Create Nutrition Plan
            </h1>

            <p className="font-body mt-2 max-w-2xl text-[12px] leading-5 text-[#2D312E]/45">
              Create a flexible nutrition plan with
              nutritionist-approved meal choices.
            </p>
          </div>

          {dataError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-body text-[10px] font-semibold text-red-600">
                {dataError}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#CCD6C4] bg-[#E9F0EC] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3D5A4C] text-white">
                <Check size={15} />
              </div>

              <div>
                <p className="font-body text-[11px] font-bold text-[#3D5A4C]">
                  Nutrition plan created successfully
                </p>

                <p className="font-body mt-1 text-[10px] text-[#3D5A4C]/60">
                  The plan was created as a Draft.
                </p>
              </div>
            </div>
          )}

          {loadingData ? (
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-12 text-center shadow-sm">
              <ClipboardList
                size={28}
                className="mx-auto animate-pulse text-[#4E876E]"
              />

              <p className="font-body mt-4 text-[11px] text-[#2D312E]/40">
                Loading clients, foods and meal library…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* PLAN DETAILS */}
              <section className="mb-6 overflow-visible rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
                <div className="p-5 sm:p-6">
                  <SectionHeader
                    icon={<ClipboardList size={17} />}
                    title="Plan Details"
                    description="Define who this plan is for and what it should achieve."
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Client */}
                    <div className="sm:col-span-2">
                      <Label text="Client" />

                      <div className="relative mt-2">
                        <UserRound
                          size={15}
                          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#4E876E]"
                        />

                        <input
                          type="text"
                          required
                          value={clientSearch}
                          onChange={(event) => {
                            setClientSearch(
                              event.target.value
                            );
                            setSelectedClientId("");
                            setShowClientSearch(true);
                          }}
                          onFocus={() =>
                            setShowClientSearch(true)
                          }
                          placeholder="Search client by name..."
                          className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 pr-10 font-body text-[11px] outline-none focus:border-[#4E876E]/50"
                        />

                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
                        />

                        {showClientSearch && (
                          <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#2D312E]/[0.08] bg-white p-1 shadow-lg">
                            {filteredClients.length ? (
                              filteredClients.map(
                                (client) => (
                                  <button
                                    key={client.id}
                                    type="button"
                                    onClick={() =>
                                      selectClient(
                                        client
                                      )
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-[#E9F0EC]"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#3D5A4C]">
                                      <UserRound
                                        size={14}
                                      />
                                    </div>

                                    <div>
                                      <p className="font-body text-[10px] font-bold">
                                        {client.full_name}
                                      </p>

                                      <p className="font-body mt-0.5 text-[8px] text-[#2D312E]/40">
                                        {client.email}
                                      </p>
                                    </div>

                                    {selectedClientId ===
                                      String(
                                        client.id
                                      ) && (
                                      <Check
                                        size={14}
                                        className="ml-auto text-[#3D5A4C]"
                                      />
                                    )}
                                  </button>
                                )
                              )
                            ) : (
                              <p className="p-5 text-center font-body text-[9px] text-[#2D312E]/40">
                                No clients found.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedClient && (
                      <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                        <InfoCard
                          title="Dietary Preferences"
                          value={
                            selectedClient.preferences
                              .length
                              ? selectedClient.preferences.join(
                                  ", "
                                )
                              : "No preferences provided"
                          }
                        />

                        <InfoCard
                          title="Allergies / Restrictions"
                          value={
                            selectedClient.allergies
                              .length
                              ? selectedClient.allergies.join(
                                  ", "
                                )
                              : "No allergies provided"
                          }
                        />
                      </div>
                    )}

                    <label className="block sm:col-span-2">
                      <Label text="Plan Name" />

                      <input
                        required
                        value={planName}
                        onChange={(e) =>
                          setPlanName(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Weight Management Plan"
                        className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] outline-none focus:border-[#4E876E]/50"
                      />
                    </label>

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
                          <option value="">
                            Select a goal
                          </option>

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

                    <label className="sm:col-span-2">
                      <Label text="Daily Calorie Target" />

                      <div className="relative mt-2">
                        <input
                          required
                          min="1"
                          type="number"
                          value={calories}
                          onChange={(e) =>
                            setCalories(
                              e.target.value
                            )
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

              {/* MEALS */}
              <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
                <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <SectionHeader
                      icon={<Utensils size={17} />}
                      title="Meal Options"
                      description="Add reusable or custom meals to the plan."
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

                <div className="border-b border-[#2D312E]/[0.06] px-5 py-4 sm:px-6">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {MEAL_TYPES.map((type) => (
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
                          activeMealType === type
                            ? "border-[#3D5A4C] bg-[#3D5A4C] text-white"
                            : "border-[#2D312E]/[0.08] bg-[#FAF9F6]"
                        }`}
                      >
                        <span className="font-body text-[10px] font-bold">
                          {type}
                        </span>

                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/15 px-1.5 font-body text-[8px] font-bold">
                          {mealOptions[type].length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-5 flex flex-col gap-4 rounded-2xl bg-[#F3F5F2] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#4E876E]">
                        Meal Category
                      </p>

                      <h3 className="font-display mt-1 text-[21px]">
                        {activeMealType}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          setShowLibrary(true)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-3 font-body text-[10px] font-bold text-white"
                      >
                        <BookOpen size={14} />
                        Add from Meal Library
                      </button>

                      <button
                        type="button"
                        onClick={createCustomMeal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] bg-white px-4 py-3 font-body text-[10px] font-bold text-[#3D5A4C]"
                      >
                        <Plus size={14} />
                        Create New Meal
                      </button>
                    </div>
                  </div>

                  {!mealOptions[activeMealType].length ? (
                    <EmptyMeals
                      type={activeMealType}
                      onLibrary={() =>
                        setShowLibrary(true)
                      }
                      onCustom={createCustomMeal}
                    />
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {mealOptions[
                        activeMealType
                      ].map((meal, index) => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          index={index}
                          foods={foods}
                          nutrition={getMealNutrition(
                            meal,
                            foods
                          )}
                          isEditing={
                            editingMealId ===
                            meal.id
                          }
                          onDelete={() =>
                            deleteMeal(meal.id)
                          }
                          onUpdate={updateMeal}
                          onEdit={() => {
                            setEditingMealId(
                              editingMealId ===
                                meal.id
                                ? ""
                                : meal.id
                            );

                            setShowFoodDatabase(
                              editingMealId !==
                                meal.id
                            );
                          }}
                          onAddFood={() => {
                            setEditingMealId(
                              meal.id
                            );
                            setShowFoodDatabase(
                              true
                            );
                          }}
                          onUpdateQuantity={
                            updateFoodQuantity
                          }
                          onRemoveFood={removeFood}
                          onSaveLibrary={
                            saveMealToLibrary
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* LIBRARY */}
              {showLibrary && (
                <LibraryPanel
                  activeMealType={activeMealType}
                  search={librarySearch}
                  setSearch={setLibrarySearch}
                  meals={filteredLibraryMeals}
                  mealOptions={
                    mealOptions[activeMealType]
                  }
                  onClose={() =>
                    setShowLibrary(false)
                  }
                  onAdd={addMealFromLibrary}
                  foods={foods}
                />
              )}

              {/* FOOD DATABASE */}
              {showFoodDatabase && (
                <FoodDatabase
                  foods={filteredFoods}
                  categories={foodCategories}
                  search={foodSearch}
                  setSearch={setFoodSearch}
                  category={foodCategory}
                  setCategory={setFoodCategory}
                  editingMealId={editingMealId}
                  onClose={() => {
                    setShowFoodDatabase(false);
                    setEditingMealId("");
                  }}
                  onAdd={addFoodToMeal}
                />
              )}

              {/* SUMMARY */}
              <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
                <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                  <SectionHeader
                    icon={<Utensils size={17} />}
                    title="Plan Summary"
                    description="Review the nutrition range before creating the plan."
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

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
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
              </section>

              {/* NOTES */}
              <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
                <SectionHeader
                  icon={<ClipboardList size={17} />}
                  title="Additional Notes"
                  description="Add instructions for the client."
                />

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Add instructions such as hydration, portion guidance, or other recommendations..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 outline-none focus:border-[#4E876E]/50"
                />
              </section>

              <div className="mb-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/nutritionist/nutrition-plans"
                  className="flex items-center justify-center rounded-xl border border-[#CCD6C4] bg-white px-6 py-3 font-body text-[11px] font-bold text-[#3D5A4C]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 font-body text-[11px] font-bold text-white disabled:opacity-60"
                >
                  <ClipboardList size={15} />

                  {isSubmitting
                    ? "Creating..."
                    : "Create Nutrition Plan"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function toBackendMeal(meal: Meal) {
  return {
    name: meal.name.trim(),
    meal_type: meal.type,
    source: meal.source,
    items: meal.items.map((item) => ({
      food: Number(item.foodId),
      quantity: item.quantity.toFixed(2),
    })),
  };
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
        className="rounded-xl p-2 text-[#3D5A4C]"
      >
        <Menu size={22} />
      </button>
    </div>
  );
}

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

function EmptyMeals({
  type,
  onLibrary,
  onCustom,
}: {
  type: MealType;
  onLibrary: () => void;
  onCustom: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#CCD6C4] bg-[#FAF9F6] p-10 text-center">
      <BookOpen
        size={24}
        className="mx-auto text-[#4E876E]"
      />

      <h3 className="font-display mt-4 text-[18px]">
        No {type} options yet
      </h3>

      <p className="font-body mx-auto mt-2 max-w-md text-[9px] leading-5 text-[#2D312E]/40">
        Add an existing meal from the Meal Library
        or create a custom meal.
      </p>

      <div className="mt-5 flex justify-center gap-2">
        <button
          type="button"
          onClick={onLibrary}
          className="rounded-xl bg-[#3D5A4C] px-4 py-3 font-body text-[9px] font-bold text-white"
        >
          Browse Library
        </button>

        <button
          type="button"
          onClick={onCustom}
          className="rounded-xl border border-[#CCD6C4] bg-white px-4 py-3 font-body text-[9px] font-bold text-[#3D5A4C]"
        >
          Create Meal
        </button>
      </div>
    </div>
  );
}

function MealCard({
  meal,
  index,
  foods,
  nutrition,
  isEditing,
  onDelete,
  onUpdate,
  onEdit,
  onAddFood,
  onUpdateQuantity,
  onRemoveFood,
  onSaveLibrary,
}: {
  meal: Meal;
  index: number;
  foods: Food[];
  nutrition: Nutrition;
  isEditing: boolean;
  onDelete: () => void;
  onUpdate: (
    id: string,
    changes: Partial<Meal>
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
  onSaveLibrary: (meal: Meal) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.08] bg-white">
      <div className="border-b border-[#2D312E]/[0.06] bg-[#FAF9F6] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              {index + 1}
            </div>

            <div className="min-w-0">
              <input
                value={meal.name}
                onChange={(e) =>
                  onUpdate(meal.id, {
                    name: e.target.value,
                  })
                }
                className="w-full bg-transparent font-body text-[12px] font-bold outline-none"
              />

              <div className="mt-1 flex gap-2">
                <span className="rounded-full bg-[#E9F0EC] px-2 py-1 font-body text-[7px] font-bold uppercase text-[#3D5A4C]">
                  {meal.source === "library"
                    ? "Meal Library"
                    : "Custom"}
                </span>

                <span className="font-body text-[8px] text-[#2D312E]/35">
                  {meal.items.length} food
                  {meal.items.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-4">
        {meal.items.map((item) => {
          const food = foods.find(
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
              className="mb-2 flex items-center justify-between gap-3 rounded-xl bg-[#FAF9F6] p-3"
            >
              <div>
                <p className="font-body text-[10px] font-semibold">
                  {food.name}
                </p>

                <p className="font-body mt-1 text-[8px] text-[#2D312E]/40">
                  {item.quantity} {food.unit_name} ·{" "}
                  {formatNumber(
                    itemNutrition.calories
                  )} kcal
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
                    className="w-20 rounded-lg border border-[#2D312E]/[0.08] bg-white px-2 py-2 font-body text-[9px]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      onRemoveFood(
                        meal.id,
                        item.id
                      )
                    }
                    className="text-red-400"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {!meal.items.length && (
          <button
            type="button"
            onClick={onAddFood}
            className="w-full rounded-xl border border-dashed border-[#CCD6C4] p-5 font-body text-[9px] font-semibold text-[#3D5A4C]"
          >
            <Plus size={14} className="mx-auto mb-2" />
            Add Food
          </button>
        )}

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

        {meal.source === "custom" && (
          <button
            type="button"
            onClick={() => onSaveLibrary(meal)}
            className="mt-4 w-full rounded-xl border border-[#CCD6C4] bg-[#F3F5F2] px-3 py-2.5 font-body text-[9px] font-bold text-[#3D5A4C]"
          >
            Save to Meal Library
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] px-3 py-2.5 font-body text-[9px] font-bold text-[#3D5A4C]"
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

function LibraryPanel({
  activeMealType,
  search,
  setSearch,
  meals,
  mealOptions,
  onClose,
  onAdd,
  foods,
}: {
  activeMealType: MealType;
  search: string;
  setSearch: (value: string) => void;
  meals: Meal[];
  mealOptions: Meal[];
  onClose: () => void;
  onAdd: (meal: Meal) => void;
  foods: Food[];
}) {
  return (
    <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] p-5">
        <div>
          <h2 className="font-display text-[19px]">
            Meal Library
          </h2>

          <p className="font-body text-[10px] text-[#2D312E]/40">
            Select an existing {activeMealType} meal.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D312E]/[0.08]"
        >
          <X size={15} />
        </button>
      </div>

      <div className="p-5">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search meals..."
            className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px]"
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => {
            const nutrition = getMealNutrition(
              meal,
              foods
            );

            const alreadyAdded =
              mealOptions.some(
                (item) =>
                  item.name.trim().toLowerCase() ===
                  meal.name.trim().toLowerCase()
              );

            return (
              <div
                key={meal.id}
                className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4"
              >
                <p className="font-body text-[11px] font-bold">
                  {meal.name}
                </p>

                <p className="font-body mt-1 text-[8px] uppercase text-[#4E876E]">
                  {meal.type}
                </p>

                <p className="mt-3 font-body text-[9px] font-semibold">
                  {formatNumber(
                    nutrition.calories
                  )}{" "}
                  kcal
                </p>

                <button
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => onAdd(meal)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-3 py-2.5 font-body text-[9px] font-bold text-white disabled:bg-[#CCD6C4]"
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
          })}
        </div>

        {!meals.length && (
          <p className="py-8 text-center font-body text-[10px] text-[#2D312E]/40">
            No {activeMealType} meals found.
          </p>
        )}
      </div>
    </section>
  );
}

function FoodDatabase({
  foods,
  categories,
  search,
  setSearch,
  category,
  setCategory,
  editingMealId,
  onClose,
  onAdd,
}: {
  foods: Food[];
  categories: string[];
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  editingMealId: string;
  onClose: () => void;
  onAdd: (id: number) => void;
}) {
  return (
    <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] p-5">
        <div>
          <h2 className="font-display text-[19px]">
            Food Database
          </h2>

          <p className="font-body text-[10px] text-[#2D312E]/40">
            Add foods to the selected meal.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D312E]/[0.08]"
        >
          <X size={15} />
        </button>
      </div>

      <div className="p-5">
        {!editingMealId ? (
          <p className="py-8 text-center font-body text-[10px] text-[#2D312E]/40">
            Select a meal first.
          </p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search foods..."
                  className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px]"
                />
              </div>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px]"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {foods.map((food) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => onAdd(food.id)}
                  className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4 text-left hover:border-[#4E876E]/40"
                >
                  <p className="font-body text-[11px] font-bold">
                    {food.name}
                  </p>

                  <p className="font-body mt-1 text-[8px] uppercase text-[#4E876E]">
                    {food.category}
                  </p>

                  <p className="mt-4 font-body text-[9px]">
                    {food.calories} kcal
                  </p>

                  <p className="font-body mt-1 text-[8px] text-[#2D312E]/40">
                    {food.serving}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
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
      <p className="font-body text-[7px] font-bold uppercase text-[#2D312E]/35">
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
      <p className="font-body text-[8px] font-bold uppercase text-[#2D312E]/35">
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
      <p className="font-body text-[8px] font-bold uppercase text-[#2D312E]/35">
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