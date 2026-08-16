'use client';

import { useEffect, useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

type NutritionistStatus = 'Pending' | 'Approved' | 'Rejected';

type NutritionistApplication = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  credentialType: string;
  licenseNumber: string;
  status: NutritionistStatus;
  appliedDate: string;
};

const STATUS_FILTERS: (NutritionistStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected'];

function useNutritionistApplications() {
  const [applications, setApplications] = useState<NutritionistApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchApplications() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<NutritionistApplication[]>('/admin/nutritionists');
        // if (isMounted) setApplications(data);
        if (isMounted) setApplications([]);
      } catch (err) {
        console.error('Unable to load nutritionist applications:', err);
        if (isMounted) setError('Unable to load nutritionist applications.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchApplications();
    return () => { isMounted = false; };
  }, []);

  return { applications, isLoading, error, setApplications };
}

export default function NutritionistsPage() {
  const { applications, isLoading, error, setApplications } = useNutritionistApplications();
  const [statusFilter, setStatusFilter] = useState<NutritionistStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesQuery = app.name.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  async function updateStatus(id: string, status: NutritionistStatus) {
    // Backend API will be connected here later.
    // await apiFetch(`/admin/nutritionists/${id}`, { method: 'PATCH', data: { status } });

    setApplications((previous) =>
      previous.map((app) => (app.id === id ? { ...app, status } : app))
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">Nutritionists</h1>
        <p className="mt-1 text-[12px] text-[#2D312E]/50">Review and manage nutritionist applications.</p>
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
            placeholder="Search by name"
            className="w-full rounded-xl border border-[#2D312E]/10 bg-white py-2 pl-9 pr-3 text-[12px] outline-none focus:border-[#3D5A4C]"
          />
        </div>
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Name</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Specialty</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Credential</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Applied</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Status</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">Loading applications…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">No applications found.</td></tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="border-b border-[#2D312E]/[0.04] last:border-0">
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-semibold">{app.name}</p>
                      <p className="text-[10px] text-[#2D312E]/40">{app.email}</p>
                    </td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{app.specialty}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{app.credentialType} · {app.licenseNumber}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{app.appliedDate}</td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                          app.status === 'Approved'
                            ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 text-red-500'
                            : 'bg-[#F7EFD9] text-[#8A6D2D]'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      {app.status === 'Pending' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateStatus(app.id, 'Approved')}
                            className="flex items-center gap-1 rounded-lg bg-[#3D5A4C] px-2 py-1.5 text-[10px] font-semibold text-white hover:bg-[#4E876E]"
                          >
                            <Check className="h-3 w-3" strokeWidth={2.5} />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(app.id, 'Rejected')}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1.5 text-[10px] font-semibold text-red-500 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" strokeWidth={2.5} />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}