'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import {
  getUsers,
  updateUserStatus,
  type AdminUser,
  type UserStatus,
} from '@/app/libs/api/admin/user';
 function useUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getUsers();

        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        console.error('Unable to load users:', err);

        if (isMounted) {
          setError('Unable to load users.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return { users, isLoading, error, setUsers };
}





function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#3D5A4C]' : 'bg-[#2D312E]/20'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
export default function UsersPage() {
  const { users, isLoading, error:loadError, setUsers, } = useUsers();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  

  const filteredUsers = users.filter((user) => {
  const searchQuery = query.toLowerCase();

  const name = (user.name ?? "").toLowerCase();
  const email = (user.email ?? "").toLowerCase();

  return (
    name.includes(searchQuery) ||
    email.includes(searchQuery)
  );
});

 async function toggleStatus(id: number) {
  const target = users.find((user) => user.id === id);

  if (!target) return;

  const newStatus: UserStatus =
    target.status === 'Active' ? 'Suspended' : 'Active';

  try {
    const updatedUser = await updateUserStatus(id, newStatus);

    setUsers((previous) =>
      previous.map((user) =>
        user.id === id ? updatedUser : user
      )
    );
  } catch (err) {
    console.error('Unable to update user status:', err);
    setError('Unable to update user status.');
  } finally {
      setUpdatingUserId(null);
  }
}

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">Users</h1>
        <p className="mt-1 text-[12px] text-[#2D312E]/70">View and manage platform user accounts.</p>
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

      {(loadError || error) && <p className="text-[12px] font-medium text-red-600">{error || loadError}</p>}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Name</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Email</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Joined</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Status</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/55">Loading users…</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/55">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#2D312E]/[0.04] last:border-0">
                    <td className="px-5 py-4 text-[12px] font-semibold">{user.name}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/75">{user.email}</td>
                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/75">{user.joinedDate}</td>
                    <td className="px-3 py-4">
  <div className="flex items-center gap-2.5">
    <ToggleSwitch
      checked={user.status === 'Active'}
      onChange={() => toggleStatus(user.id)}
      label={user.status === 'Active' ? `Suspend ${user.name}` : `Reactivate ${user.name}`}
    />
    <span
      className={`text-[10px] font-semibold ${
        user.status === 'Active' ? 'text-[#3D5A4C]' : 'text-red-500'
      }`}
    >
      {user.status}
    </span>
  </div>
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