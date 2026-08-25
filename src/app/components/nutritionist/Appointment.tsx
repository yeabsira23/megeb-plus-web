import Link from "next/link";
import { ChevronRight, Clock3 } from "lucide-react";

type AppointmentProps = {
  time: string;
  client: string;
  type: string;
  status: "Confirmed" | "Pending";
};

export default function Appointment({
  time,
  client,
  type,
  status,
}: AppointmentProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
      <div className="w-[65px] flex-shrink-0">
        <p className="font-body text-[11px] font-bold text-[#2D312E]">
          {time}
        </p>

        <div className="mt-1 flex items-center gap-1 text-[#2D312E]/35">
          <Clock3 size={11} />
          <span className="font-body text-[9px]">30 min</span>
        </div>
      </div>

      <div className="h-9 w-px bg-[#CCD6C4]" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-[12px] font-bold text-[#2D312E]">
          {client}
        </p>

        <p className="mt-0.5 truncate font-body text-[10px] text-[#2D312E]/45">
          {type}
        </p>
      </div>

      <span
        className={`hidden rounded-full px-2.5 py-1 font-body text-[9px] font-bold sm:block ${
          status === "Confirmed"
            ? "bg-[#E9F0EC] text-[#3D5A4C]"
            : "bg-[#DCC48E]/20 text-[#8A6D32]"
        }`}
      >
        {status}
      </span>

      <Link
        href="/nutritionist/appointments"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4E876E] transition hover:bg-[#E9F0EC]"
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}