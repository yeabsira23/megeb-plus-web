'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Check, X, UserCheck, FileText } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';
import DocumentPreviewModal,  { SubmittedDocument } from '@/app/components/admin/DocumentPreviewModal';

type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

type VerificationRequestDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  credentialType: string;
  licenseNumber: string;
  submitted: string;
  status: RequestStatus;
  documents: SubmittedDocument[];
};

const DEFAULT_REQUESTS: VerificationRequestDetail[] = [
  {
    id: '1',
    name: 'Dr. Bethlehem Kassa',
    email: 'bethlehem.kassa@example.com',
    phone: '+251 91 234 5678',
    specialty: 'Clinical Nutrition',
    credentialType: 'RDN',
    licenseNumber: 'RDN-4821',
    submitted: '2 hours ago',
    status: 'Pending',
    documents: [
      { label: 'State License', fileName: 'state_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'National Credential (RDN/CNS)', fileName: 'credential_cert.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'Certificate of Insurance', fileName: 'insurance_coi.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'Degree / Transcript', fileName: 'degree_transcript.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
    ],
  },
  {
    id: '2',
    name: 'Dr. Yonatan Haile',
    email: 'yonatan.haile@example.com',
    phone: '+251 92 345 6789',
    specialty: 'Sports Nutrition',
    credentialType: 'CNS',
    licenseNumber: 'CNS-2237',
    submitted: '5 hours ago',
    status: 'Pending',
    documents: [
      { label: 'State License', fileName: 'state_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'National Credential (RDN/CNS)', fileName: 'credential_cert.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'Certificate of Insurance', fileName: 'insurance_coi.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
      { label: 'Degree / Transcript', fileName: 'degree_transcript.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 19, 2026' },
    ],
  },
  {
    id: '3',
    name: 'Dr. Meron Fikru',
    email: 'meron.fikru@example.com',
    phone: '+251 93 456 7890',
    specialty: 'Pediatric Nutrition',
    credentialType: 'RDN',
    licenseNumber: 'RDN-9013',
    submitted: 'Yesterday',
    status: 'Pending',
    documents: [
      { label: 'State License', fileName: 'state_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
      { label: 'National Credential (RDN/CNS)', fileName: 'credential_cert.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
      { label: 'Certificate of Insurance', fileName: 'insurance_coi.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
      { label: 'Degree / Transcript', fileName: 'degree_transcript.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
    ],
  },
];

const STATUS_FILTERS: (RequestStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected'];

function isRequestStatus(value: string | null): value is RequestStatus {
  return value === 'Pending' || value === 'Approved' || value === 'Rejected';
}

function getInitial(name: string): string {
  const cleaned = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '');
  return cleaned.charAt(0).toUpperCase();
}

function useVerificationRequestDetails() {
  const [requests, setRequests] = useState<VerificationRequestDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchRequests() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<VerificationRequestDetail[]>('/admin/verification-requests');
        // if (isMounted) setRequests(data);
        if (isMounted) setRequests(DEFAULT_REQUESTS); // TEMP: sample data for preview
      } catch (err) {
        console.error('Unable to load verification requests:', err);
        if (isMounted) setError('Unable to load verification requests.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchRequests();
    return () => { isMounted = false; };
  }, []);

  return { requests, isLoading, error, setRequests };
}

export default function VerificationRequestsPage() {
  const { requests, isLoading, error, setRequests } = useVerificationRequestDetails();
  const searchParams = useSearchParams();

  const rawStatus = searchParams.get('status');
  const capitalizedStatus = rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : null;
  const initialStatus: RequestStatus | 'All' = isRequestStatus(capitalizedStatus)
    ? (capitalizedStatus as RequestStatus)
    : 'Pending';
  const initialSearch = searchParams.get('search') ?? '';

  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>(initialStatus);
  const [query, setQuery] = useState(initialSearch);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<SubmittedDocument | null>(null);

  const filtered = requests.filter((request) => {
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesQuery = request.name.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const pendingCount = requests.filter((request) => request.status === 'Pending').length;

  async function updateStatus(id: string, status: RequestStatus) {
    // Backend API will be connected here later.
    // await apiFetch(`/admin/verification-requests/${id}`, { method: 'PATCH', data: { status } });

    setRequests((previous) =>
      previous.map((request) => (request.id === id ? { ...request, status } : request))
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[23px] text-[#2D312E]">Verification Requests</h1>
          <p className="mt-1 text-[12px] text-[#2D312E]/50">
            Review nutritionist credentials and approve or reject applications.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="flex w-fit items-center gap-1 rounded-full bg-[#F7EFD9] px-2.5 py-1 text-[10px] font-bold text-[#8A6D2D]">
            <UserCheck className="h-3 w-3" strokeWidth={2.5} />
            {pendingCount} pending
          </span>
        )}
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
        {isLoading ? (
          <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">Loading verification requests…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/40">No verification requests found.</div>
        ) : (
          <div className="divide-y divide-[#2D312E]/[0.05]">
            {filtered.map((request) => {
              const isExpanded = expandedId === request.id;
              return (
                <div key={request.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : request.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#FAF9F6]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] font-semibold text-[#3D5A4C]">
                        {getInitial(request.name)}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-semibold">{request.name}</p>
                        <p className="text-[10.5px] text-[#2D312E]/45">
                          {request.specialty} · Submitted {request.submitted}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                        request.status === 'Approved'
                          ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                          : request.status === 'Rejected'
                          ? 'bg-red-50 text-red-500'
                          : 'bg-[#F7EFD9] text-[#8A6D2D]'
                      }`}
                    >
                      {request.status}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="bg-[#FAF9F6]/60 px-5 py-4">
                      <div className="grid gap-3 text-[11.5px] sm:grid-cols-2">
                        <div>
                          <p className="font-semibold text-[#2D312E]/70">Email</p>
                          <p className="mt-0.5 text-[#2D312E]/50">{request.email}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D312E]/70">Phone</p>
                          <p className="mt-0.5 text-[#2D312E]/50">{request.phone}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D312E]/70">Credential Type</p>
                          <p className="mt-0.5 text-[#2D312E]/50">{request.credentialType}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D312E]/70">License Number</p>
                          <p className="mt-0.5 text-[#2D312E]/50">{request.licenseNumber}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-[11px] font-semibold text-[#2D312E]/70">Submitted Documents</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {request.documents.map((doc) => (
                            <button
                              key={doc.label}
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              className="flex items-center gap-2.5 rounded-xl border border-[#2D312E]/10 bg-white px-3 py-2.5 text-left transition hover:border-[#3D5A4C]/30 hover:bg-[#E9F0EC]/30"
                            >
                              <FileText className="h-4 w-4 shrink-0 text-[#4E876E]" />
                              <div className="min-w-0">
                                <p className="truncate text-[11px] font-semibold text-[#2D312E]">{doc.label}</p>
                                <p className="truncate text-[9.5px] text-[#2D312E]/40">{doc.fileName}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {request.status === 'Pending' && (
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateStatus(request.id, 'Approved')}
                            className="flex items-center gap-1 rounded-lg bg-[#3D5A4C] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#4E876E]"
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(request.id, 'Rejected')}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-500 hover:bg-red-50"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
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

      <DocumentPreviewModal document={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
}