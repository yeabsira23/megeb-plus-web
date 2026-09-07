'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';

type ReportMetric = {
  label: string;
  value: string;
  change: string;
};

type MonthlyPoint = {
  month: string;
  value: number;
};
const DEFAULT_METRICS: ReportMetric[] = [
  { label: 'New Users', value: '186', change: '+14.2% vs last month' },
  { label: 'Appointments Booked', value: '324', change: '+8.6% vs last month' },
  { label: 'Revenue', value: 'ETB 84,650', change: '+18.4% vs last month' },
  { label: 'Avg. Rating', value: '4.7 / 5', change: '+0.2 vs last month' },
];

const DEFAULT_MONTHLY_SIGNUPS: MonthlyPoint[] = [
  { month: 'Mar', value: 62 },
  { month: 'Apr', value: 78 },
  { month: 'May', value: 91 },
  { month: 'Jun', value: 105 },
  { month: 'Jul', value: 140 },
  { month: 'Aug', value: 186 },
];

function useReportData() {
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  const [monthlySignups, setMonthlySignups] = useState<MonthlyPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchReportData() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<{ metrics: ReportMetric[]; monthlySignups: MonthlyPoint[] }>('/admin/reports/overview');
        // if (isMounted) { setMetrics(data.metrics); setMonthlySignups(data.monthlySignups); }
        if (isMounted) {
          setMetrics(DEFAULT_METRICS); // TEMP: sample data for preview
          setMonthlySignups(DEFAULT_MONTHLY_SIGNUPS); // TEMP: sample data for preview
        }
      } catch (err) {
        console.error('Unable to load report data:', err);
        if (isMounted) setError('Unable to load report data.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchReportData();
    return () => { isMounted = false; };
  }, []);

  return { metrics, monthlySignups, isLoading, error };
}

export default function ReportsPage() {
  const { metrics, monthlySignups, isLoading, error } = useReportData();
  const maxValue = Math.max(1, ...monthlySignups.map((point) => point.value));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">Reports & Analytics</h1>
        <p className="mt-1 text-[12px] text-[#2D312E]/70">Platform performance at a glance.</p>
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl border border-[#2D312E]/[0.06] bg-[#E9F0EC]" />
          ))
        ) : metrics.length === 0 ? (
          <p className="col-span-full text-[12px] text-[#2D312E]/55">No metrics available yet.</p>
        ) : (
          metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-[#2D312E]/[0.06] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2D312E]/55">{metric.label}</p>
              <p className="mt-1 font-display text-[22px]">{metric.value}</p>
              <p className="mt-1 text-[10px] font-semibold text-[#4E876E]">{metric.change}</p>
            </div>
          ))
        )}
      </section>

      <section className="rounded-2xl border border-[#2D312E]/[0.06] bg-white p-5 shadow-sm lg:p-6">
        <h3 className="font-display text-[17px] text-[#2D312E]">Monthly sign-ups</h3>
        <p className="mt-1 text-[11px] text-[#2D312E]/65">New users per month</p>

        <div className="mt-6 flex h-40 items-end gap-3">
          {monthlySignups.length === 0 ? (
            <p className="text-[12px] text-[#2D312E]/55">No data yet.</p>
          ) : (
            monthlySignups.map((point) => (
              <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-md bg-[#3D5A4C]" style={{ height: `${(point.value / maxValue) * 100}%` }} />
                <span className="text-[9px] text-[#2D312E]/55">{point.month}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}