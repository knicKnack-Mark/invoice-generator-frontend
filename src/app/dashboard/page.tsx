"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Receipt,
} from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { InvoiceTable } from "@/components/dashboard/invoice-table";
import { ReceivablesCard } from "@/components/dashboard/receivables-card";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { useDashboard } from "@/features/dashboard/hooks";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
        <p className="text-sm text-black/40">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
        <p className="text-sm text-red-600">
          Unable to load dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
      <DashboardHeader />

      <section className="grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Outstanding"
          value={formatCurrency(
            data.summary.outstanding.amount,
          )}
          detail={`${data.summary.outstanding.count} invoices`}
          icon={<ArrowUpRight className="h-4 w-4" />}
        />

        <SummaryCard
          label="Collected"
          value={formatCurrency(
            data.summary.collected.amount,
          )}
          detail={`+${data.summary.collected.change}% from last month`}
          icon={<ArrowDownRight className="h-4 w-4" />}
        />

        <SummaryCard
          label="Expenses"
          value={formatCurrency(
            data.summary.expenses.amount,
          )}
          detail={`${data.summary.expenses.count} transactions`}
          icon={<Receipt className="h-4 w-4" />}
        />

        <SummaryCard
          label="Draft invoices"
          value={String(data.summary.drafts.count)}
          detail={`${data.summary.drafts.attention} need attention`}
          icon={<FileText className="h-4 w-4" />}
        />
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <InvoiceTable invoices={data.invoices} />

        <div className="space-y-8">
          <ReceivablesCard
            receivables={data.receivables}
          />

          <ActivityFeed
            activities={data.activity}
          />
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}