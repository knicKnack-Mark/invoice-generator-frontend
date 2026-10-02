import type { DashboardReceivables } from "@/features/dashboard/types";

interface ReceivablesCardProps {
  receivables: DashboardReceivables;
}

export function ReceivablesCard({
  receivables,
}: ReceivablesCardProps) {
  return (
    <section>
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">
          Receivables
        </p>

        <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
          Needs attention
        </h2>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-black/40">
              Overdue
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
              {formatCurrency(receivables.overdueAmount)}
            </p>
          </div>

          <span className="rounded-full bg-[#f3e5df] px-2.5 py-1 text-[10px] font-medium text-[#8b4e3b]">
            {receivables.overdueCount} invoice
            {receivables.overdueCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/6">
          <div
            className="h-full rounded-full bg-[#9a604c]"
            style={{
              width: `${receivables.percentage}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[10px] text-black/35">
          <span>
            {receivables.percentage}% of outstanding
          </span>

          <span>
            {formatCurrency(receivables.outstandingAmount)} total
          </span>
        </div>
      </div>
    </section>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}