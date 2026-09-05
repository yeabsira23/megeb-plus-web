"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Check, X, UserCheck, FileText, Mail, BriefcaseBusiness, IdCard, Award, FileCheck2, GraduationCap } from 'lucide-react';
import DocumentPreviewModal, { SubmittedDocument } from '@/app/components/admin/DocumentPreviewModal';

import { Search, Check, X, UserCheck, FileText } from "lucide-react";

import DocumentPreviewModal, {
  SubmittedDocument,
} from "@/app/components/admin/DocumentPreviewModal";

type RequestStatus = "Pending" | "Approved" | "Rejected";

type VerificationRequestDetail = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentRole: string;
  yearsOfExperience: string;
  specialization: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiration: string;
  credentialType: string;
  credentialNumber: string;
  insuranceProvider: string;
  policyNumber: string;
  insuranceExpiration: string;
  coverageLimit: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;
  submitted: string;
  status: RequestStatus;
  documents: SubmittedDocument[];
};

const STORAGE_KEY = 'megeb_admin_nutritionist_applications';

const DEFAULT_REQUESTS: VerificationRequestDetail[] = [
  {
    id: '1',
    fullName: 'Bethlehem Kassa',
    email: 'bethlehem.kassa@example.com',
    phone: '+251 91 234 5678',
    currentRole: 'Clinical Nutritionist',
    yearsOfExperience: '6',
    specialization: 'Clinical nutrition, diabetes management',
    licenseNumber: 'LDN-4821',
    licenseState: 'Addis Ababa',
    licenseExpiration: '2027-04-30',
    credentialType: 'RDN',
    credentialNumber: 'RDN-77291',
    insuranceProvider: 'Nyala Insurance',
    policyNumber: 'POL-55043',
    insuranceExpiration: '2027-01-15',
    coverageLimit: '$1,000,000',
    degree: 'BSc Nutrition',
    institution: 'Addis Ababa University',
    fieldOfStudy: 'Nutrition and Dietetics',
    graduationYear: '2018',
    submitted: '2 hours ago',
    status: 'Pending',
    documents: [
      { label: 'State License', fileName: 'state_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'National Credential', fileName: 'credential_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'Certificate of Insurance', fileName: 'insurance_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'Degree / Transcript', fileName: 'degree_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
    ],
  },
  {
    id: '2',
    fullName: 'Yonatan Haile',
    email: 'yonatan.haile@example.com',
    phone: '+251 92 345 6789',
    currentRole: 'Sports Nutrition Consultant',
    yearsOfExperience: '4',
    specialization: 'Sports nutrition, athletic performance',
    licenseNumber: 'LDN-2237',
    licenseState: 'Oromia',
    licenseExpiration: '2026-11-20',
    credentialType: 'CNS',
    credentialNumber: 'CNS-40218',
    insuranceProvider: 'Awash Insurance',
    policyNumber: 'POL-19087',
    insuranceExpiration: '2026-09-10',
    coverageLimit: '$750,000',
    degree: 'MSc Sports Nutrition',
    institution: 'Jimma University',
    fieldOfStudy: 'Sports Science',
    graduationYear: '2021',
    submitted: '5 hours ago',
    status: 'Pending',
    documents: [
      { label: 'State License', fileName: 'state_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'National Credential', fileName: 'credential_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'Certificate of Insurance', fileName: 'insurance_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'Degree / Transcript', fileName: 'degree_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
    ],
  },
  {
    id: '3',
    fullName: 'Meron Fikru',
    email: 'meron.fikru@example.com',
    phone: '+251 93 456 7890',
    currentRole: 'Pediatric Dietitian',
    yearsOfExperience: '8',
    specialization: 'Pediatric nutrition, growth monitoring',
    licenseNumber: 'LDN-9013',
    licenseState: 'Amhara',
    licenseExpiration: '2027-06-05',
    credentialType: 'RDN',
    credentialNumber: 'RDN-30982',
    insuranceProvider: 'Nib Insurance',
    policyNumber: 'POL-77654',
    insuranceExpiration: '2027-03-01',
    coverageLimit: '$1,200,000',
    degree: 'BSc Nutrition and Dietetics',
    institution: 'Bahir Dar University',
    fieldOfStudy: 'Pediatric Nutrition',
    graduationYear: '2016',
    submitted: 'Yesterday',
    status: 'Approved',
    documents: [
      { label: 'State License', fileName: 'state_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
      { label: 'National Credential', fileName: 'credential_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
      { label: 'Certificate of Insurance', fileName: 'insurance_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
      { label: 'Degree / Transcript', fileName: 'degree_document.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
    ],
  },
];

function loadRequests(): VerificationRequestDetail[] {
  if (typeof window === 'undefined') return DEFAULT_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as VerificationRequestDetail[];
  } catch (err) {
    console.error('Unable to read cached requests:', err);
  }
  return DEFAULT_REQUESTS;
}

function saveRequests(requests: VerificationRequestDetail[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (err) {
    console.error('Unable to cache requests:', err);
  }
}

const STATUS_FILTERS: (RequestStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected'];

function isRequestStatus(
  value: string | null
): value is RequestStatus {
  return (
    value === "Pending" ||
    value === "Approved" ||
    value === "Rejected"
  );
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export default function VerificationRequestsPage() {
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<VerificationRequestDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const rawStatus = searchParams.get("status");

  const capitalizedStatus = rawStatus
    ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
    : null;

  const initialStatus: RequestStatus | "All" =
    isRequestStatus(capitalizedStatus)
      ? capitalizedStatus
      : "Pending";

  const initialSearch = searchParams.get("search") ?? "";

  const [statusFilter, setStatusFilter] =
    useState<RequestStatus | "All">(initialStatus);

  const [query, setQuery] = useState(initialSearch);

  const [expandedId, setExpandedId] = useState<string | null>(
    null
  );

  const [previewDoc, setPreviewDoc] =
    useState<SubmittedDocument | null>(null);

  useEffect(() => {
    // Backend API will be connected here later.
    // const data = await apiFetch<VerificationRequestDetail[]>('/admin/verification-requests');
    const data = loadRequests();
    setRequests(data);
    saveRequests(data); // ensure the key exists on first load
    setIsLoading(false);
  }, []);

  const filtered = requests.filter((request) => {
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesQuery = request.fullName.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  function updateStatus(id: string, status: RequestStatus) {
    // Backend API will be connected here later.
    //
    // await apiFetch(
    //   `/admin/verification-requests/${id}`,
    //   {
    //     method: "PATCH",
    //     data: { status },
    //   }
    // );

    const updated = requests.map((request) => (request.id === id ? { ...request, status } : request));
    setRequests(updated);
    saveRequests(updated);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[23px] text-[#2D312E]">Verification Requests</h1>
          <p className="mt-1 text-[12px] text-[#2D312E]/70">
            Review nutritionist applications and approve or reject their credentials.
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
                  ? 'bg-[#3D5A4C] text-white'
                  : 'bg-white text-[#2D312E]/70 border border-[#2D312E]/10 hover:bg-[#FAF9F6]'
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

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        {isLoading ? (
          <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/50">Loading verification requests…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/50">No verification requests found.</div>
        ) : (
          <div className="divide-y divide-[#2D312E]/[0.05]">
            {filtered.map((request) => {
              const isExpanded =
                expandedId === request.id;

              return (
                <div key={request.id}>
                  {/* Request Row */}
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
                        {getInitial(request.fullName)}
                      </div>

                      <div>
                        <p className="text-[12.5px] font-semibold text-[#2D312E]">{request.fullName}</p>
                        <p className="text-[10.5px] text-[#2D312E]/65">
                          {request.currentRole} · Submitted {request.submitted}
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
                      <DetailGroup icon={<Mail className="h-3.5 w-3.5" />} title="Contact">
                        <DetailField label="Email" value={request.email} />
                        <DetailField label="Phone" value={request.phone} />
                      </DetailGroup>

                      <DetailGroup icon={<BriefcaseBusiness className="h-3.5 w-3.5" />} title="Professional Background">
                        <DetailField label="Current Role" value={request.currentRole} />
                        <DetailField label="Years of Experience" value={`${request.yearsOfExperience} years`} />
                        <DetailField label="Specialization" value={request.specialization} />
                      </DetailGroup>

                      <DetailGroup icon={<IdCard className="h-3.5 w-3.5" />} title="State License (LDN/CD)">
                        <DetailField label="License Number" value={request.licenseNumber} />
                        <DetailField label="State / Jurisdiction" value={request.licenseState} />
                        <DetailField label="Expiration Date" value={request.licenseExpiration} />
                      </DetailGroup>

                      <DetailGroup icon={<Award className="h-3.5 w-3.5" />} title="National Credential (RDN/CNS)">
                        <DetailField label="Credential Type" value={request.credentialType} />
                        <DetailField label="Credential Number" value={request.credentialNumber} />
                      </DetailGroup>

                      <DetailGroup icon={<FileCheck2 className="h-3.5 w-3.5" />} title="Certificate of Insurance">
                        <DetailField label="Provider" value={request.insuranceProvider} />
                        <DetailField label="Policy Number" value={request.policyNumber} />
                        <DetailField label="Expiration Date" value={request.insuranceExpiration} />
                        <DetailField label="Coverage Limit" value={request.coverageLimit} />
                      </DetailGroup>

                      <DetailGroup icon={<GraduationCap className="h-3.5 w-3.5" />} title="Degree / Transcript">
                        <DetailField label="Degree" value={request.degree} />
                        <DetailField label="Institution" value={request.institution} />
                        <DetailField label="Field of Study" value={request.fieldOfStudy} />
                        <DetailField label="Graduation Year" value={request.graduationYear} />
                      </DetailGroup>

                      <div>
                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#2D312E]/80">
                          <FileText className="h-3.5 w-3.5" />
                          Submitted Documents
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {request.documents.map((doc) => (
                            <button
                              key={doc.label}
                              type="button"
                              onClick={() =>
                                setPreviewDoc(doc)
                              }
                              className="flex items-center gap-2.5 rounded-xl border border-[#2D312E]/10 bg-white px-3 py-2.5 text-left transition hover:border-[#3D5A4C]/30 hover:bg-[#E9F0EC]/30"
                            >
                              <FileText className="h-4 w-4 shrink-0 text-[#4E876E]" />

                              <div className="min-w-0">
                                <p className="truncate text-[11px] font-semibold text-[#2D312E]">{doc.label}</p>
                                <p className="truncate text-[9.5px] text-[#2D312E]/55">{doc.fileName}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {request.status === 'Pending' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "Approved"
                              )
                            }
                            className="flex items-center gap-1 rounded-lg bg-[#3D5A4C] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#4E876E]"
                          >
                            <Check
                              className="h-3.5 w-3.5"
                              strokeWidth={2.5}
                            />

                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "Rejected"
                              )
                            }
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-500 hover:bg-red-50"
                          >
                            <X
                              className="h-3.5 w-3.5"
                              strokeWidth={2.5}
                            />

                            Reject
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

function DetailGroup({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#2D312E]/[0.06] bg-white p-4">
      <p className="mb-3 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#4E876E]">
        {icon}
        {title}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold text-[#2D312E]/60">{label}</p>
      <p className="mt-0.5 text-[12px] text-[#2D312E]">{value || 'Not provided'}</p>
    </div>
  );
}