'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronRight, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SubmittedDocument } from '@/app/components/admin/DocumentPreviewModal';

export type NutritionistStatus = 'Pending' | 'Approved' | 'Rejected';

export type NutritionistApplication = {
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
  status: NutritionistStatus;
  documents: SubmittedDocument[];
};

const STORAGE_KEY = 'megeb_admin_nutritionist_applications';

const DEFAULT_APPLICATIONS: NutritionistApplication[] = [
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

function loadApplications(): NutritionistApplication[] {
  if (typeof window === 'undefined') return DEFAULT_APPLICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as NutritionistApplication[];
  } catch (err) {
    console.error('Unable to read cached applications:', err);
  }
  return DEFAULT_APPLICATIONS;
}

function saveApplications(applications: NutritionistApplication[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (err) {
    console.error('Unable to cache applications:', err);
  }
}

const STATUS_FILTERS: (NutritionistStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected'];

export default function NutritionistsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<NutritionistApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<NutritionistStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Backend API will be connected here later.
    // const data = await apiFetch<NutritionistApplication[]>('/admin/nutritionists');
    const data = loadApplications();
    setApplications(data);
    saveApplications(data); // ensure the key exists on first load
    setIsLoading(false);
  }, []);

  const filtered = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesQuery = app.fullName.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  function handleReview(app: NutritionistApplication) {
    const params = new URLSearchParams({
      status: app.status.toLowerCase(),
      search: app.fullName,
    });
    router.push(`/admin/verification-requests?${params.toString()}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">Nutritionists</h1>
        <p className="mt-1 text-[12px] text-[#2D312E]/70">
          All nutritionist applications on the platform. Review credentials and documents on the Verification Requests page.
        </p>
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Nutritionist</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Role & Specialty</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Experience</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Credential</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">License</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Applied</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">Status</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/50">Loading applications…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-[12px] text-[#2D312E]/50">No applications found.</td></tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="border-b border-[#2D312E]/[0.04] last:border-0">
                    <td className="px-5 py-4">
                      <p className="text-[12.5px] font-semibold text-[#2D312E]">{app.fullName}</p>
                      <div className="mt-1 flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-[10px] text-[#2D312E]/60">
                          <Mail className="h-2.5 w-2.5" /> {app.email}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-[#2D312E]/60">
                          <Phone className="h-2.5 w-2.5" /> {app.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-[11.5px] font-medium text-[#2D312E]/85">{app.currentRole}</p>
                      <p className="text-[10.5px] text-[#2D312E]/60">{app.specialization}</p>
                    </td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/75">{app.yearsOfExperience} years</td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/75">
                      {app.credentialType} · {app.credentialNumber}
                    </td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/75">
                      {app.licenseNumber}
                      <span className="block text-[10px] text-[#2D312E]/55">{app.licenseState}</span>
                    </td>
                    <td className="px-3 py-4 text-[11.5px] text-[#2D312E]/75">{app.submitted}</td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                          app.status === 'Approved'
                            ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 text-red-500'
                            : 'bg-[#F7EFD9] text-[#8A6D2D]'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        onClick={() => handleReview(app)}
                        className="flex items-center gap-0.5 rounded-lg border border-[#3D5A4C]/15 px-2.5 py-1.5 text-[10px] font-semibold text-[#3D5A4C] hover:bg-[#E9F0EC]"
                      >
                        Review
                        <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
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