'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Search, UserRound, Users } from 'lucide-react';
import { getClients } from '@/app/libs/api/admin/clients';
type ClientStatus = 'Active' | 'Suspended' | 'Inactive';

type Client = {
  id: string;
  name: string;
  age: number;
  assignedNutritionist: string | null;
   nextAppointment: {
    date: string;
    time: string;
  };
  status: ClientStatus;
};


function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadClients() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getClients();

        if (isMounted) {
          setClients(data);
        }
      } catch (err) {
        console.error('Unable to load clients:', err);

        if (isMounted) {
          setError('Unable to load clients.');
          setClients([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadClients();

    return () => {
      isMounted = false;
    };
  }, []);

  return { clients, isLoading, error };
}
 

export default function ClientsPage() {
  const { clients, isLoading, error } = useClients();
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
            <Users size={21} />
          </div>
          <h1 className="font-display text-[26px] text-[#2D312E]">Clients</h1>
          <p className="mt-1 text-[12px] text-[#2D312E]/65">
            Platform users who book consultations with nutritionists.
          </p>
        </div>

        <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#2D312E]/55">Total Clients</p>
          <p className="font-display mt-1 text-[22px] text-[#3D5A4C]">{clients.length}</p>
        </div>
      </div>

      {/* SEARCH */}
      <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D312E]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-4 text-[12px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/40 focus:border-[#4E876E]/40 focus:ring-2 focus:ring-[#4E876E]/10"
          />
        </div>
      </section>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

      {/* CLIENT LIST */}
      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
        <div className="border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
          <h2 className="font-display text-[19px] text-[#2D312E]">All Clients</h2>
          <p className="mt-1 text-[11px] text-[#2D312E]/60">
            {isLoading ? 'Loading clients...' : `${filteredClients.length} client${filteredClients.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
              <Users size={21} />
            </div>
            <h3 className="font-display mt-4 text-[17px] text-[#2D312E]">Loading clients...</h3>
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="divide-y divide-[#2D312E]/[0.06]">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FAF9F6]/70 sm:flex-row sm:items-center sm:px-6"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                    <UserRound size={19} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-bold text-[#2D312E]">{client.name}</p>
                    <p className="mt-1 text-[10px] text-[#2D312E]/60">{client.age} years old</p>
                  </div>
                </div>

                <div className="sm:w-[170px]">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/50">Assigned Nutritionist</p>
                  <p className="mt-1 text-[11px] text-[#2D312E]/75">{client.assignedNutritionist ?? 'None assigned'}</p>
                </div>

                <div className="sm:w-[150px]">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/50">Next Appointment</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <CalendarDays size={12} className="text-[#4E876E]" />
                    <p className="text-[11px] text-[#2D312E]/75"> {client.nextAppointment.date} {client.nextAppointment.time}</p>
                  </div>
                </div>

                <div className="sm:w-[90px]">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                      client.status === 'Active'
                        ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                        : client.status === 'Suspended'
                        ? 'bg-red-50 text-red-500'
                        : 'bg-[#2D312E]/[0.06] text-[#2D312E]/60'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                <Link
                  href={`/admin/clients/${client.id}`}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#4E876E] transition hover:bg-[#E9F0EC]"
                  aria-label={`View ${client.name}`}
                >
                  <ChevronRight size={17} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
              <Users size={21} />
            </div>
            <h3 className="font-display mt-4 text-[17px] text-[#2D312E]">No clients found</h3>
            <p className="mt-1 text-[11px] text-[#2D312E]/60">Try searching for a different name.</p>
          </div>
        )}
      </section>
    </div>
  );
}