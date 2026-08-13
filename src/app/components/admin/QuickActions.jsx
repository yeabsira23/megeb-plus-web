'use client';

import { useRouter } from 'next/navigation';
import { Stethoscope, UtensilsCrossed, Users, BarChart3 } from 'lucide-react';

const ACTIONS = [
  {
    icon: Stethoscope,
    title: 'Verify nutritionist',
    description: 'Review professional credentials',
    path: '/admin/nutritionists',
  },
  {
    icon: UtensilsCrossed,
    title: 'Add food item',
    description: 'Update the food database',
    path: '/admin/food',
  },
  {
    icon: Users,
    title: 'Manage users',
    description: 'View and manage user accounts',
    path: '/admin/users',
  },
  {
    icon: BarChart3,
    title: 'View reports',
    description: 'Monitor platform performance',
    path: '/admin/reports',
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <section className="mt-6 rounded-2xl border border-[#2D312E]/[0.06] bg-white p-5 shadow-sm lg:p-6">
      <div className="mb-4">
        <h3 className="font-display text-[19px]">
          Quick actions
        </h3>
        <p className="mt-1 text-[11px] text-[#2D312E]/45">
          Frequently used administration tools
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map(({ icon: Icon, title, description, path }) => (
          <button
            key={title}
            onClick={() => router.push(path)}
            className="flex items-center gap-3 rounded-xl border border-[#2D312E]/[0.06] p-3 text-left transition hover:bg-[#FAF9F6]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold">
                {title}
              </p>
              <p className="mt-0.5 text-[9px] text-[#2D312E]/40">
                {description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}