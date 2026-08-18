import { CalendarDays } from "lucide-react";

type UpcomingAppointmentProps = {
  day: string;
  time: string;
  client: string;
};

const UpcomingAppointment = ({
  day,
  time,
  client,
}: UpcomingAppointmentProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#FAF9F6] p-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
        <CalendarDays size={17} />
      </div>

      <div className="min-w-0">
        <p className="font-body text-[11px] font-bold text-[#2D312E]">
          {day} · {time}
        </p>

        <p className="mt-0.5 truncate font-body text-[10px] text-[#2D312E]/45">
          {client}
        </p>
      </div>
    </div>
  );
};

export default UpcomingAppointment;