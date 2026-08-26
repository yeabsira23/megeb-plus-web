'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

type UserStatus = 'Active' | 'Suspended';

type PlatformUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  joinedDate: string;
};

const DEFAULT_USERS: PlatformUser[] = [
  { id: '1', name: 'Sara Abebe', email: 'sara.abebe@example.com', status: 'Active', joinedDate: 'Jan 12, 2026' },
  { id: '2', name: 'Mekdes Tadesse', email: 'mekdes.t@example.com', status: 'Active', joinedDate: 'Feb 3, 2026' },
  { id: '3', name: 'Abel Tesfaye', email: 'abel.tesfaye@example.com', status: 'Suspended', joinedDate: 'Feb 20, 2026' },
  { id: '4', name: 'Rahel Girma', email: 'rahel.girma@example.com', status: 'Active', joinedDate: 'Mar 8, 2026' },
  { id: '5', name: 'Yonas Bekele', email: 'yonas.bekele@example.com', status: 'Active', joinedDate: 'Apr 15, 2026' },
];

function useUsers() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchUsers() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<PlatformUser[]>('/admin/users');
        // if (isMounted) setUsers(data);
        if (isMounted) setUsers(DEFAULT_USERS); // TEMP: sample data for preview
      } catch (err) {
        console.error('Unable to load users:', err);
        if (isMounted) setError('Unable to load users.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  return { users, isLoading, error, setUsers };
}

export default function UsersPage() {
  const { users, isLoading, error, setUsers } = useUsers();
  const [query, setQuery] = useState('');

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );

  async function toggleStatus(id: string) {
    const target = users.find((user) => user.id === id);
    if (!target) return;
    const newStatus: UserStatus = target.status === 'Active' ? 'Suspended' : 'Active';

    // Backend API will be connected here later.
    // await apiFetch(`/admin/users/${id}`, { method: 'PATCH', data: { status: newStatus } });

    setUsers((previous) =>
      previous.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">Users</h1>
        <p className="mt-1 text-[12px] text-[#2D312E]/50">View and manage platform user accounts.</p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D312E]/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email"
          className="w-full rounded-xl border border-[#2D312E]/10 bg-white py-2 pl-9 pr-3 text-[12px] outline-none focus:border-[#3D5A4C]"
        />
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Name</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Email</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Joined</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40">Status</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/40"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">Loading users…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">No users found.</td></tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-b border-[#2D312E]/[0.04] last:border-0">
                    <td className="px-5 py-4 text-[12px] font-semibold">{user.name}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{user.email}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/60">{user.joinedDate}</td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                          user.status === 'Active' ? 'bg-[#E9F0EC] text-[#3D5A4C]' : 'bg-red-50 text-red-500'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatus(user.id)}
                        className="rounded-lg border border-[#2D312E]/10 px-2.5 py-1.5 text-[10px] font-semibold text-[#2D312E]/70 hover:bg-[#FAF9F6]"
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Reactivate'}
                      </button>
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