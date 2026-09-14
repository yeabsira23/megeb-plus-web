'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, UserCheck } from 'lucide-react';
import {
  getVerificationRequests,
  type VerificationRequest,
} from '@/app/libs/api/admin/verification';
import { useRouter } from 'next/navigation';



type VerificationRequestsProps = {
  requests?: VerificationRequest[];
};


function getInitial(name: string): string {
  const cleaned = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '');
  return cleaned.charAt(0).toUpperCase();
}

function useVerificationRequests() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   

  useEffect(() => {
    let isMounted = true;
    async function fetchRequests() {
      setIsLoading(true);
      setError(null);
      try {
        
         const data = await getVerificationRequests();
         if (isMounted) setRequests(data);
        
      } catch (err) {
        console.error('Unable to load verification requests:', err);
        if (isMounted) {
          setError('Unable to load verification requests.');
          
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchRequests();
    return () => { isMounted = false; };
  }, []);

  return { requests, isLoading, error };
}

export default function VerificationRequests({ requests: requestsProp }: VerificationRequestsProps) {
  const fetched = useVerificationRequests();
  const requests = requestsProp ?? fetched.requests;
  const isLoading = requestsProp ? false : fetched.isLoading;
  const error = requestsProp ? null : fetched.error;
   const router = useRouter();

  const handleReview = (request: VerificationRequest) => {
     const params = new URLSearchParams({ status: 'pending', search: request.name });
    router.push(`/admin/verification-requests?${params.toString()}`);
    // Backend API will be connected here later — e.g. navigate to a
    // detail/review page, or open a modal that calls:
    // await apiFetch(`/admin/verification-requests/${id}`, { method: 'PATCH', data: { status: 'approved' } });
    //console.log('Review request', id);
  };

  return (
    <section className="rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-4">
        <div>
          <h3 className="font-display text-[19px]">Verification requests</h3>
          <p className="mt-1 text-[11px] text-[#2D312E]/65">Nutritionists awaiting approval</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#F7EFD9] px-2.5 py-1 text-[10px] font-bold text-[#8A6D2D]">
          <UserCheck className="h-3 w-3" strokeWidth={2.5} />
          {requests.length} pending
        </span>
      </div>

      {error && <p className="px-5 pt-3 text-[11px] font-medium text-red-600">{error}</p>}

      <div className="p-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#E9F0EC]" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-[#E9F0EC]" />
                <div className="h-2.5 w-40 animate-pulse rounded bg-[#E9F0EC]" />
              </div>
            </div>
          ))
        ) : requests.length === 0 ? (
          <p className="px-2 py-6 text-center text-[12px] text-[#2D312E]/55">No pending verification requests.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#FAF9F6]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] font-semibold text-[#3D5A4C]">
                {getInitial(request.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold">{request.name}</p>
                <p className="truncate text-[10px] text-[#2D312E]/65">{request.specialty} · {request.submitted}</p>
              </div>
              <button
                type="button"
                onClick={() => handleReview(request)}
                className="flex items-center gap-0.5 rounded-lg border border-[#3D5A4C]/15 px-2.5 py-1.5 text-[10px] font-semibold text-[#3D5A4C] hover:bg-[#E9F0EC]"
              >
                Review
                <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[#2D312E]/[0.06] p-4">
        <Link href="/admin/verification-requests" className="block w-full rounded-xl bg-[#E9F0EC] py-2.5 text-center text-[11px] font-semibold text-[#3D5A4C]">
          Manage all requests
        </Link>
      </div>
    </section>
  );
}