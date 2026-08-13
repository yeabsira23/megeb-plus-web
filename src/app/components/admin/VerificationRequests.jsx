import { ChevronRight, UserCheck } from 'lucide-react';

const DEFAULT_REQUESTS = [
  {
    id: 1,
    name: 'Dr. Bethlehem Kassa',
    specialty: 'Clinical Nutrition',
    submitted: '2 hours ago',
  },
  {
    id: 2,
    name: 'Dr. Yonatan Haile',
    specialty: 'Sports Nutrition',
    submitted: '5 hours ago',
  },
  {
    id: 3,
    name: 'Dr. Meron Fikru',
    specialty: 'Pediatric Nutrition',
    submitted: 'Yesterday',
  },
];

function getInitial(name) {
  // Strip a leading "Dr. " (or similar title) before grabbing the initial
  const cleaned = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '');
  return cleaned.charAt(0).toUpperCase();
}

export default function VerificationRequests({ requests = DEFAULT_REQUESTS }) {
  return (
    <section className="rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-4">
        <div>
          <h3 className="font-display text-[19px]">
            Verification requests
          </h3>
          <p className="mt-1 text-[11px] text-[#2D312E]/45">
            Nutritionists awaiting approval
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#F7EFD9] px-2.5 py-1 text-[10px] font-bold text-[#8A6D2D]">
          <UserCheck className="h-3 w-3" strokeWidth={2.5} />
          {requests.length} pending
        </span>
      </div>

      <div className="p-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#FAF9F6]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] font-semibold text-[#3D5A4C]">
              {getInitial(request.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold">
                {request.name}
              </p>
              <p className="truncate text-[10px] text-[#2D312E]/45">
                {request.specialty} · {request.submitted}
              </p>
            </div>
            <button className="flex items-center gap-0.5 rounded-lg border border-[#3D5A4C]/15 px-2.5 py-1.5 text-[10px] font-semibold text-[#3D5A4C] hover:bg-[#E9F0EC]">
              Review
              <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-[#2D312E]/[0.06] p-4">
        <button className="w-full rounded-xl bg-[#E9F0EC] py-2.5 text-[11px] font-semibold text-[#3D5A4C]">
          Manage all requests
        </button>
      </div>
    </section>
  );
}