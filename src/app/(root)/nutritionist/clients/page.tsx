"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Menu,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import apiClient from "@/app/libs/api/client";

type Client = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_picture: string | null;
  is_verified: boolean;
  preferences: string[];
  allergies: string[];
  nutrition_plans: {
    id: number;
    plan_name: string;
    status: string;
    start_date: string;
    end_date: string;
  }[];
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
        const response = await apiClient.get(
          "/api/nutritionist/clients/"
        );

        console.log("CLIENTS API RESPONSE:", response.data);

        if (isMounted) {
          setClients(response.data);
        }
      } catch (err) {
        console.error("Unable to load clients:", err);

        if (isMounted) {
          setError("Unable to load clients.");
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

  return {
    clients,
    isLoading,
    error,
  };
}

export default function ClientsPage() {
  const { clients, isLoading, error } = useClients();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((client) => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      client.full_name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.includes(query) ||
      String(client.id).includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* MOBILE HEADER */}
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <Link
          href="/nutritionist/dashboard"
          className="flex items-center"
        >
          <div className="rounded-full border border-[#CCD6C4] bg-[#E9F0EC] px-4 py-1.5">
            <span className="font-display text-xl font-bold text-[#3D5A4C]">
              Megeb<span className="text-[#4E876E]">+</span>
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN */}
      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* PAGE HEADER */}
          <div className="mb-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Users size={21} />
                </div>

                <h1 className="font-display text-[30px] text-[#2D312E]">
                  Clients
                </h1>

                <p className="font-body mt-2 text-[12px] text-[#2D312E]/45">
                  Manage and view your clients and their information.
                </p>
              </div>

              {/* TOTAL CLIENTS */}
              <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
                <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-[#2D312E]/40">
                  Total Clients
                </p>

                <p className="font-display mt-1 text-[24px] text-[#3D5A4C]">
                  {clients.length}
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-4 font-body text-[12px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/40 focus:ring-2 focus:ring-[#4E876E]/10"
              />
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3">
              <p className="font-body text-[12px] font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* CLIENT LIST */}
          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            {/* HEADER */}
            <div className="border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
              <h2 className="font-display text-[20px] text-[#2D312E]">
                All Clients
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                {isLoading
                  ? "Loading clients..."
                  : `${filteredClients.length} client${
                      filteredClients.length !== 1 ? "s" : ""
                    } found`}
              </p>
            </div>

            {/* LOADING */}
            {isLoading ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                  <Users size={21} />
                </div>

                <h3 className="font-display mt-4 text-[18px] text-[#2D312E]">
                  Loading clients...
                </h3>

                <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                  Please wait while your clients are loaded.
                </p>
              </div>
            ) : filteredClients.length > 0 ? (
              /* CLIENTS */
              <div className="divide-y divide-[#2D312E]/[0.06]">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FAF9F6]/70 sm:flex-row sm:items-center sm:px-6"
                  >
                    {/* CLIENT */}
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                        {client.profile_picture ? (
                          <img
                            src={client.profile_picture}
                            alt={client.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound size={19} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-body text-[12.5px] font-bold text-[#2D312E]">
                          {client.full_name}
                        </p>

                        <p className="mt-1 truncate font-body text-[10px] text-[#2D312E]/40">
                          {client.email}
                        </p>
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="sm:w-[180px]">
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                        Phone
                      </p>

                      <p className="mt-1 font-body text-[11px] text-[#2D312E]/65">
                        {client.phone || "Not provided"}
                      </p>
                    </div>

                    {/* CLIENT ID */}
                    <div className="sm:w-[100px]">
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                        Client ID
                      </p>

                      <p className="mt-1 font-body text-[11px] text-[#2D312E]/65">
                        #{client.id}
                      </p>
                    </div>

                    {/* VIEW */}
                    <Link
                      href={`/nutritionist/clients/${client.id}`}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#4E876E] transition hover:bg-[#E9F0EC]"
                      aria-label={`View ${client.full_name}`}
                    >
                      <ChevronRight size={17} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              /* NO CLIENTS */
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                  <Users size={21} />
                </div>

                <h3 className="font-display mt-4 text-[18px] text-[#2D312E]">
                  No clients found
                </h3>

                <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                  {search
                    ? "Try searching for a different client."
                    : "You currently have no clients."}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}