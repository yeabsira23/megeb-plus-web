'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import StatCard from '../../components/admin/StatCard';
import AppointmentsTable from '../../components/admin/AppointmentsTable';
import VerificationRequests from '../../components/admin/VerificationRequests';
import QuickActions from '../../components/admin/QuickActions';

const STATS = [
  {
    title: 'Total Users',
    value: '1,248',
    change: '+12.5%',
    description: 'registered users',
    icon: 'users',
  },
  {
    title: 'Nutritionists',
    value: '86',
    change: '+8.2%',
    description: 'active professionals',
    icon: 'doctor',
  },
  {
    title: 'Appointments',
    value: '324',
    change: '+14.8%',
    description: 'this month',
    icon: 'calendar',
  },
  {
    title: 'Revenue',
    value: 'ETB 84,650',
    change: '+18.4%',
    description: 'this month',
    icon: 'money',
  },
];

function useAdminName() {
  const [adminName, setAdminName] = useState(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setAdminName(parsedUser.full_name || parsedUser.name || 'Administrator');
      } else {
        setAdminName('Administrator');
      }
    } catch (error) {
      console.error('Unable to read user data:', error);
      setAdminName('Administrator');
    }
  }, []);

  return adminName ?? 'Administrator';
}

export default function AdminDashboard() {
  const adminName = useAdminName();
  const firstName = adminName.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Sidebar />
      <div className="lg:ml-[250px]">
        <Topbar adminName={adminName} />

        <main className="p-5 lg:p-8">
          {/* Welcome Section */}
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
                Manage users, nutritionists, appointments, payments,
                food data and platform activity from your administration portal.
              </p>
            </div>
          </section>

          {/* Statistics */}
          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </section>

          {/* Main dashboard content */}
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <AppointmentsTable />
            <VerificationRequests />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
}