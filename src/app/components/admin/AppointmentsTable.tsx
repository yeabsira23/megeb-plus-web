'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, XCircle, ArrowRight, LucideIcon } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export type Appointment = {
  id: string;
  client: string;
  nutritionist: string;
  date: string;
  time: string;
  status: AppointmentStatus;
};

type AppointmentsTableProps = {
  appointments?: Appointment[];
};

type StatusConfigEntry = {
  icon: LucideIcon;
  className: string;
};

const STATUS_CONFIG: Record<AppointmentStatus, StatusConfigEntry> = {
  Confirmed: { icon: CheckCircle2, className: 'bg-[#E9F0EC] text-[#3D5A4C]' },
  Pending: { icon: Clock, className: 'bg-[#F7EFD9] text-[#8A6D2D]' },
  Cancelled: { icon: XCircle, className: 'bg-red-50 text-red-500' },
};

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { id: '1', client: 'Sara Abebe', nutritionist: 'Dr. Hana Bekele', date: 'Today', time: '10:30 AM', status: 'Confirmed' },
  { id: '2', client: 'Mekdes Tadesse', nutritionist: 'Dr. Samuel Alemu', date: 'Today', time: '1:00 PM', status: 'Pending' },
  { id: '3', client: 'Abel Tesfaye', nutritionist: 'Dr. Hana Bekele', date: 'Tomorrow', time: '9:00 AM', status: 'Confirmed' },
  { id: '4', client: 'Rahel Girma', nutritionist: 'Dr. Meron Worku', date: 'Tomorrow', time: '3:30 PM', status: 'Cancelled' },
];

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  const { icon: Icon, className } = config;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold ${className}`}>
      <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      {status}
    </span>
  );
}

function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchAppointments() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<Appointment[]>('/admin/appointments?limit=10&sort=recent');
        // if (isMounted) setAppointments(data);
        if (isMounted) setAppointments(DEFAULT_APPOINTMENTS);
      } catch (err) {
        console.error('Unable to load appointments:', err);
        if (isMounted) {
          setError('Unable to load appointments.');
          setAppointments(DEFAULT_APPOINTMENTS);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchAppointments();
    return () => { isMounted = false; };
  }, []);

  return { appointments, isLoading, error };
}

export default function AppointmentsTable({ appointments: appointmentsProp }: AppointmentsTableProps) {
  const fetched = useAppointments();
  const appointments = appointmentsProp ?? fetched.appointments;
  const isLoading = appointmentsProp ? false : fetched.isLoading;
  const error = appointmentsProp ? null : fetched.error;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-4">
        <div>
          <h3 className="font-display text-[19px]">Recent appointments</h3>
          <p className="mt-1 text-[11px] text-[#2D312E]/65">Latest consultation activity</p>
        </div>
        <Link href="/admin/appointments" className="flex items-center gap-1 text-[11px] font-semibold text-[#4E876E]">
          View all
          <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
        </Link>
      </div>

      {error && <p className="px-5 pt-3 text-[11px] font-medium text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#2D312E]/[0.05] text-left">
              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Client</th>
              <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Nutritionist</th>
              <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Schedule</th>
              <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-b border-[#2D312E]/[0.04] last:border-0">
                  <td className="px-5 py-4"><div className="h-3 w-28 animate-pulse rounded bg-[#E9F0EC]" /></td>
                  <td className="px-3 py-4"><div className="h-3 w-32 animate-pulse rounded bg-[#E9F0EC]" /></td>
                  <td className="px-3 py-4"><div className="h-3 w-16 animate-pulse rounded bg-[#E9F0EC]" /></td>
                  <td className="px-3 py-4"><div className="h-4 w-20 animate-pulse rounded-full bg-[#E9F0EC]" /></td>
                </tr>
              ))
            ) : appointments.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/55">No recent appointments.</td></tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-[#2D312E]/[0.04] last:border-0">
                  <td className="px-5 py-4 text-[12px] font-semibold">{appointment.client}</td>
                  <td className="px-3 py-4 text-[11px] text-[#2D312E]/75">{appointment.nutritionist}</td>
                  <td className="px-3 py-4">
                    <p className="text-[11px]">{appointment.date}</p>
                    <p className="text-[10px] text-[#2D312E]/55">{appointment.time}</p>
                  </td>
                  <td className="px-3 py-4"><StatusBadge status={appointment.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}