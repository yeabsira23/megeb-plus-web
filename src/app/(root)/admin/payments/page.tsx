'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getAdminPayments, type AdminPayment } from '@/app/libs/api/admin/payment';

function usePayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPayments() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAdminPayments();

        if (isMounted) {
          setPayments(data);
        }
      } catch (err) {
        console.error('Unable to load payments:', err);

        if (isMounted) {
          setError('Unable to load payments.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    payments,
    isLoading,
    error,
  };
}

function formatAmount(amount: number) {
  return `ETB ${amount.toLocaleString()}`;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatStatus(status: AdminPayment['status']) {
  switch (status) {
    case 'successful':
      return 'Completed';

    case 'pending':
      return 'Pending';

    case 'failed':
      return 'Failed';

    case 'cancelled':
      return 'Cancelled';

    case 'expired':
      return 'Expired';

    default:
      return status;
  }
}

export default function PaymentsPage() {
  const {
    payments,
    isLoading,
    error,
  } = usePayments();

  const [query, setQuery] = useState('');

  const filtered = payments.filter((payment) =>
    payment.client.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">
          Payments
        </h1>

        <p className="mt-1 text-[12px] text-[#2D312E]/70">
          Transactions processed across the platform.
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D312E]/30" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by client"
          className="w-full rounded-xl border border-[#2D312E]/10 bg-white py-2 pl-9 pr-3 text-[12px] outline-none focus:border-[#3D5A4C]"
        />
      </div>

      {error && (
        <p className="text-[12px] font-medium text-red-600">
          {error}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#2D312E]/[0.05] text-left">
                <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Client
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Nutritionist
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Amount
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Date
                </th>

                <th className="px-3 py-3 text-[10px] uppercase tracking-wider text-[#2D312E]/55">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-[12px] text-[#2D312E]/55"
                  >
                    Loading payments…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-[12px] text-[#2D312E]/55"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr
                    key={payment.reference}
                    className="border-b border-[#2D312E]/[0.04] last:border-0"
                  >
                    <td className="px-5 py-4 text-[12px] font-semibold">
                      {payment.client.name}
                    </td>

                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/75">
                      {payment.nutritionist.name}
                    </td>

                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/75">
                      {formatAmount(payment.amount)}
                    </td>

                    <td className="px-3 py-4 text-[11px] text-[#2D312E]/75">
                      {formatDate(payment.createdAt)}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                          payment.status === 'successful'
                            ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                            : payment.status === 'failed' ||
                              payment.status === 'cancelled' ||
                              payment.status === 'expired'
                            ? 'bg-red-50 text-red-500'
                            : 'bg-[#F7EFD9] text-[#8A6D2D]'
                        }`}
                      >
                        {formatStatus(payment.status)}
                      </span>
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