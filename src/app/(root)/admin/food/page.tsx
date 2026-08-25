'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

type FoodItem = {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
};

const DEFAULT_FOOD_ITEMS: FoodItem[] = [
  { id: '1', name: 'Injera', category: 'Grains', calories: 85, protein: 2.6, carbs: 17, fat: 0.5, servingSize: '1 piece (60g)' },
  { id: '2', name: 'Shiro Wat', category: 'Legumes', calories: 190, protein: 9, carbs: 22, fat: 8, servingSize: '1 cup (200g)' },
  { id: '3', name: 'Doro Wat', category: 'Poultry', calories: 320, protein: 28, carbs: 6, fat: 20, servingSize: '1 serving (250g)' },
  { id: '4', name: 'Tibs', category: 'Meat', calories: 280, protein: 24, carbs: 3, fat: 19, servingSize: '1 serving (200g)' },
  { id: '5', name: 'Gomen', category: 'Vegetables', calories: 60, protein: 3, carbs: 8, fat: 2, servingSize: '1 cup (150g)' },
];

function useFoodItems() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchItems() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<FoodItem[]>('/admin/food');
        // if (isMounted) setItems(data);
        if (isMounted) setItems(DEFAULT_FOOD_ITEMS); // TEMP: sample data for preview
      } catch (err) {
        console.error('Unable to load food items:', err);
        if (isMounted) setError('Unable to load food items.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchItems();
    return () => { isMounted = false; };
  }, []);

  return { items, isLoading, error };
}

export default function FoodDatabasePage() {
  const { items, isLoading, error } = useFoodItems();
  const [query, setQuery] = useState('');

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  function handleAddFoodItem() {
    // Backend API will be connected here later — e.g. open a modal/form that calls:
    // await apiFetch('/admin/food', { method: 'POST', data: newFoodItem });
    console.log('Add food item');
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[23px] text-[#2D312E]">Food Database</h1>
          <p className="mt-1 text-[12px] text-[#2D312E]/50">Manage nutrition data used across the platform.</p>
        </div>
        <button
          type="button"
          onClick={handleAddFoodItem}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#4E876E]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add food item
        </button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D312E]/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search food or category"
          className="w-full rounded-xl border border-[#2D312E]/10 bg-white py-2 pl-9 pr-3 text-[12px] outline-none focus:border-[#3D5A4C]"
        />
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Name</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Category</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Serving</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Calories</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Protein</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Carbs</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Fat</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">Loading food items…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">No food items found.</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-[#2D312E]/[0.04] last:border-0">
                    <td className="px-5 py-4 text-[12px] font-semibold">{item.name}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{item.category}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{item.servingSize}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{item.calories} kcal</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{item.protein}g</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{item.carbs}g</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{item.fat}g</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}