"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Check,
  X,
  UserCheck,
  FileText,
  Mail,
  BriefcaseBusiness,
  IdCard,
  Award,
  FileCheck2,
  GraduationCap,
} from "lucide-react";

import DocumentPreviewModal, {
  SubmittedDocument,
} from "@/app/components/admin/DocumentPreviewModal";

import {
  getVerificationRequests,
  type VerificationRequest,
  type VerificationRequestStatus,
} from "@/app/libs/api/admin/verificationRequests";

import { updateNutritionistStatus } from "@/app/libs/api/admin/nutritionist";

const STATUS_FILTERS: (
  | VerificationRequestStatus
  | "All"
)[] = ["All", "Pending", "Approved", "Rejected"];

function isRequestStatus(
  value: string | null
): value is VerificationRequestStatus {
  return (
    value === "Pending" ||
    value === "Approved" ||
    value === "Rejected"
  );
}

function getInitial(name: string): string {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

function VerificationRequestsContent() {
  const searchParams = useSearchParams();

  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rawStatus = searchParams.get("status");

  const capitalizedStatus = rawStatus
    ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
    : null;

  const initialStatus: VerificationRequestStatus | "All" =
    isRequestStatus(capitalizedStatus)
      ? capitalizedStatus
      : "Pending";

  const initialSearch = searchParams.get("search") ?? "";

  const [statusFilter, setStatusFilter] = useState<
    VerificationRequestStatus | "All"
  >(initialStatus);

  const [query, setQuery] = useState(initialSearch);

  const [expandedId, setExpandedId] = useState<number | null>(
    null
  );

  const [previewDoc, setPreviewDoc] =
    useState<SubmittedDocument | null>(null);

  const [updatingId, setUpdatingId] = useState<number | null>(
    null
  );

  // Load real verification requests
  useEffect(() => {
    let isMounted = true;

    async function fetchRequests() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getVerificationRequests();

        if (isMounted) {
          setRequests(data);
        }
      } catch (err) {
        console.error(
          "Unable to load verification requests:",
          err
        );

        if (isMounted) {
          setError(
            "Unable to load verification requests."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, []);

 const filteredRequests = requests.filter((request) => {
  const matchesStatus =
    statusFilter === "All" || request.status === statusFilter;

  const searchText = query.trim().toLowerCase();

  const matchesSearch =
    !searchText ||
    request.name.toLowerCase().includes(searchText) ||
    request.specialty.toLowerCase().includes(searchText);

  return matchesStatus && matchesSearch;
});

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  async function updateStatus(
    id: number,
    status: VerificationRequestStatus
  ) {
    try {
      setUpdatingId(id);
      setError(null);

      const updated = await updateNutritionistStatus(
        id,
        status
      );

      setRequests((previous) =>
        previous.map((request) =>
          request.id === id
            ? {
                ...request,
                status: updated.status,
              }
            : request
        )
      );
    } catch (err) {
      console.error(
        "Unable to update verification request:",
        err
      );

      setError(
        "Unable to update verification request. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[23px] text-[#2D312E]">
            Verification Requests
          </h1>

          <p className="mt-1 text-[12px] text-[#2D312E]/70">
            Review nutritionist applications and approve or
            reject their credentials.
          </p>
        </div>

        {pendingCount > 0 && (
          <span className="flex w-fit items-center gap-1 rounded-full bg-[#F7EFD9] px-2.5 py-1 text-[10px] font-bold text-[#8A6D2D]">
            <UserCheck
              className="h-3 w-3"
              strokeWidth={2.5}
            />
            {pendingCount} pending
          </span>
        )}
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

      {/* Requests */}
      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-[12px] text-[#2D312E]/50">
            Loading verification requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/50">
            No verification requests found.
          </div>
        ) : (
          <div className="divide-y divide-[#2D312E]/[0.05]">
            {filteredRequests.map((request) => {
              const isExpanded =
                expandedId === request.id;

              const isUpdating =
                updatingId === request.id;

              return (
                <div key={request.id}>
                  {/* Request Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(
                        isExpanded ? null : request.id
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#FAF9F6]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] font-semibold text-[#3D5A4C]">
                        {getInitial(request.name)}
                      </div>

                      <div>
                        <p className="text-[12.5px] font-semibold text-[#2D312E]">
                          {request.name}
                        </p>

                        <p className="text-[10.5px] text-[#2D312E]/65">
                          {request.specialty || "Nutritionist"} · Submitted{" "}
  {request.submitted || "N/A"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                        request.status === "Approved"
                          ? "bg-[#E9F0EC] text-[#3D5A4C]"
                          : request.status === "Rejected"
                          ? "bg-red-50 text-red-500"
                          : "bg-[#F7EFD9] text-[#8A6D2D]"
                      }`}
                    >
                      {request.status}
                    </span>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="space-y-5 bg-[#FAF9F6]/60 px-5 py-5">
                      {/* Contact */}
                      <DetailGroup
                        icon={
                          <Mail className="h-3.5 w-3.5" />
                        }
                        title="Contact"
                      >
                        <DetailField
                          label="Email"
                          value={request.email}
                        />

                        <DetailField
                          label="Phone"
                          value={request.phone}
                        />
                      </DetailGroup>

                      {/* Professional Background */}
                      <DetailGroup
                        icon={
                          <BriefcaseBusiness className="h-3.5 w-3.5" />
                        }
                        title="Professional Background"
                      >
                        <DetailField
                          label="Current Role"
                          value={request.currentRole}
                        />

                        <DetailField
                          label="Years of Experience"
                          value={`${request.yearsOfExperience} years`}
                        />

                        <DetailField
                          label="Specialization"
                          value={
                            request.specialization ||
                            request.specialty ||
                            ""
                          }
                        />
                      </DetailGroup>

                      {/* License */}
                      <DetailGroup
                        icon={
                          <IdCard className="h-3.5 w-3.5" />
                        }
                        title="State License (LDN/CD)"
                      >
                        <DetailField
                          label="License Number"
                          value={request.licenseNumber}
                        />

                        <DetailField
                          label="State / Jurisdiction"
                          value={request.licenseState}
                        />

                        <DetailField
                          label="Expiration Date"
                          value={
                            request.licenseExpiration || ""
                          }
                        />
                      </DetailGroup>

                      {/* Credential */}
                      <DetailGroup
                        icon={
                          <Award className="h-3.5 w-3.5" />
                        }
                        title="National Credential (RDN/CNS)"
                      >
                        <DetailField
                          label="Credential Type"
                          value={request.credentialType}
                        />

                        <DetailField
                          label="Credential Number"
                          value={request.credentialNumber}
                        />
                      </DetailGroup>

                      {/* Insurance */}
                      <DetailGroup
                        icon={
                          <FileCheck2 className="h-3.5 w-3.5" />
                        }
                        title="Certificate of Insurance"
                      >
                        <DetailField
                          label="Provider"
                          value={
                            request.insuranceProvider || ""
                          }
                        />

                        <DetailField
                          label="Policy Number"
                          value={
                            request.policyNumber || ""
                          }
                        />

                        <DetailField
                          label="Expiration Date"
                          value={
                            request.insuranceExpiration ||
                            ""
                          }
                        />

                        <DetailField
                          label="Coverage Limit"
                          value={
                            request.coverageLimit || ""
                          }
                        />
                      </DetailGroup>

                      {/* Education */}
                      <DetailGroup
                        icon={
                          <GraduationCap className="h-3.5 w-3.5" />
                        }
                        title="Degree / Transcript"
                      >
                        <DetailField
                          label="Degree"
                          value={request.degree || ""}
                        />

                        <DetailField
                          label="Institution"
                          value={request.institution || ""}
                        />

                        <DetailField
                          label="Field of Study"
                          value={
                            request.fieldOfStudy || ""
                          }
                        />

                        <DetailField
                          label="Graduation Year"
                          value={
                            request.graduationYear
                              ? String(
                                  request.graduationYear
                                )
                              : ""
                          }
                        />
                      </DetailGroup>

                      {/* Documents */}
                      <div>
                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#2D312E]/80">
                          <FileText className="h-3.5 w-3.5" />
                          Submitted Documents
                        </p>

                        {request.documents?.length ? (
                          <div className="grid gap-2 sm:grid-cols-2">
                            {request.documents.map(
                              (doc, index) => {
                                const previewDocument =
                                  doc as SubmittedDocument;

                                return (
                                  <button
                                    key={`${doc.label}-${index}`}
                                    type="button"
                                    onClick={() =>
                                      setPreviewDoc(
                                        previewDocument
                                      )
                                    }
                                    className="flex items-center gap-2.5 rounded-xl border border-[#2D312E]/10 bg-white px-3 py-2.5 text-left transition hover:border-[#3D5A4C]/30 hover:bg-[#E9F0EC]/30"
                                  >
                                    <FileText className="h-4 w-4 shrink-0 text-[#4E876E]" />

                                    <div className="min-w-0">
                                      <p className="truncate text-[11px] font-semibold text-[#2D312E]">
                                        {doc.label}
                                      </p>

                                      <p className="truncate text-[9.5px] text-[#2D312E]/55">
                                        {doc.fileName}
                                      </p>
                                    </div>
                                  </button>
                                );
                              }
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-[#2D312E]/50">
                            No documents submitted.
                          </p>
                        )}
                      </div>

                      {/* Approve / Reject */}
                      {request.status === "Pending" && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "Approved"
                              )
                            }
                            className="flex items-center gap-1 rounded-lg bg-[#3D5A4C] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#4E876E] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check
                              className="h-3.5 w-3.5"
                              strokeWidth={2.5}
                            />

                            {isUpdating
                              ? "Updating..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "Rejected"
                              )
                            }
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <X
                              className="h-3.5 w-3.5"
                              strokeWidth={2.5}
                            />

                            {isUpdating
                              ? "Updating..."
                              : "Reject"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}

function DetailGroup({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#2D312E]/[0.06] bg-white p-4">
      <p className="mb-3 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#4E876E]">
        {icon}
        {title}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold text-[#2D312E]/60">
        {label}
      </p>

      <p className="mt-0.5 text-[12px] text-[#2D312E]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function VerificationRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/50">
          Loading verification requests…
        </div>
      }
    >
      <VerificationRequestsContent />
    </Suspense>
  );
}
