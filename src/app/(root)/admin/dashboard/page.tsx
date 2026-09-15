'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/app/components/admin/StatCard';
import AppointmentsTable from '@/app/components/admin/AppointmentsTable';
import VerificationRequests from '@/app/components/admin/VerificationRequests';
import QuickActions from '@/app/components/admin/QuickActions';
import type { StatIcon } from '@/app/components/admin/StatCard';
import {
  getDashboardStats,
  type DashboardStat,
} from '@/app/libs/api/admin/dashboard';
import { getAdminProfile } from "@/app/libs/api/admin/profile";

type Stat = DashboardStat & {
  icon: StatIcon;
};



function useDashboardStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      setIsLoading(true);
      setError(null);
      try {
        
         const data = await getDashboardStats();
         if (isMounted) setStats(data);
        
      } catch  {
        
        if (isMounted) {
          setError('Unable to load dashboard stats.');
          
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  return { stats, isLoading, error };
}
function useAdminFirstName() {
  const [firstName, setFirstName] = useState('Administrator');

  useEffect(() => {
    async function loadAdminProfile() {
      try {
        const profile = await getAdminProfile();

        const fullName = profile.full_name?.trim() || 'Administrator';
        setFirstName(fullName.split(' ')[0]);
      } catch {
        // Keep the default fallback name
      }
    }

    loadAdminProfile();
  }, []);

  return firstName;
}

export default function AdminDashboard() {
  const firstName = useAdminFirstName();
  const { stats, isLoading, error } = useDashboardStats();

  return (
    <>
      <section className="relative mb-7 overflow-hidden rounded-2xl bg-[#3D5A4C] p-6 lg:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#DCC48E]/20" />
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DCC48E]">
            Megeb+ Administration
          </p>
          <h1 className="font-display text-2xl text-white lg:text-3xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Manage users, nutritionists, appointments, payments, food data and
            platform activity from your administration portal.
          </p>
        </div>
      </section>

      {error && <p className="mb-3 text-[12px] font-medium text-red-600">{error}</p>}

      <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} loading={isLoading} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <AppointmentsTable />
        <VerificationRequests />
      </div>

      <QuickActions />
    </>
  );
}