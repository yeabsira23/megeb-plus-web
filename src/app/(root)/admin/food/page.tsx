'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, UtensilsCrossed, X, Upload } from 'lucide-react';
import {
  getFoodItems,
  createFoodItem,
  type FoodItem,
  type CreateFoodItem,
} from '@/app/libs/api/admin/food';



type NewFoodItemForm = CreateFoodItem;

const EMPTY_FORM: NewFoodItemForm = {
  name: '',
  category: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
   photo: null,
};



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
        
         const data = await getFoodItems();

         if (isMounted) setItems(data);
         
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

  return { items, isLoading, error, setItems };
}

export default function FoodDatabasePage() {
  const { items, isLoading, error, setItems } = useFoodItems();
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  async function handleAddFoodItem(newItem: CreateFoodItem) {
  try {
    const createdItem = await createFoodItem(newItem);

    setItems((previous) => [createdItem, ...previous]);
    setIsModalOpen(false);
  } catch (err) {
    console.error('Unable to add food item:', err);
    throw err;
  }
}

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[23px] text-[#2D312E]">Food Database</h1>
          <p className="mt-1 text-[12px] text-[#2D312E]/70">Manage nutrition data used across the platform.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#4E876E]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add food item
        </button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D312E]/55" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search food or category"
          className="w-full rounded-xl border border-[#2D312E]/10 bg-white py-2 pl-9 pr-3 text-[12px] text-[#2D312E] outline-none placeholder:text-[#2D312E]/55 focus:border-[#3D5A4C]"
        />
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/70">Photo</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/70">Name</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/70">Category</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/70">Serving</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/70">Calories</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/70">Protein</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/70">Carbs</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/70">Fat</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/70">Loading food items…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/70">No food items found.</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-[#2D312E]/[0.04] last:border-0">
                    <td className="px-5 py-3">
                      {item.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.photoUrl} alt={item.name} className="h-11 w-11 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#4E876E]">
                          <UtensilsCrossed className="h-5 w-5" strokeWidth={1.75} />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 text-[12.5px] font-semibold text-[#2D312E]">{item.name}</td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/70">{item.category}</td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/70">{item.servingSize}</td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/70">{item.calories} kcal</td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/70">{item.protein}g</td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/70">{item.carbs}g</td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/70">{item.fat}g</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <AddFoodItemModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddFoodItem} />
      )}
    </div>
  );
}

/* ADD FOOD ITEM MODAL */

function AddFoodItemModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (item: CreateFoodItem) => Promise<void>;
}) {
  const [form, setForm] = useState<NewFoodItemForm>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function updateField(field: keyof NewFoodItemForm, value: string | number) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handlePhotoSelect(file: File | null) {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  if (!form.name.trim() || !form.category.trim()) {
    setFormError('Name and category are required.');
    return;
  }

  try {
    setFormError(null);

    await onSubmit({
      name: form.name.trim(),
      category: form.category.trim(),
      calories: form.calories,
      protein: form.protein,
      carbs: form.carbs,
      fat: form.fat,
      photo: photoFile,
    });
  } catch (err) {
    console.error('Unable to create food item:', err);

    setFormError(
      'Unable to add food item. Please check the information and try again.'
    );
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D312E]/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-6 py-4">
          <h2 className="font-display text-[19px] text-[#2D312E]">Add Food Item</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-[#2D312E]/70 hover:bg-[#FAF9F6] hover:text-[#2D312E]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-medium text-red-600">{formError}</p>}

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#2D312E]/80">Photo</label>
            <div className="flex items-center gap-3">
              {photoPreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => handlePhotoSelect(null)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#2D312E]/15 text-[#2D312E]/55 hover:border-[#4E876E] hover:bg-[#E9F0EC]/40 hover:text-[#4E876E]">
                  <Upload className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoSelect(file);
                    }}
                  />
                </label>
              )}
              <p className="text-[11px] text-[#2D312E]/70">Optional — PNG or JPG</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#2D312E]/80">Name *</label>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Injera"
                className="w-full rounded-lg border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-3 py-2.5 text-[13px] text-[#2D312E] outline-none focus:border-[#3D5A4C] focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#2D312E]/80">Category *</label>
              <input
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                placeholder="e.g. Grains"
                className="w-full rounded-lg border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-3 py-2.5 text-[13px] text-[#2D312E] outline-none focus:border-[#3D5A4C] focus:bg-white"
              />
            </div>
          </div>

          

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#2D312E]/80">Calories</label>
              <input
                type="number"
                value={form.calories || ''}
                onChange={(e) => updateField('calories', Number(e.target.value))}
                className="w-full rounded-lg border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-3 py-2.5 text-[13px] text-[#2D312E] outline-none focus:border-[#3D5A4C] focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#2D312E]/80">Protein (g)</label>
              <input
                type="number"
                value={form.protein || ''}
                onChange={(e) => updateField('protein', Number(e.target.value))}
                className="w-full rounded-lg border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-3 py-2.5 text-[13px] text-[#2D312E] outline-none focus:border-[#3D5A4C] focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#2D312E]/80">Carbs (g)</label>
              <input
                type="number"
                value={form.carbs || ''}
                onChange={(e) => updateField('carbs', Number(e.target.value))}
                className="w-full rounded-lg border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-3 py-2.5 text-[13px] text-[#2D312E] outline-none focus:border-[#3D5A4C] focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#2D312E]/80">Fat (g)</label>
              <input
                type="number"
                value={form.fat || ''}
                onChange={(e) => updateField('fat', Number(e.target.value))}
                className="w-full rounded-lg border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-3 py-2.5 text-[13px] text-[#2D312E] outline-none focus:border-[#3D5A4C] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2D312E]/12 px-4 py-2.5 text-[12.5px] font-semibold text-[#2D312E]/70 hover:bg-[#FAF9F6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#3D5A4C] px-4 py-2.5 text-[12.5px] font-semibold text-white hover:bg-[#4E876E]"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}