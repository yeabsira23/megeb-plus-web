'use client';

import { useEffect, useState } from 'react';
import { Search, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';
import type { Appointment, AppointmentStatus } from '@/app/components/admin/AppointmentsTable';

const STATUS_CONFIG: Record<AppointmentStatus, { icon: typeof CheckCircle2; className: string }> = {
  Confirmed: { icon: CheckCircle2, className: 'bg-[#E9F0EC] text-[#3D5A4C]' },
  Pending: { icon: Clock, className: 'bg-[#F7EFD9] text-[#8A6D2D]' },
  Cancelled: { icon: XCircle, className: 'bg-red-50 text-red-500' },
};

const STATUS_FILTERS: (AppointmentStatus | 'All')[] = ['All', 'Confirmed', 'Pending', 'Cancelled'];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { id: '1', client: 'Sara Abebe', nutritionist: 'Dr. Hana Bekele', date: 'Today', time: '10:30 AM', status: 'Confirmed' },
  { id: '2', client: 'Mekdes Tadesse', nutritionist: 'Dr. Samuel Alemu', date: 'Today', time: '1:00 PM', status: 'Pending' },
  { id: '3', client: 'Abel Tesfaye', nutritionist: 'Dr. Hana Bekele', date: 'Tomorrow', time: '9:00 AM', status: 'Confirmed' },
  { id: '4', client: 'Rahel Girma', nutritionist: 'Dr. Meron Worku', date: 'Tomorrow', time: '3:30 PM', status: 'Cancelled' },
];

function useAllAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchAppointments() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<Appointment[]>('/admin/appointments');
        // if (isMounted) setAppointments(data);
        if (isMounted) setAppointments(DEFAULT_APPOINTMENTS); // TEMP: sample data for preview
      } catch (err) {
        console.error('Unable to load appointments:', err);
        if (isMounted) setError('Unable to load appointments.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchAppointments();
    return () => { isMounted = false; };
  }, []);

  return { appointments, isLoading, error };
}

export default function AppointmentsPage() {
  const { appointments, isLoading, error } = useAllAppointments();
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = appointments.filter((appointment) => {
    const matchesStatus = statusFilter === 'All' || appointment.status === statusFilter;
    const matchesQuery =
      appointment.client.toLowerCase().includes(query.toLowerCase()) ||
      appointment.nutritionist.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">Appointments</h1>
        <p className="mt-1 text-[12px] text-[#2D312E]/50">All consultations across the platform.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                statusFilter === status
                  ? 'bg-[#3D5A4C] text-white'
                  : 'bg-white text-[#2D312E]/60 border border-[#2D312E]/10 hover:bg-[#FAF9F6]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D312E]/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search client or nutritionist"
            className="w-full rounded-xl border border-[#2D312E]/10 bg-white py-2 pl-9 pr-3 text-[12px] outline-none focus:border-[#3D5A4C]"
          />
        </div>
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Client</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Nutritionist</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Schedule</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">Loading appointments…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">No appointments match your filters.</td></tr>
              ) : (
                filtered.map((appointment) => {
                  const { icon: Icon, className } = STATUS_CONFIG[appointment.status];
                  return (
                    <tr key={appointment.id} className="border-b border-[#2D312E]/[0.04] last:border-0">
                      <td className="px-5 py-4 text-[12px] font-semibold">{appointment.client}</td>
                      <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{appointment.nutritionist}</td>
                      <td className="px-3 py-4">
                        <p className="text-[11px]">{appointment.date}</p>
                        <p className="text-[10px] text-[#2D312E]/40">{appointment.time}</p>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold ${className}`}>
                          <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}