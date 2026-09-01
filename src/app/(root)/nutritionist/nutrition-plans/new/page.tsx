"use client";

import { useMemo, useState } from "react";
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

/* =========================================================
   TYPES
========================================================= */

type Client = {
  id: string;
  name: string;
  preferences: string;
  allergies: string;
};

type Food = {
  id: string;
  name: string;
  category: string;
  unitBased: boolean;
  unitName: string;
  gramsPerUnit: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type MealItem = {
  id: string;
  foodId: string;
  quantity: number;
};

type Meal = {
  id: string;
  name: string;
  type: MealType;
  items: MealItem[];
  source: "library" | "custom";
};

type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type MealType =
  | "Breakfast"
  | "Snack"
  | "Lunch"
  | "Dinner";

/* =========================================================
   TEMPORARY CLIENT DATA
========================================================= */

const TEMPORARY_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Hana Tesfaye",
    preferences: "High-protein, high-fiber, low-sugar",
    allergies: "No known allergies",
  },
  {
    id: "2",
    name: "Selam Alemu",
    preferences: "Balanced, high-fiber, low-sugar",
    allergies: "No known allergies",
  },
  {
    id: "3",
    name: "Meron Kebede",
    preferences: "Whole foods, high-fiber, balanced",
    allergies: "Peanuts",
  },
  {
    id: "4",
    name: "Liya Michael",
    preferences: "High-calorie, protein-rich, nutrient-dense",
    allergies: "No known allergies",
  },
];

/* =========================================================
   FOOD DATABASE
========================================================= */

const FOOD_DATABASE: Food[] = [
  {
    id: "food-001",
    name: "Egg",
    category: "Protein",
    unitBased: true,
    unitName: "egg",
    gramsPerUnit: 50,
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 4.8,
    fiber: 0,
  },
  {
    id: "food-002",
    name: "Injera",
    category: "Grains",
    unitBased: true,
    unitName: "piece",
    gramsPerUnit: 120,
    calories: 146,
    protein: 4.8,
    carbs: 30,
    fat: 0.7,
    fiber: 2.8,
  },
  {
    id: "food-003",
    name: "Shiro",
    category: "Legumes",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 160,
    protein: 8.5,
    carbs: 22,
    fat: 4.5,
    fiber: 6,
  },
  {
    id: "food-004",
    name: "Doro Wat",
    category: "Protein",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 190,
    protein: 18,
    carbs: 5,
    fat: 10,
    fiber: 1.2,
  },
  {
    id: "food-005",
    name: "Tibs",
    category: "Protein",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 220,
    protein: 25,
    carbs: 3,
    fat: 11,
    fiber: 0.8,
  },
  {
    id: "food-006",
    name: "Chicken Breast",
    category: "Protein",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
  },
  {
    id: "food-007",
    name: "Fish",
    category: "Protein",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 140,
    protein: 26,
    carbs: 0,
    fat: 4,
    fiber: 0,
  },
  {
    id: "food-008",
    name: "Lentils",
    category: "Legumes",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 116,
    protein: 9,
    carbs: 20,
    fat: 0.4,
    fiber: 7.9,
  },
  {
    id: "food-009",
    name: "Brown Rice",
    category: "Grains",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 123,
    protein: 2.7,
    carbs: 25.6,
    fat: 1,
    fiber: 1.6,
  },
  {
    id: "food-010",
    name: "White Rice",
    category: "Grains",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
  },
  {
    id: "food-011",
    name: "Oatmeal",
    category: "Grains",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
  },
  {
    id: "food-012",
    name: "Greek Yogurt",
    category: "Dairy",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
  },
  {
    id: "food-013",
    name: "Milk",
    category: "Dairy",
    unitBased: false,
    unitName: "ml",
    gramsPerUnit: 100,
    calories: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.3,
    fiber: 0,
  },
  {
    id: "food-014",
    name: "Avocado",
    category: "Fruits",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
  },
  {
    id: "food-015",
    name: "Banana",
    category: "Fruits",
    unitBased: true,
    unitName: "banana",
    gramsPerUnit: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
  },
  {
    id: "food-016",
    name: "Apple",
    category: "Fruits",
    unitBased: true,
    unitName: "apple",
    gramsPerUnit: 182,
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
  },
  {
    id: "food-017",
    name: "Spinach",
    category: "Vegetables",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
  },
  {
    id: "food-018",
    name: "Tomato",
    category: "Vegetables",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
  },
  {
    id: "food-019",
    name: "Carrot",
    category: "Vegetables",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 41,
    protein: 0.9,
    carbs: 9.6,
    fat: 0.2,
    fiber: 2.8,
  },
  {
    id: "food-020",
    name: "Almonds",
    category: "Nuts",
    unitBased: false,
    unitName: "g",
    gramsPerUnit: 100,
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fat: 49.9,
    fiber: 12.5,
  },
];

/* =========================================================
   TEMPORARY MEAL LIBRARY
========================================================= */

const TEMPORARY_MEAL_LIBRARY: Meal[] = [
  {
    id: "library-001",
    name: "Eggs with Injera",
    type: "Breakfast",
    source: "library",
    items: [
      {
        id: "library-item-001",
        foodId: "food-001",
        quantity: 2,
      },
      {
        id: "library-item-002",
        foodId: "food-002",
        quantity: 1,
      },
    ],
  },
  {
    id: "library-002",
    name: "Oatmeal with Banana",
    type: "Breakfast",
    source: "library",
    items: [
      {
        id: "library-item-003",
        foodId: "food-011",
        quantity: 80,
      },
      {
        id: "library-item-004",
        foodId: "food-015",
        quantity: 1,
      },
    ],
  },
  {
    id: "library-003",
    name: "Greek Yogurt with Apple",
    type: "Breakfast",
    source: "library",
    items: [
      {
        id: "library-item-005",
        foodId: "food-012",
        quantity: 200,
      },
      {
        id: "library-item-006",
        foodId: "food-016",
        quantity: 1,
      },
    ],
  },
  {
    id: "library-004",
    name: "Shiro with Injera",
    type: "Lunch",
    source: "library",
    items: [
      {
        id: "library-item-007",
        foodId: "food-003",
        quantity: 150,
      },
      {
        id: "library-item-008",
        foodId: "food-002",
        quantity: 1,
      },
    ],
  },
  {
    id: "library-005",
    name: "Chicken with Brown Rice",
    type: "Lunch",
    source: "library",
    items: [
      {
        id: "library-item-009",
        foodId: "food-006",
        quantity: 150,
      },
      {
        id: "library-item-010",
        foodId: "food-009",
        quantity: 150,
      },
    ],
  },
  {
    id: "library-006",
    name: "Fish with Rice",
    type: "Dinner",
    source: "library",
    items: [
      {
        id: "library-item-011",
        foodId: "food-007",
        quantity: 150,
      },
      {
        id: "library-item-012",
        foodId: "food-010",
        quantity: 150,
      },
    ],
  },
  {
    id: "library-007",
    name: "Doro Wat with Injera",
    type: "Dinner",
    source: "library",
    items: [
      {
        id: "library-item-013",
        foodId: "food-004",
        quantity: 150,
      },
      {
        id: "library-item-014",
        foodId: "food-002",
        quantity: 1,
      },
    ],
  },
  {
    id: "library-008",
    name: "Apple and Almonds",
    type: "Snack",
    source: "library",
    items: [
      {
        id: "library-item-015",
        foodId: "food-016",
        quantity: 1,
      },
      {
        id: "library-item-016",
        foodId: "food-020",
        quantity: 20,
      },
    ],
  },
  {
    id: "library-009",
    name: "Banana and Yogurt",
    type: "Snack",
    source: "library",
    items: [
      {
        id: "library-item-017",
        foodId: "food-015",
        quantity: 1,
      },
      {
        id: "library-item-018",
        foodId: "food-012",
        quantity: 150,
      },
    ],
  },
];

/* =========================================================
   CONSTANTS
========================================================= */

const MEAL_TYPES: MealType[] = [
  "Breakfast",
  "Snack",
  "Lunch",
  "Dinner",
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

/* =========================================================
   HELPERS
========================================================= */

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

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

  if (food.unitBased) {
    return {
      calories: food.calories * quantity,
      protein: food.protein * quantity,
      carbs: food.carbs * quantity,
      fat: food.fat * quantity,
      fiber: food.fiber * quantity,
    };
  }

  const multiplier = quantity / 100;

  return {
    calories: food.calories * multiplier,
    protein: food.protein * multiplier,
    carbs: food.carbs * multiplier,
    fat: food.fat * multiplier,
    fiber: food.fiber * multiplier,
  };
}

function getMealNutrition(meal: Meal): Nutrition {
  return meal.items.reduce<Nutrition>(
    (total, item) => {
      const food = FOOD_DATABASE.find(
        (entry) => entry.id === item.foodId
      );

      if (!food) {
        return total;
      }

      const nutrition = calculateFoodNutrition(
        food,
        item.quantity
      );

      return {
        calories:
          total.calories + nutrition.calories,
        protein:
          total.protein + nutrition.protein,
        carbs:
          total.carbs + nutrition.carbs,
        fat:
          total.fat + nutrition.fat,
        fiber:
          total.fiber + nutrition.fiber,
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

/* =========================================================
   PAGE
========================================================= */

export default function CreateNutritionPlanPage() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [selectedClientId, setSelectedClientId] =
    useState("");

  const [clientSearch, setClientSearch] =
    useState("");

  const [showClientSearch, setShowClientSearch] =
    useState(false);

  const [planName, setPlanName] =
    useState("");

  const [goal, setGoal] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [calories, setCalories] =
    useState("");

  const [notes, setNotes] =
    useState("");

  /*
   * Meal options included in this nutrition plan.
   */
  const [mealOptions, setMealOptions] =
    useState<Record<MealType, Meal[]>>({
      Breakfast: [],
      Snack: [],
      Lunch: [],
      Dinner: [],
    });

  /*
   * Meal library is state so newly-created custom
   * meals can be saved into it during this session.
   */
  const [mealLibrary, setMealLibrary] =
    useState<Meal[]>(
      TEMPORARY_MEAL_LIBRARY
    );

  const [activeMealType, setActiveMealType] =
    useState<MealType>("Breakfast");

  const [showLibrary, setShowLibrary] =
    useState(false);

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

  const [success, setSuccess] =
    useState(false);

  /* =========================================================
     SELECTED CLIENT
  ========================================================= */

  const selectedClient =
    TEMPORARY_CLIENTS.find(
      (client) =>
        client.id === selectedClientId
    );

  /* =========================================================
     SEARCH CLIENTS
  ========================================================= */

  const filteredClients = useMemo(() => {
    const search =
      clientSearch.trim().toLowerCase();

    if (!search) {
      return TEMPORARY_CLIENTS;
    }

    return TEMPORARY_CLIENTS.filter(
      (client) =>
        client.name
          .toLowerCase()
          .includes(search)
    );
  }, [clientSearch]);

  function selectClient(client: Client) {
    setSelectedClientId(client.id);
    setClientSearch(client.name);
    setShowClientSearch(false);
  }

  /* =========================================================
     FOOD CATEGORIES
  ========================================================= */

  const foodCategories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          FOOD_DATABASE.map(
            (food) => food.category
          )
        )
      ),
    ];
  }, []);

  /* =========================================================
     FILTER FOOD DATABASE
  ========================================================= */

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((food) => {
      const matchesSearch =
        food.name
          .toLowerCase()
          .includes(
            foodSearch.toLowerCase()
          );

      const matchesCategory =
        foodCategory === "All" ||
        food.category === foodCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [foodSearch, foodCategory]);

  /* =========================================================
     FILTER MEAL LIBRARY
  ========================================================= */

  const filteredLibraryMeals =
    useMemo(() => {
      return mealLibrary.filter(
        (meal) => {
          const matchesType =
            meal.type === activeMealType;

          const matchesSearch =
            meal.name
              .toLowerCase()
              .includes(
                librarySearch.toLowerCase()
              );

          return (
            matchesType &&
            matchesSearch
          );
        }
      );
    }, [
      mealLibrary,
      activeMealType,
      librarySearch,
    ]);

  /* =========================================================
     ADD MEAL FROM LIBRARY
     
     IMPORTANT:
     A copy is created so editing its portion
     does NOT change the original library meal.
  ========================================================= */

  function addMealFromLibrary(
    libraryMeal: Meal
  ) {
    const alreadyAdded =
      mealOptions[activeMealType].some(
        (meal) =>
          meal.name === libraryMeal.name
      );

    if (alreadyAdded) {
      return;
    }

    const mealToAdd: Meal = {
      ...libraryMeal,
      id: createId("plan-meal"),
      type: activeMealType,
      source: "library",
      items: libraryMeal.items.map(
        (item) => ({
          ...item,
          id: createId("item"),
        })
      ),
    };

    setMealOptions((current) => ({
      ...current,
      [activeMealType]: [
        ...current[activeMealType],
        mealToAdd,
      ],
    }));

    setShowLibrary(false);
    setLibrarySearch("");
  }

  /* =========================================================
     START CUSTOM MEAL
  ========================================================= */

  function startCustomMeal() {
    const newMeal: Meal = {
      id: createId("custom-meal"),
      name: "New Meal",
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

  /* =========================================================
     UPDATE MEAL
  ========================================================= */

  function updateMeal(
    mealId: string,
    changes: Partial<Meal>
  ) {
    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].map(
          (meal) =>
            meal.id === mealId
              ? {
                  ...meal,
                  ...changes,
                }
              : meal
        ),
    }));
  }

  /* =========================================================
     DELETE MEAL
  ========================================================= */

  function deleteMeal(
    mealId: string
  ) {
    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].filter(
          (meal) =>
            meal.id !== mealId
        ),
    }));

    if (
      editingMealId === mealId
    ) {
      setEditingMealId("");
      setShowFoodDatabase(false);
    }
  }

  /* =========================================================
     SAVE CUSTOM MEAL TO LIBRARY
     
     This saves a COPY of the meal.
  ========================================================= */

  function saveMealToLibrary(
    meal: Meal
  ) {
    if (!meal.name.trim()) {
      alert(
        "Please enter a meal name before saving it to the Meal Library."
      );
      return;
    }

    if (meal.items.length === 0) {
      alert(
        "Please add at least one food before saving the meal to the Meal Library."
      );
      return;
    }

    const alreadyExists =
      mealLibrary.some(
        (libraryMeal) =>
          libraryMeal.name
            .trim()
            .toLowerCase() ===
          meal.name.trim().toLowerCase()
      );

    if (alreadyExists) {
      alert(
        "A meal with this name already exists in the Meal Library."
      );
      return;
    }

    const libraryMeal: Meal = {
      ...meal,
      id: createId("library-meal"),
      source: "library",
      items: meal.items.map(
        (item) => ({
          ...item,
          id: createId("library-item"),
        })
      ),
    };

    setMealLibrary((current) => [
      ...current,
      libraryMeal,
    ]);

    updateMeal(meal.id, {
      source: "custom",
    });

    alert(
      `"${meal.name}" has been saved to the Meal Library.`
    );
  }

  /* =========================================================
     ADD FOOD TO MEAL
  ========================================================= */

  function addFoodToMeal(
    foodId: string
  ) {
    if (!editingMealId) {
      alert(
        "Please select a meal first."
      );
      return;
    }

    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].map(
          (meal) => {
            if (
              meal.id !==
              editingMealId
            ) {
              return meal;
            }

            const existingItem =
              meal.items.find(
                (item) =>
                  item.foodId ===
                  foodId
              );

            if (existingItem) {
              return {
                ...meal,
                items:
                  meal.items.map(
                    (item) =>
                      item.foodId ===
                      foodId
                        ? {
                            ...item,
                            quantity:
                              item.quantity +
                              1,
                          }
                        : item
                  ),
              };
            }

            const food =
              FOOD_DATABASE.find(
                (entry) =>
                  entry.id === foodId
              );

            return {
              ...meal,
              items: [
                ...meal.items,
                {
                  id: createId(
                    "item"
                  ),
                  foodId,
                  quantity:
                    food?.unitBased
                      ? 1
                      : 100,
                },
              ],
            };
          }
        ),
    }));
  }

  /* =========================================================
     UPDATE FOOD QUANTITY
  ========================================================= */

  function updateFoodQuantity(
    mealId: string,
    itemId: string,
    quantity: number
  ) {
    const safeQuantity =
      Number.isFinite(quantity)
        ? Math.max(0, quantity)
        : 0;

    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].map(
          (meal) =>
            meal.id === mealId
              ? {
                  ...meal,
                  items:
                    meal.items.map(
                      (item) =>
                        item.id ===
                        itemId
                          ? {
                              ...item,
                              quantity:
                                safeQuantity,
                            }
                          : item
                    ),
                }
              : meal
        ),
    }));
  }

  /* =========================================================
     REMOVE FOOD
  ========================================================= */

  function removeFood(
    mealId: string,
    itemId: string
  ) {
    setMealOptions((current) => ({
      ...current,
      [activeMealType]:
        current[activeMealType].map(
          (meal) =>
            meal.id === mealId
              ? {
                  ...meal,
                  items:
                    meal.items.filter(
                      (item) =>
                        item.id !==
                        itemId
                    ),
                }
              : meal
        ),
    }));
  }

  /* =========================================================
     TOTAL MEALS
  ========================================================= */

  const totalMealOptions =
    Object.values(
      mealOptions
    ).reduce(
      (total, meals) =>
        total + meals.length,
      0
    );

  /* =========================================================
     DAILY RANGE
  ========================================================= */

  const dailyNutrition = useMemo(() => {
    const availableTypes =
      MEAL_TYPES.filter(
        (type) =>
          mealOptions[type].length >
          0
      );

    if (
      availableTypes.length === 0
    ) {
      return {
        minimum: 0,
        maximum: 0,
        average: 0,
      };
    }

    let minimum = 0;
    let maximum = 0;
    let average = 0;

    availableTypes.forEach(
      (type) => {
        const nutritionValues =
          mealOptions[type].map(
            (meal) =>
              getMealNutrition(
                meal
              ).calories
          );

        const min = Math.min(
          ...nutritionValues
        );

        const max = Math.max(
          ...nutritionValues
        );

        const avg =
          nutritionValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          nutritionValues.length;

        minimum += min;
        maximum += max;
        average += avg;
      }
    );

    return {
      minimum,
      maximum,
      average,
    };
  }, [mealOptions]);

  /* =========================================================
     PLAN NUTRITION AVERAGE
  ========================================================= */

  const averagePlanNutrition =
    useMemo(() => {
      const selectedMeals =
        Object.values(
          mealOptions
        ).flat();

      if (
        selectedMeals.length === 0
      ) {
        return {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
        };
      }

      const totals =
        selectedMeals.reduce(
          (total, meal) => {
            const nutrition =
              getMealNutrition(
                meal
              );

            return {
              calories:
                total.calories +
                nutrition.calories,
              protein:
                total.protein +
                nutrition.protein,
              carbs:
                total.carbs +
                nutrition.carbs,
              fat:
                total.fat +
                nutrition.fat,
              fiber:
                total.fiber +
                nutrition.fiber,
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
        calories:
          totals.calories /
          selectedMeals.length,
        protein:
          totals.protein /
          selectedMeals.length,
        carbs:
          totals.carbs /
          selectedMeals.length,
        fat:
          totals.fat /
          selectedMeals.length,
        fiber:
          totals.fiber /
          selectedMeals.length,
      };
    }, [mealOptions]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedClientId) {
      alert(
        "Please select a client."
      );
      return;
    }

    if (!planName.trim()) {
      alert(
        "Please enter a plan name."
      );
      return;
    }

    if (!goal) {
      alert(
        "Please select a nutrition goal."
      );
      return;
    }

    if (!startDate || !endDate) {
      alert(
        "Please select the plan dates."
      );
      return;
    }

    if (totalMealOptions === 0) {
      alert(
        "Please add at least one approved meal option."
      );
      return;
    }

    const incompleteMeal =
      Object.values(
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
        `Please complete "${incompleteMeal.name || "New Meal"}" before creating the plan.`
      );
      return;
    }

    setIsSubmitting(true);

    /*
     * FUTURE DJANGO PAYLOAD
     *
     * meal_options:
     * {
     *   Breakfast: [...],
     *   Snack: [...],
     *   Lunch: [...],
     *   Dinner: [...]
     * }
     */

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 700)
    );

    setIsSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      window.location.href =
        "/nutritionist/nutrition-plans";
    }, 1200);
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      <MobileHeader
        setSidebarOpen={
          setSidebarOpen
        }
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
      />

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* =================================================
              BACK
          ================================================= */}

          <Link
            href="/nutritionist/nutrition-plans"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Nutrition Plans
          </Link>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <ClipboardList
                size={21}
              />
            </div>

            <h1 className="font-display text-[30px] text-[#2D312E]">
              Create Nutrition Plan
            </h1>

            <p className="font-body mt-2 max-w-2xl text-[12px] leading-5 text-[#2D312E]/45">
              Create a flexible nutrition
              plan with nutritionist-approved
              meal choices. Clients can mix
              and match meals while nutrition
              is calculated automatically.
            </p>
          </div>

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#CCD6C4] bg-[#E9F0EC] p-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#3D5A4C] text-white">
                <Check size={15} />
              </div>

              <div>
                <p className="font-body text-[11px] font-bold text-[#3D5A4C]">
                  Nutrition plan created
                  successfully
                </p>

                <p className="font-body mt-1 text-[10px] text-[#3D5A4C]/60">
                  The approved meal
                  choices are ready for
                  the client.
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            {/* =================================================
                PLAN DETAILS
            ================================================= */}

            <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
              <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <ClipboardList
                      size={17}
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-[19px]">
                      Plan Details
                    </h2>

                    <p className="font-body text-[10px] text-[#2D312E]/40">
                      Define who this plan
                      is for and what it
                      should achieve.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* CLIENT */}

                  <label className="block sm:col-span-2">
                    <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Client
                    </span>

                    <div className="relative mt-2">
                      <UserRound
                        size={15}
                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#4E876E]"
                      />

                      <input
                        type="text"
                        required
                        value={
                          clientSearch
                        }
                        onChange={(event) => {
                          setClientSearch(
                            event.target.value
                          );
                          setSelectedClientId(
                            ""
                          );
                          setShowClientSearch(
                            true
                          );
                        }}
                        onFocus={() =>
                          setShowClientSearch(
                            true
                          )
                        }
                        placeholder="Search client by name..."
                        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 pr-10 font-body text-[11px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                      />

                      <ChevronDown
                        size={15}
                        className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35 transition ${
                          showClientSearch
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                      {showClientSearch && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#2D312E]/[0.08] bg-white p-1 shadow-lg">
                          {filteredClients.length >
                          0 ? (
                            filteredClients.map(
                              (client) => (
                                <button
                                  key={
                                    client.id
                                  }
                                  type="button"
                                  onClick={() =>
                                    selectClient(
                                      client
                                    )
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#E9F0EC]"
                                >
                                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#3D5A4C]">
                                    <UserRound
                                      size={
                                        14
                                      }
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="font-body text-[10px] font-bold text-[#2D312E]">
                                      {
                                        client.name
                                      }
                                    </p>

                                    <p className="font-body mt-0.5 truncate text-[8px] text-[#2D312E]/40">
                                      {
                                        client.preferences
                                      }
                                    </p>
                                  </div>

                                  {selectedClientId ===
                                    client.id && (
                                    <Check
                                      size={
                                        14
                                      }
                                      className="ml-auto text-[#3D5A4C]"
                                    />
                                  )}
                                </button>
                              )
                            )
                          ) : (
                            <div className="p-5 text-center">
                              <Search
                                size={20}
                                className="mx-auto text-[#2D312E]/20"
                              />

                              <p className="font-body mt-2 text-[9px] text-[#2D312E]/40">
                                No clients found.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </label>

                  {/* CLIENT INFO */}

                  {selectedClient && (
                    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-[#DCE5DD] bg-[#F3F5F2] p-4">
                        <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                          Dietary Preferences
                        </p>

                        <p className="font-body mt-2 text-[11px] font-semibold text-[#3D5A4C]">
                          {
                            selectedClient.preferences
                          }
                        </p>

                        <p className="font-body mt-2 text-[9px] text-[#2D312E]/40">
                          Automatically
                          provided from
                          the client
                          profile.
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#DCE5DD] bg-[#F3F5F2] p-4">
                        <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                          Allergies /
                          Restrictions
                        </p>

                        <p className="font-body mt-2 text-[11px] font-semibold text-[#3D5A4C]">
                          {
                            selectedClient.allergies
                          }
                        </p>

                        <p className="font-body mt-2 text-[9px] text-[#2D312E]/40">
                          Automatically
                          provided from
                          the client
                          profile.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PLAN NAME */}

                  <label className="block sm:col-span-2">
                    <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Plan Name
                    </span>

                    <input
                      required
                      value={planName}
                      onChange={(event) =>
                        setPlanName(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Healthy Weight Management Plan"
                      className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </label>

                  {/* GOAL */}

                  <label className="block sm:col-span-2">
                    <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Nutrition Goal
                    </span>

                    <div className="relative mt-2">
                      <select
                        required
                        value={goal}
                        onChange={(event) =>
                          setGoal(
                            event.target.value
                          )
                        }
                        className="w-full appearance-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pr-10 font-body text-[11px] outline-none focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                      >
                        <option value="">
                          Select a goal
                        </option>

                        {GOALS.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
                      />
                    </div>
                  </label>

                  {/* START DATE */}

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
                        onChange={(
                          event
                        ) =>
                          setStartDate(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px] outline-none focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                      />
                    </div>
                  </label>

                  {/* END DATE */}

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
                        min={startDate}
                        value={endDate}
                        onChange={(
                          event
                        ) =>
                          setEndDate(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px] outline-none focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                      />
                    </div>
                  </label>

                  {/* CALORIES */}

                  <label className="block sm:col-span-2">
                    <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                      Daily Calorie Target
                    </span>

                    <div className="relative mt-2">
                      <input
                        required
                        min="1"
                        type="number"
                        value={calories}
                        onChange={(
                          event
                        ) =>
                          setCalories(
                            event.target.value
                          )
                        }
                        placeholder="e.g. 1800"
                        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pr-20 font-body text-[11px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
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
                FLEXIBLE MEAL OPTIONS
            ================================================= */}

            <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
              <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                      <Utensils
                        size={17}
                      />
                    </div>

                    <div>
                      <h2 className="font-display text-[19px]">
                        Meal Options
                      </h2>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#E9F0EC] px-4 py-3 text-center">
                    <p className="font-body text-[8px] font-bold uppercase tracking-wider text-[#3D5A4C]/60">
                      Approved Options
                    </p>

                    <p className="font-display mt-1 text-[20px] text-[#3D5A4C]">
                      {
                        totalMealOptions
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* MEAL TYPE TABS */}

              <div className="border-b border-[#2D312E]/[0.06] px-5 py-4 sm:px-6">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {MEAL_TYPES.map(
                    (type) => {
                      const count =
                        mealOptions[
                          type
                        ].length;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setActiveMealType(
                              type
                            );
                            setShowLibrary(
                              false
                            );
                            setShowFoodDatabase(
                              false
                            );
                            setEditingMealId(
                              ""
                            );
                          }}
                          className={`flex min-w-[145px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
                            activeMealType ===
                            type
                              ? "border-[#3D5A4C] bg-[#3D5A4C] text-white"
                              : "border-[#2D312E]/[0.08] bg-[#FAF9F6] text-[#2D312E] hover:border-[#4E876E]/40"
                          }`}
                        >
                          <span className="font-body text-[10px] font-bold">
                            {type}
                          </span>

                          <span
                            className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-body text-[8px] font-bold ${
                              activeMealType ===
                              type
                                ? "bg-white/15 text-white"
                                : "bg-[#E9F0EC] text-[#3D5A4C]"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* ACTIVE CATEGORY */}

              <div className="p-5 sm:p-6">
                <div className="mb-5 flex flex-col gap-4 rounded-2xl bg-[#F3F5F2] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#4E876E]">
                      Meal Category
                    </p>

                    <h3 className="font-display mt-1 text-[21px]">
                      {
                        activeMealType
                      }
                    </h3>

                    <p className="font-body mt-1 max-w-xl text-[9px] leading-5 text-[#2D312E]/45">
                      Add meals that the
                      client can choose from
                      whenever they have this
                      meal.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        setShowLibrary(
                          true
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-3 font-body text-[10px] font-bold text-white transition hover:bg-[#2D312E]"
                    >
                      <BookOpen
                        size={14}
                      />
                      Add from Meal Library
                    </button>

                    <button
                      type="button"
                      onClick={
                        startCustomMeal
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] bg-white px-4 py-3 font-body text-[10px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                    >
                      <Plus
                        size={14}
                      />
                      Create New Meal
                    </button>
                  </div>
                </div>

                {/* EMPTY STATE */}

                {mealOptions[
                  activeMealType
                ].length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#CCD6C4] bg-[#FAF9F6] p-8 text-center sm:p-12">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9F0EC] text-[#3D5A4C]">
                      <BookOpen
                        size={23}
                      />
                    </div>

                    <h3 className="font-display mt-4 text-[18px]">
                      No{" "}
                      {
                        activeMealType
                      }{" "}
                      options yet
                    </h3>

                    <p className="font-body mx-auto mt-2 max-w-md text-[10px] leading-5 text-[#2D312E]/40">
                      Add an existing meal
                      from your Meal Library
                      or create a new meal
                      using the Food Database.
                    </p>

                    <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          setShowLibrary(
                            true
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-3 font-body text-[10px] font-bold text-white"
                      >
                        <BookOpen
                          size={14}
                        />
                        Browse Meal Library
                      </button>

                      <button
                        type="button"
                        onClick={
                          startCustomMeal
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CCD6C4] bg-white px-4 py-3 font-body text-[10px] font-bold text-[#3D5A4C]"
                      >
                        <Plus
                          size={14}
                        />
                        Create Meal
                      </button>
                    </div>
                  </div>
                )}

                {/* MEAL CARDS */}

                <div className="grid gap-4 lg:grid-cols-2">
                  {mealOptions[
                    activeMealType
                  ].map(
                    (meal, index) => {
                      const nutrition =
                        getMealNutrition(
                          meal
                        );

                      const isEditing =
                        editingMealId ===
                        meal.id;

                      return (
                        <div
                          key={meal.id}
                          className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.08] bg-white"
                        >
                          {/* CARD HEADER */}

                          <div className="border-b border-[#2D312E]/[0.06] bg-[#FAF9F6] p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                                  <span className="font-body text-[10px] font-bold">
                                    {index +
                                      1}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <input
                                    type="text"
                                    value={
                                      meal.name
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateMeal(
                                        meal.id,
                                        {
                                          name: event
                                            .target
                                            .value,
                                        }
                                      )
                                    }
                                    className="w-full min-w-0 bg-transparent font-body text-[12px] font-bold text-[#2D312E] outline-none"
                                    placeholder="Meal name"
                                  />

                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-[#E9F0EC] px-2 py-1 font-body text-[7px] font-bold uppercase tracking-wider text-[#3D5A4C]">
                                      {
                                        meal.source ===
                                        "library"
                                          ? "Meal Library"
                                          : "Custom"
                                      }
                                    </span>

                                    <span className="font-body text-[8px] text-[#2D312E]/35">
                                      {
                                        meal.items
                                          .length
                                      }{" "}
                                      food
                                      {meal.items
                                        .length !==
                                      1
                                        ? "s"
                                        : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteMeal(
                                    meal.id
                                  )
                                }
                                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50"
                                title="Remove meal option"
                              >
                                <Trash2
                                  size={13}
                                />
                              </button>
                            </div>
                          </div>

                          {/* FOOD LIST */}

                          <div className="p-4">
                            {meal.items
                              .length ===
                              0 && (
                              <div className="rounded-xl border border-dashed border-[#CCD6C4] bg-[#FAF9F6] p-5 text-center">
                                <Database
                                  size={19}
                                  className="mx-auto text-[#4E876E]"
                                />

                                <p className="font-body mt-2 text-[9px] font-semibold text-[#3D5A4C]">
                                  No foods
                                  added
                                </p>

                                <p className="font-body mt-1 text-[8px] text-[#2D312E]/40">
                                  Add foods
                                  and
                                  portions
                                  from the
                                  Food
                                  Database.
                                </p>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMealId(
                                      meal.id
                                    );
                                    setShowFoodDatabase(
                                      true
                                    );
                                  }}
                                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#3D5A4C] px-3 py-2 font-body text-[8px] font-bold text-white"
                                >
                                  <Plus
                                    size={
                                      11
                                    }
                                  />
                                  Add Food
                                </button>
                              </div>
                            )}

                            {meal.items
                              .length >
                              0 && (
                              <div className="space-y-2">
                                {meal.items.map(
                                  (
                                    item
                                  ) => {
                                    const food =
                                      FOOD_DATABASE.find(
                                        (
                                          entry
                                        ) =>
                                          entry.id ===
                                          item.foodId
                                      );

                                    if (
                                      !food
                                    ) {
                                      return null;
                                    }

                                    const nutrition =
                                      calculateFoodNutrition(
                                        food,
                                        item.quantity
                                      );

                                    return (
                                      <div
                                        key={
                                          item.id
                                        }
                                        className="flex items-center justify-between gap-3 rounded-xl border border-[#2D312E]/[0.06] bg-[#FAF9F6] p-3"
                                      >
                                        <div className="min-w-0">
                                          <p className="font-body truncate text-[10px] font-semibold text-[#2D312E]">
                                            {
                                              food.name
                                            }
                                          </p>

                                          <p className="font-body mt-1 text-[8px] text-[#2D312E]/40">
                                            {
                                              item.quantity
                                            }{" "}
                                            {
                                              food.unitName
                                            }{" "}
                                            ·{" "}
                                            {formatNumber(
                                              nutrition.calories
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
                                              value={
                                                item.quantity
                                              }
                                              onChange={(
                                                event
                                              ) =>
                                                updateFoodQuantity(
                                                  meal.id,
                                                  item.id,
                                                  Number(
                                                    event
                                                      .target
                                                      .value
                                                  )
                                                )
                                              }
                                              className="w-20 rounded-lg border border-[#2D312E]/[0.08] bg-white px-2 py-2 font-body text-[9px] outline-none focus:border-[#4E876E]/50"
                                            />

                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeFood(
                                                  meal.id,
                                                  item.id
                                                )
                                              }
                                              className="text-red-400 hover:text-red-600"
                                              title="Remove food"
                                            >
                                              <X
                                                size={
                                                  13
                                                }
                                              />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
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

                            {/* SAVE TO LIBRARY */}

                            {meal.source ===
                              "custom" && (
                              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[#CCD6C4] bg-[#F3F5F2] p-3">
                                <input
                                  type="checkbox"
                                  checked={mealLibrary.some(
                                    (
                                      libraryMeal
                                    ) =>
                                      libraryMeal.name
                                        .trim()
                                        .toLowerCase() ===
                                      meal.name
                                        .trim()
                                        .toLowerCase()
                                  )}
                                  onChange={(
                                    event
                                  ) => {
                                    if (
                                      event
                                        .target
                                        .checked
                                    ) {
                                      saveMealToLibrary(
                                        meal
                                      );
                                    }
                                  }}
                                  className="mt-0.5 h-4 w-4 accent-[#3D5A4C]"
                                />

                                <span>
                                  <span className="font-body block text-[9px] font-bold text-[#3D5A4C]">
                                    Save to Meal Library
                                  </span>

                                  <span className="font-body mt-1 block text-[8px] leading-4 text-[#2D312E]/40">
                                    Reuse this meal
                                    and its current
                                    portions in future
                                    nutrition plans.
                                  </span>
                                </span>
                              </label>
                            )}

                            {/* EDIT */}

                            <div className="mt-4 flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMealId(
                                    isEditing
                                      ? ""
                                      : meal.id
                                  );

                                  setShowFoodDatabase(
                                    !isEditing
                                  );
                                }}
                                className="flex-1 rounded-xl border border-[#CCD6C4] bg-white px-3 py-2.5 font-body text-[9px] font-bold text-[#3D5A4C] hover:bg-[#E9F0EC]"
                              >
                                {isEditing
                                  ? "Done Editing"
                                  : meal.source ===
                                    "library"
                                  ? "Edit Meal"
                                  : "Edit Foods"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                MEAL LIBRARY PANEL
            ================================================= */}

            {showLibrary && (
              <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
                <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                        <BookOpen
                          size={17}
                        />
                      </div>

                      <div>
                        <h2 className="font-display text-[19px]">
                          Meal Library
                        </h2>

                        <p className="font-body text-[10px] text-[#2D312E]/40">
                          Select an existing{" "}
                          {
                            activeMealType
                          }{" "}
                          meal.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowLibrary(
                          false
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D312E]/[0.08] text-[#2D312E]/50 hover:bg-[#FAF9F6]"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="relative">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
                    />

                    <input
                      type="text"
                      value={
                        librarySearch
                      }
                      onChange={(event) =>
                        setLibrarySearch(
                          event.target.value
                        )
                      }
                      placeholder={`Search ${activeMealType.toLowerCase()} meals...`}
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50"
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredLibraryMeals.map(
                      (meal) => {
                        const nutrition =
                          getMealNutrition(
                            meal
                          );

                        const alreadyAdded =
                          mealOptions[
                            activeMealType
                          ].some(
                            (item) =>
                              item.name
                                .trim()
                                .toLowerCase() ===
                              meal.name
                                .trim()
                                .toLowerCase()
                          );

                        return (
                          <div
                            key={
                              meal.id
                            }
                            className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-body text-[11px] font-bold text-[#2D312E]">
                                  {
                                    meal.name
                                  }
                                </p>

                                <p className="font-body mt-1 text-[8px] uppercase tracking-wider text-[#4E876E]">
                                  {
                                    meal.type
                                  }
                                </p>
                              </div>

                              <div className="rounded-lg bg-[#E9F0EC] px-2 py-1">
                                <span className="font-body text-[8px] font-bold text-[#3D5A4C]">
                                  {formatNumber(
                                    nutrition.calories
                                  )}{" "}
                                  kcal
                                </span>
                              </div>
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
                                  Carbs
                                </p>

                                <p className="font-body text-[9px] font-semibold">
                                  {formatNumber(
                                    nutrition.carbs
                                  )}
                                  g
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={
                                alreadyAdded
                              }
                              onClick={() =>
                                addMealFromLibrary(
                                  meal
                                )
                              }
                              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-3 py-2.5 font-body text-[9px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#CCD6C4] disabled:text-[#3D5A4C]/60"
                            >
                              {alreadyAdded ? (
                                <>
                                  <Check
                                    size={
                                      12
                                    }
                                  />
                                  Already Added
                                </>
                              ) : (
                                <>
                                  <Plus
                                    size={
                                      12
                                    }
                                  />
                                  Add to Plan
                                </>
                              )}
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {filteredLibraryMeals.length ===
                    0 && (
                    <div className="py-10 text-center">
                      <BookOpen
                        size={22}
                        className="mx-auto text-[#2D312E]/20"
                      />

                      <p className="font-body mt-3 text-[10px] text-[#2D312E]/40">
                        No{" "}
                        {
                          activeMealType
                        }{" "}
                        meals found in
                        the Meal Library.
                      </p>
                    </div>
                  )}

                  <div className="mt-5 rounded-xl border border-[#CCD6C4] bg-[#E9F0EC] p-4">
                    <p className="font-body text-[9px] font-bold text-[#3D5A4C]">
                      Reduce repetitive work
                    </p>

                    <p className="font-body mt-1 text-[9px] leading-5 text-[#3D5A4C]/65">
                      Meals already created in
                      the Meal Library can be
                      reused in many nutrition
                      plans. After adding a meal,
                      use Edit Meal if the portion
                      needs to be different for
                      this client.
                    </p>
                  </div>
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
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                        <Database
                          size={17}
                        />
                      </div>

                      <div>
                        <h2 className="font-display text-[19px]">
                          Food Database
                        </h2>

                        <p className="font-body text-[10px] text-[#2D312E]/40">
                          Add foods to the
                          selected meal and
                          adjust portions.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowFoodDatabase(
                          false
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D312E]/[0.08] text-[#2D312E]/50 hover:bg-[#FAF9F6]"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                    <div className="relative">
                      <Search
                        size={15}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4E876E]"
                      />

                      <input
                        type="text"
                        value={
                          foodSearch
                        }
                        onChange={(event) =>
                          setFoodSearch(
                            event.target.value
                          )
                        }
                        placeholder="Search foods..."
                        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pl-11 font-body text-[11px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50"
                      />
                    </div>

                    <select
                      value={
                        foodCategory
                      }
                      onChange={(event) =>
                        setFoodCategory(
                          event.target.value
                        )
                      }
                      className="rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] outline-none focus:border-[#4E876E]/50"
                    >
                      {foodCategories.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category
                            }
                            value={
                              category
                            }
                          >
                            {
                              category
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredFoods.map(
                      (food) => (
                        <button
                          key={
                            food.id
                          }
                          type="button"
                          disabled={
                            !editingMealId
                          }
                          onClick={() =>
                            addFoodToMeal(
                              food.id
                            )
                          }
                          className="group rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4 text-left transition hover:border-[#4E876E]/40 hover:bg-[#F3F5F2] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-body text-[11px] font-bold">
                                {
                                  food.name
                                }
                              </p>

                              <p className="font-body mt-1 text-[8px] uppercase tracking-wider text-[#4E876E]">
                                {
                                  food.category
                                }
                              </p>
                            </div>

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#3D5A4C] group-hover:bg-[#3D5A4C] group-hover:text-white">
                              <Plus
                                size={13}
                              />
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div>
                              <p className="font-body text-[8px] text-[#2D312E]/35">
                                Calories
                              </p>

                              <p className="font-body text-[9px] font-semibold">
                                {
                                  food.calories
                                }{" "}
                                kcal
                                <span className="font-normal text-[#2D312E]/35">
                                  {" "}
                                  /{" "}
                                  {food.unitBased
                                    ? food.unitName
                                    : "100g"}
                                </span>
                              </p>
                            </div>

                            <div>
                              <p className="font-body text-[8px] text-[#2D312E]/35">
                                Protein
                              </p>

                              <p className="font-body text-[9px] font-semibold">
                                {
                                  food.protein
                                }
                                g
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    )}
                  </div>

                  {filteredFoods.length ===
                    0 && (
                    <div className="py-10 text-center">
                      <Search
                        size={22}
                        className="mx-auto text-[#2D312E]/20"
                      />

                      <p className="font-body mt-3 text-[10px] text-[#2D312E]/40">
                        No foods found.
                      </p>
                    </div>
                  )}

                  <div className="mt-5 rounded-xl border border-[#CCD6C4] bg-[#E9F0EC] p-4">
                    <p className="font-body text-[9px] font-bold text-[#3D5A4C]">
                      Automatic nutrition
                    </p>

                    <p className="font-body mt-1 text-[9px] leading-5 text-[#3D5A4C]/65">
                      Nutrition is calculated
                      from the Food Database.
                      Unit-based foods such as
                      eggs are calculated per
                      unit, while weight-based
                      foods are calculated per
                      100g.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                DAILY FLEXIBILITY SUMMARY
            ================================================= */}

            <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
              <div className="border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <Utensils
                      size={17}
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-[19px]">
                      Plan Summary
                    </h2>

                    <p className="font-body text-[10px] text-[#2D312E]/40">
                      Shows how the available
                      meal choices affect daily
                      nutrition.
                    </p>
                  </div>
                </div>
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

                {calories && (
                  <div className="mt-4 rounded-xl border border-[#CCD6C4] bg-[#F3F5F2] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                          Daily Target
                        </p>

                        <p className="font-display mt-1 text-[20px] text-[#3D5A4C]">
                          {calories}{" "}
                          kcal
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="font-body text-[9px] text-[#2D312E]/40">
                          Available choice
                          range
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
                      Number(
                        calories
                      ) ||
                    dailyNutrition.maximum <
                      Number(
                        calories
                      ) ? (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="font-body text-[9px] font-semibold text-amber-700">
                          Review meal choices
                        </p>

                        <p className="font-body mt-1 text-[8px] leading-4 text-amber-700/70">
                          The available meal
                          combinations do not
                          currently span the
                          selected daily calorie
                          target. Consider
                          adjusting portions or
                          adding more meal options.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-lg border border-[#CCD6C4] bg-[#E9F0EC] p-3">
                        <p className="font-body text-[9px] font-semibold text-[#3D5A4C]">
                          Good flexibility
                        </p>

                        <p className="font-body mt-1 text-[8px] leading-4 text-[#3D5A4C]/65">
                          Your approved meal
                          choices include
                          combinations that can
                          reach the selected
                          calorie target.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5">
                  <p className="font-body mb-3 text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                    Average nutrition across
                    all approved meal options
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
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <ClipboardList
                    size={17}
                  />
                </div>

                <div>
                  <h2 className="font-display text-[19px]">
                    Additional Notes
                  </h2>

                  <p className="font-body text-[10px] text-[#2D312E]/40">
                    Add instructions for the
                    client.
                  </p>
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
                placeholder="Add instructions such as meal timing, hydration, portion guidance, or other recommendations..."
                rows={4}
                className="w-full resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
              />
            </section>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mb-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/nutritionist/nutrition-plans"
                className="flex items-center justify-center rounded-xl border border-[#CCD6C4] bg-white px-6 py-3 font-body text-[11px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 font-body text-[11px] font-bold text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ClipboardList
                  size={15}
                />

                {isSubmitting
                  ? "Creating..."
                  : "Create Nutrition Plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SMALL NUTRITION COMPONENT
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

/* =========================================================
   SUMMARY CARD
========================================================= */

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

/* =========================================================
   NUTRITION SUMMARY
========================================================= */

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
  setSidebarOpen: (
    open: boolean
  ) => void;
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
        onClick={() =>
          setSidebarOpen(true)
        }
        className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
    </div>
  );
}