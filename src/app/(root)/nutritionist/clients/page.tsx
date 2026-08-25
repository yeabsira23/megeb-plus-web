"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Menu,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type ClientStatus = "Active" | "Inactive";

type Client = {
  id: string;
  name: string;
  age: number;
  goal: string;
  lastAppointment: string;
  status: ClientStatus;
};

/*
 * Temporary client data

 * Later, we will replace this with data from:
 * /nutritionist/clients
 */
const TEMPORARY_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Hana Tesfaye",
    age: 28,
    goal: "Weight Management",
    lastAppointment: "Today",
    status: "Active",
  },
  {
    id: "2",
    name: "Selam Alemu",
    age: 34,
    goal: "Diabetes Nutrition",
    lastAppointment: "Yesterday",
    status: "Active",
  },
  {
    id: "3",
    name: "Meron Kebede",
    age: 25,
    goal: "Healthy Lifestyle",
    lastAppointment: "Aug 11",
    status: "Active",
  },
  {
    id: "4",
    name: "Liya Michael",
    age: 31,
    goal: "Weight Management",
    lastAppointment: "Aug 8",
    status: "Inactive",
  },
];

/*
 * Clients data hook
 
 * Later, when the backend endpoint is ready, this
 * function can be changed to use apiFetch().
 */
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
        /*
         * TEMPORARY
         *
         * Backend is not connected yet.
         *
         * Later:
         *
         * const data = await apiFetch<Client[]>(
         *   "/nutritionist/clients"
         * );
         *
         * if (isMounted) {
         *   setClients(data);
         * }
         */

        // Small delay so the loading state can be displayed.
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (isMounted) {
          setClients(TEMPORARY_CLIENTS);
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

  /*
   * Search clients by name.
   */
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* ========================================= */}
      {/* MOBILE HEADER */}
      {/* ========================================= */}

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

      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ========================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================= */}

      <div className="lg:pl-[250px]">
        {/* Desktop Topbar */}
        <Topbar />

        {/* Page Content */}
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">

          {/* ========================================= */}
          {/* PAGE HEADER */}
          {/* ========================================= */}

          <div className="mb-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>
                {/* Icon */}
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Users size={21} />
                </div>

                {/* Title */}
                <h1 className="font-display text-[30px] text-[#2D312E]">
                  Clients
                </h1>

                {/* Description */}
                <p className="font-body mt-2 text-[12px] text-[#2D312E]/45">
                  Manage and view your clients and their nutrition progress.
                </p>
              </div>

              {/* Total Clients */}
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

          {/* ========================================= */}
          {/* SEARCH */}
          {/* ========================================= */}

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

          {/* ========================================= */}
          {/* ERROR */}
          {/* ========================================= */}

          {error && (
            <p className="mb-4 font-body text-[12px] font-medium text-red-600">
              {error}
            </p>
          )}

          {/* ========================================= */}
          {/* CLIENT LIST */}
          {/* ========================================= */}

          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">

            {/* List Header */}
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

            {/* ========================================= */}
            {/* LOADING */}
            {/* ========================================= */}

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

              /* ========================================= */
              /* CLIENTS */
              /* ========================================= */

              <div className="divide-y divide-[#2D312E]/[0.06]">

                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FAF9F6]/70 sm:flex-row sm:items-center sm:px-6"
                  >

                    {/* Client */}
                    <div className="flex min-w-0 flex-1 items-center gap-4">

                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                        <UserRound size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-body text-[12.5px] font-bold text-[#2D312E]">
                          {client.name}
                        </p>

                        <p className="mt-1 font-body text-[10px] text-[#2D312E]/40">
                          {client.age} years old
                        </p>
                      </div>

                    </div>

                    {/* Nutrition Goal */}
                    <div className="sm:w-[180px]">

                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                        Nutrition Goal
                      </p>

                      <p className="mt-1 font-body text-[11px] text-[#2D312E]/65">
                        {client.goal}
                      </p>

                    </div>

                    {/* Last Appointment */}
                    <div className="sm:w-[140px]">

                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                        Last Appointment
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">

                        <CalendarDays
                          size={12}
                          className="text-[#4E876E]"
                        />

                        <p className="font-body text-[11px] text-[#2D312E]/65">
                          {client.lastAppointment}
                        </p>

                      </div>

                    </div>

                    {/* Status */}
                    <div className="sm:w-[90px]">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 font-body text-[9px] font-bold ${
                          client.status === "Active"
                            ? "bg-[#E9F0EC] text-[#3D5A4C]"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {client.status}
                      </span>

                    </div>

                    {/* View Client */}
                    <Link
                      href={`/nutritionist/clients/${client.id}`}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#4E876E] transition hover:bg-[#E9F0EC]"
                      aria-label={`View ${client.name}`}
                    >
                      <ChevronRight size={17} />
                    </Link>

                  </div>
                ))}

              </div>

            ) : (

              /* ========================================= */
              /* NO CLIENTS */
              /* ========================================= */

              <div className="px-6 py-12 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                  <Users size={21} />
                </div>

                <h3 className="font-display mt-4 text-[18px] text-[#2D312E]">
                  No clients found
                </h3>

                <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                  Try searching for a different name.
                </p>

              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
}