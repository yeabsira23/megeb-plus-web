'use client';

import { useEffect, useState } from 'react';
import { Search, Check, X, Store, FileText } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';
import DocumentPreviewModal, { SubmittedDocument } from  '@/app/components/admin/DocumentPreviewModal';

type FoodVendorStatus = 'Pending' | 'Approved' | 'Rejected';

type FoodVendorApplication = {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessLicenseNumber: string;
  foodSafetyCertNumber: string;
  address: string;
  status: FoodVendorStatus;
  appliedDate: string;
  documents: SubmittedDocument[];
};

const DEFAULT_VENDORS: FoodVendorApplication[] = [
  {
    id: '1',
    businessName: 'Green Table Catering',
    ownerName: 'Hanna Girma',
    email: 'hanna@greentable.et',
    phone: '+251 91 111 2222',
    businessLicenseNumber: 'BL-77291',
    foodSafetyCertNumber: 'FSC-40218',
    address: 'Bole Road, Addis Ababa',
    status: 'Pending',
    appliedDate: 'Aug 18, 2026',
    documents: [
      { label: 'Business License', fileName: 'business_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
      { label: 'Food Safety Certificate', fileName: 'food_safety_cert.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
      { label: 'Owner ID', fileName: 'owner_id.jpg', fileType: 'image', fileUrl: '', uploadedDate: 'Aug 18, 2026' },
    ],
  },
  {
    id: '2',
    businessName: 'Fresh Harvest Foods',
    ownerName: 'Dawit Mulu',
    email: 'dawit@freshharvest.et',
    phone: '+251 92 222 3333',
    businessLicenseNumber: 'BL-55043',
    foodSafetyCertNumber: 'FSC-19087',
    address: 'Kazanchis, Addis Ababa',
    status: 'Pending',
    appliedDate: 'Aug 17, 2026',
    documents: [
      { label: 'Business License', fileName: 'business_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 17, 2026' },
      { label: 'Food Safety Certificate', fileName: 'food_safety_cert.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 17, 2026' },
      { label: 'Owner ID', fileName: 'owner_id.jpg', fileType: 'image', fileUrl: '', uploadedDate: 'Aug 17, 2026' },
    ],
  },
  {
    id: '3',
    businessName: 'Habesha Kitchen',
    ownerName: 'Selam Tesfaye',
    email: 'selam@habeshakitchen.et',
    phone: '+251 93 333 4444',
    businessLicenseNumber: 'BL-30982',
    foodSafetyCertNumber: 'FSC-77654',
    address: 'Piassa, Addis Ababa',
    status: 'Approved',
    appliedDate: 'Aug 5, 2026',
    documents: [
      { label: 'Business License', fileName: 'business_license.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 5, 2026' },
      { label: 'Food Safety Certificate', fileName: 'food_safety_cert.pdf', fileType: 'pdf', fileUrl: '', uploadedDate: 'Aug 5, 2026' },
      { label: 'Owner ID', fileName: 'owner_id.jpg', fileType: 'image', fileUrl: '', uploadedDate: 'Aug 5, 2026' },
    ],
  },
];

const STATUS_FILTERS: (FoodVendorStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected'];

function useFoodVendorApplications() {
  const [applications, setApplications] = useState<FoodVendorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchApplications() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<FoodVendorApplication[]>('/admin/food-vendors');
        // if (isMounted) setApplications(data);
        if (isMounted) setApplications(DEFAULT_VENDORS); // TEMP: sample data for preview
      } catch (err) {
        console.error('Unable to load food vendor applications:', err);
        if (isMounted) setError('Unable to load food vendor applications.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchApplications();
    return () => { isMounted = false; };
  }, []);

  return { applications, isLoading, error, setApplications };
}

export default function FoodVendorsPage() {
  const { applications, isLoading, error, setApplications } = useFoodVendorApplications();
  const [statusFilter, setStatusFilter] = useState<FoodVendorStatus | 'All'>('All');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<SubmittedDocument | null>(null);

  const filtered = applications.filter((vendor) => {
    const matchesStatus = statusFilter === 'All' || vendor.status === statusFilter;
    const matchesQuery =
      vendor.businessName.toLowerCase().includes(query.toLowerCase()) ||
      vendor.ownerName.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const pendingCount = applications.filter((vendor) => vendor.status === 'Pending').length;

  async function updateStatus(id: string, status: FoodVendorStatus) {
    // Backend API will be connected here later.
    // await apiFetch(`/admin/food-vendors/${id}`, { method: 'PATCH', data: { status } });

    setApplications((previous) =>
      previous.map((vendor) => (vendor.id === id ? { ...vendor, status } : vendor))
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[23px] text-[#2D312E]">Food Vendors</h1>
          <p className="mt-1 text-[12px] text-[#2D312E]/70">
            Review and verify food vendor business registrations.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="flex w-fit items-center gap-1 rounded-full bg-[#F7EFD9] px-2.5 py-1 text-[10px] font-bold text-[#8A6D2D]">
            <Store className="h-3 w-3" strokeWidth={2.5} />
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
                  : 'bg-white text-[#2D312E]/75 border border-[#2D312E]/10 hover:bg-[#FAF9F6]'
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
            placeholder="Search business or owner"
            className="w-full rounded-xl border border-[#2D312E]/10 bg-white py-2 pl-9 pr-3 text-[12px] outline-none focus:border-[#3D5A4C]"
          />
        </div>
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        {isLoading ? (
          <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/55">
            Loading food vendor applications…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-[12px] text-[#2D312E]/55">
            No food vendor applications found.
          </div>
        ) : (
          <div className="divide-y divide-[#2D312E]/[0.05]">
            {filtered.map((vendor) => {
              const isExpanded = expandedId === vendor.id;
              return (
                <div key={vendor.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : vendor.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#FAF9F6]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                        <Store className="h-[18px] w-[18px]" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-[12.5px] font-semibold">{vendor.businessName}</p>
                        <p className="text-[10.5px] text-[#2D312E]/65">
                          {vendor.ownerName} · Applied {vendor.appliedDate}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                        vendor.status === 'Approved'
                          ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                          : vendor.status === 'Rejected'
                          ? 'bg-red-50 text-red-500'
                          : 'bg-[#F7EFD9] text-[#8A6D2D]'
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="bg-[#FAF9F6]/60 px-5 py-4">
                      <div className="grid gap-3 text-[11.5px] sm:grid-cols-2">
                        <div>
                          <p className="font-semibold text-[#2D312E]/70">Email</p>
                          <p className="mt-0.5 text-[#2D312E]/70">{vendor.email}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D312E]/70">Phone</p>
                          <p className="mt-0.5 text-[#2D312E]/70">{vendor.phone}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D312E]/70">Business License #</p>
                          <p className="mt-0.5 text-[#2D312E]/70">{vendor.businessLicenseNumber}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D312E]/70">Food Safety Certificate #</p>
                          <p className="mt-0.5 text-[#2D312E]/70">{vendor.foodSafetyCertNumber}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="font-semibold text-[#2D312E]/70">Business Address</p>
                          <p className="mt-0.5 text-[#2D312E]/70">{vendor.address}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-[11px] font-semibold text-[#2D312E]/70">Submitted Documents</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {vendor.documents.map((doc) => (
                            <button
                              key={doc.label}
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
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

                      {vendor.status === 'Pending' && (
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateStatus(vendor.id, 'Approved')}
                            className="flex items-center gap-1 rounded-lg bg-[#3D5A4C] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#4E876E]"
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Approve vendor
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(vendor.id, 'Rejected')}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-500 hover:bg-red-50"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Reject vendor
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