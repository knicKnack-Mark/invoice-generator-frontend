  import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import type { DashboardInvoice } from "@/features/dashboard/types";

interface InvoiceTableProps {
  invoices: DashboardInvoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">
            Invoices
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
            Recent invoices
          </h2>
        </div>

        <Link
          href="/invoices"
          className="text-xs font-medium text-black/45 hover:text-black"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <div className="hidden grid-cols-[1.2fr_1fr_120px_120px_32px] border-b border-black/8 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/35 sm:grid">
          <span>Invoice</span>
          <span>Client</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
          <span />
        </div>

        {invoices.map((invoice) => (
          <Link
            href={`/invoices/${invoice.id}`}
            key={invoice.id}
            className="group grid gap-2 border-b border-black/6 px-5 py-4 last:border-0 hover:bg-[#fafaf8] sm:grid-cols-[1.2fr_1fr_120px_120px_32px] sm:items-center sm:gap-0"
          >
            <div>
              <p className="text-[13px] font-medium">
                {invoice.number}
              </p>

              <p className="mt-0.5 text-xs text-black/40 sm:hidden">
                {invoice.client}
              </p>
            </div>

            <p className="hidden text-xs text-black/55 sm:block">
              {invoice.client}
            </p>

            <p className="text-xs text-black/40">
              {invoice.date}
            </p>

            <p className="text-sm font-medium sm:text-right">
              {formatCurrency(invoice.amount)}
            </p>

            <div className="flex items-center justify-between sm:justify-end">
              <InvoiceStatus status={invoice.status} />

              <MoreHorizontal className="ml-3 hidden h-4 w-4 text-black/25 group-hover:block" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function InvoiceStatus({
  status,
}: {
  status: DashboardInvoice["status"];
}) {
  const styles = {
    Paid: "bg-[#e6eee8] text-[#42604c]",
    "Due soon": "bg-[#eee9d9] text-[#756437]",
    Overdue: "bg-[#f3e5df] text-[#8b4e3b]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}