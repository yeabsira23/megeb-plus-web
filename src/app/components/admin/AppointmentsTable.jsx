import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  Confirmed: { icon: CheckCircle2, className: 'bg-[#E9F0EC] text-[#3D5A4C]' },
  Pending: { icon: Clock, className: 'bg-[#F7EFD9] text-[#8A6D2D]' },
  Cancelled: { icon: XCircle, className: 'bg-red-50 text-red-500' },
};

const DEFAULT_APPOINTMENTS = [
  {
    id: 1,
    client: 'Sara Abebe',
    nutritionist: 'Dr. Hana Bekele',
    date: 'Today',
    time: '10:30 AM',
    status: 'Confirmed',
  },
  {
    id: 2,
    client: 'Mekdes Tadesse',
    nutritionist: 'Dr. Samuel Alemu',
    date: 'Today',
    time: '1:00 PM',
    status: 'Pending',
  },
  {
    id: 3,
    client: 'Abel Tesfaye',
    nutritionist: 'Dr. Hana Bekele',
    date: 'Tomorrow',
    time: '9:00 AM',
    status: 'Confirmed',
  },
  {
    id: 4,
    client: 'Rahel Girma',
    nutritionist: 'Dr. Meron Worku',
    date: 'Tomorrow',
    time: '3:30 PM',
    status: 'Cancelled',
  },
];

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const { icon: Icon, className } = config;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold ${className}`}
    >
      <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      {status}
    </span>
  );
}

export default function AppointmentsTable({ appointments = DEFAULT_APPOINTMENTS }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-4">
        <div>
          <h3 className="font-display text-[19px]">
            Recent appointments
          </h3>
          <p className="mt-1 text-[11px] text-[#2D312E]/45">
            Latest consultation activity
          </p>
        </div>
        <button className="flex items-center gap-1 text-[11px] font-semibold text-[#4E876E]">
          View all
          <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#2D312E]/[0.05] text-left">
              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">
                Client
              </th>
              <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">
                Nutritionist
              </th>
              <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">
                Schedule
              </th>
              <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-b border-[#2D312E]/[0.04] last:border-0"
              >
                <td className="px-5 py-4 text-[12px] font-semibold">
                  {appointment.client}
                </td>
                <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">
                  {appointment.nutritionist}
                </td>
                <td className="px-3 py-4">
                  <p className="text-[11px]">
                    {appointment.date}
                  </p>
                  <p className="text-[10px] text-[#2D312E]/40">
                    {appointment.time}
                  </p>
                </td>
                <td className="px-3 py-4">
                  <StatusBadge status={appointment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}