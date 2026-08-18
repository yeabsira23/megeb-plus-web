import { UserRound } from "lucide-react";

type ClientCardProps = {
  name: string;
  detail: string;
  lastVisit: string;
};

const ClientCard = ({
  name,
  detail,
  lastVisit,
}: ClientCardProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#2D312E]/[0.06] bg-[#FAF9F6]/60 p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
        <UserRound size={17} />
      </div>

      <div className="min-w-0">
        <p className="truncate font-body text-[11.5px] font-bold text-[#2D312E]">
          {name}
        </p>

        <p className="mt-0.5 truncate font-body text-[10px] text-[#2D312E]/45">
          {detail}
        </p>

        <p className="mt-1 font-body text-[9px] text-[#4E876E]">
          Last visit: {lastVisit}
        </p>
      </div>
    </div>
  );
};

export default ClientCard;