import { Users, Stethoscope, Calendar, CircleDollarSign, LucideIcon } from 'lucide-react';

/* TYPES */

export type StatIcon = 'users' | 'doctor' | 'calendar' | 'money';

export type StatCardProps = {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: StatIcon;
  loading?: boolean;
};

const ICONS: Record<StatIcon, LucideIcon> = {
  users: Users,
  doctor: Stethoscope,
  calendar: Calendar,
  money: CircleDollarSign,
};

export default function StatCard({
  title,
  value,
  change,
  description,
  icon,
  loading = false,
}: StatCardProps) {
  const Icon = ICONS[icon];

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2D312E]/[0.06] bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-[#E9F0EC]" />
          <div className="h-4 w-10 animate-pulse rounded-full bg-[#E9F0EC]" />
        </div>
        <div className="h-3 w-24 animate-pulse rounded bg-[#E9F0EC]" />
        <div className="mt-2 h-6 w-16 animate-pulse rounded bg-[#E9F0EC]" />
        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-[#E9F0EC]" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2D312E]/[0.06] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
          {Icon && <Icon className="h-5 w-5" strokeWidth={1.75} />}
        </div>
        <span className="rounded-full bg-[#E9F0EC] px-2 py-1 text-[9px] font-bold text-[#4E876E]">
          {change}
        </span>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2D312E]/40">
        {title}
      </p>
      <p className="mt-1 font-display text-[25px]">
        {value}
      </p>
      <p className="mt-1 text-[10px] text-[#2D312E]/40">
        {description}
      </p>
    </div>
  );
}