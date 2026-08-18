import type { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
};

export default function StatCard({
  icon,
  label,
  value,
  note,
}: StatCardProps) {
  return (
    <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
          {icon}
        </div>

        <span className="font-body text-[10px] font-semibold text-[#DCC48E]">
          Today
        </span>
      </div>

      <p className="font-body mt-4 text-[11px] font-semibold text-[#2D312E]/45">
        {label}
      </p>

      <p className="font-display mt-1 text-[28px] text-[#2D312E]">
        {value}
      </p>

      <p className="font-body mt-1 text-[10px] text-[#4E876E]">
        {note}
      </p>
    </section>
  );
}