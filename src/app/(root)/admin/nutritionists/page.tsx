"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronRight, Mail, Phone } from "lucide-react";

import {
  getNutritionists,
  type NutritionistApplication,
} from "@/app/libs/api/admin/nutritionist";

type NutritionistStatus = "Pending" | "Approved" | "Rejected";

const STATUS_FILTERS: (NutritionistStatus | "All")[] = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
];

function NutritionistsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [applications, setApplications] = useState<
    NutritionistApplication[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialStatus = searchParams.get("status");

  const capitalized = initialStatus
    ? initialStatus.charAt(0).toUpperCase() + initialStatus.slice(1)
    : "All";

  const [statusFilter, setStatusFilter] = useState<
    NutritionistStatus | "All"
  >(
    (["Pending", "Approved", "Rejected"].includes(capitalized)
      ? capitalized
      : "All") as NutritionistStatus | "All"
  );

  const [query, setQuery] = useState(
    searchParams.get("search") ?? ""
  );

  // Load nutritionists from backend
  useEffect(() => {
    let isMounted = true;

    async function fetchNutritionists() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getNutritionists();

        if (isMounted) {
          setApplications(data);
        }
      } catch (err) {
        console.error("Unable to load nutritionists:", err);

        if (isMounted) {
          setError("Unable to load nutritionists.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchNutritionists();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = applications.filter((app) => {
    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    const searchText = query.toLowerCase().trim();

    const matchesQuery =
      !searchText ||
      app.fullName?.toLowerCase().includes(searchText) ||
      app.email?.toLowerCase().includes(searchText) ||
      app.specialization?.toLowerCase().includes(searchText);

    return matchesStatus && matchesQuery;
  });

  function handleReview(app: NutritionistApplication) {
    const params = new URLSearchParams({
      status: app.status.toLowerCase(),
      search: app.fullName,
    });

    router.push(
      `/admin/verification-requests?${params.toString()}`
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">
          Nutritionists
        </h1>

        <p className="mt-1 text-[12px] text-[#2D312E]/70">
          All nutritionist applications on the platform. Review
          credentials and documents on the Verification Requests page.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                statusFilter === status
                  ? "bg-[#3D5A4C] text-white"
                  : "border border-[#2D312E]/10 bg-white text-[#2D312E]/70 hover:bg-[#FAF9F6]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D312E]/40" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="w-full rounded-xl border border-[#2D312E]/10 bg-white py-2 pl-9 pr-3 text-[12px] text-[#2D312E] outline-none focus:border-[#3D5A4C]"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Nutritionist
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Role & Specialty
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Experience
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Credential
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  License
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Applied
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Status
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55"></th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-[12px] text-[#2D312E]/50"
                  >
                    Loading nutritionists...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                /* Empty */
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-[12px] text-[#2D312E]/50"
                  >
                    No nutritionists found.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-[#2D312E]/[0.04] last:border-0"
                  >
                    {/* Nutritionist */}
                    <td className="px-5 py-4">
                      <p className="text-[12.5px] font-semibold text-[#2D312E]">
                        {app.fullName}
                      </p>

                      <div className="mt-1 flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-[10px] text-[#2D312E]/60">
                          <Mail className="h-2.5 w-2.5" />
                          {app.email}
                        </span>

                        <span className="flex items-center gap-1 text-[10px] text-[#2D312E]/60">
                          <Phone className="h-2.5 w-2.5" />
                          {app.phone}
                        </span>
                      </div>
                    </td>

                    {/* Role & Specialty */}
                    <td className="px-3 py-4">
                      <p className="text-[11.5px] font-medium text-[#2D312E]/85">
                        {app.currentRole}
                      </p>

                      <p className="text-[10.5px] text-[#2D312E]/60">
                        {app.specialization}
                      </p>
                    </td>

                    {/* Experience */}
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/75">
                      {app.yearsOfExperience} years
                    </td>

                    {/* Credential */}
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/75">
                      {app.credentialType} ·{" "}
                      {app.credentialNumber}
                    </td>

                    {/* License */}
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/75">
                      {app.licenseNumber}

                      <span className="block text-[10px] text-[#2D312E]/55">
                        {app.licenseState}
                      </span>
                    </td>

                    {/* Applied */}
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/75">
                      {app.submitted || app.appliedDate}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                          app.status === "Approved"
                            ? "bg-[#E9F0EC] text-[#3D5A4C]"
                            : app.status === "Rejected"
                            ? "bg-red-50 text-red-500"
                            : "bg-[#F7EFD9] text-[#8A6D2D]"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* Review */}
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        onClick={() => handleReview(app)}
                        className="flex items-center gap-0.5 rounded-lg border border-[#3D5A4C]/15 px-2.5 py-1.5 text-[10px] font-semibold text-[#3D5A4C] hover:bg-[#E9F0EC]"
                      >
                        Review

                        <ChevronRight
                          className="h-3 w-3"
                          strokeWidth={2.5}
                        />
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

export default function NutritionistsPage() {
  return (
    <Suspense
      fallback={
        <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/50">
          Loading applications…
        </div>
      }
    >
      <NutritionistsContent />
    </Suspense>
  );
}
