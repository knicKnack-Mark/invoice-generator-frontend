"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useInvoices } from "@/features/invoices/hooks";
import { usePayments } from "@/features/payments/hooks";

import { PaymentDialog } from "@/components/payments/payment-dialog";
import { PaymentTable } from "@/components/payments/payment-table";

import type { Invoice } from "@/features/invoices/types";
import type { Payment } from "@/features/payments/types";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: paymentsResponse,
    isLoading: paymentsLoading,
    isError: paymentsError,
    refetch,
  } = usePayments(1, 100);

  const {
    data: invoiceResponse,
    isLoading: invoicesLoading,
    isError: invoicesError,
  } = useInvoices(1, 100, "");

  const payments = paymentsResponse?.data ?? [];
  const invoices = invoiceResponse?.items ?? [];

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return payments;
    }

    const invoiceLookup = new Map(
      invoices.map((invoice) => [invoice.id, invoice]),
    );

    return payments.filter((payment) => {
      const invoice = invoiceLookup.get(payment.invoice_id);

      return [
        invoice?.invoice_number,
        invoice?.client_name,
        payment.payment_method,
        payment.reference_number,
        payment.currency,
        payment.payment_date,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query),
        );
    });
  }, [payments, invoices, search]);

  const totalAmountByCurrency = useMemo(() => {
    const totals = new Map<string, number>();

    for (const payment of payments) {
      totals.set(
        payment.currency,
        (totals.get(payment.currency) ?? 0) +
          Number(payment.amount),
      );
    }

    return Array.from(totals.entries());
  }, [payments]);

  const isLoading = paymentsLoading || invoicesLoading;
  const hasError = paymentsError || invoicesError;

  return (
    <div className="space-y-7 p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Finance / Payments
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Payments
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track money received against your invoices.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Record payment
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Recorded payments
            </p>

            <ArrowDownLeft className="size-4 text-muted-foreground" />
          </div>

          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {paymentsResponse?.meta.total ?? 0}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Total payment records across your organization
          </p>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-5">
          <p className="text-sm text-muted-foreground">
            Amount recorded on this page
          </p>

          {totalAmountByCurrency.length === 0 ? (
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              —
            </p>
          ) : (
            <div className="mt-3 space-y-1">
              {totalAmountByCurrency.map(([currency, amount]) => (
                <p
                  key={currency}
                  className="text-2xl font-semibold tabular-nums"
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency,
                  }).format(amount)}
                </p>
              ))}
            </div>
          )}

          <p className="mt-1 text-xs text-muted-foreground">
            Based on the payments currently loaded, grouped by currency
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">
              Payment history
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              View and manage recorded payments.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search payments..."
              className="pl-9"
            />
          </div>
        </div>

        {hasError ? (
          <div className="rounded-xl border border-red-200 bg-white p-6">
            <p className="text-sm text-red-700">
              Failed to load payments or invoices. Check your
              backend connection and try again.
            </p>

            <Button
              className="mt-3"
              variant="outline"
              onClick={() => void refetch()}
            >
              Retry payments
            </Button>
          </div>
        ) : (
          <PaymentTable
            payments={filteredPayments as Payment[]}
            invoices={invoices as Invoice[]}
            loading={isLoading}
          />
        )}

        {!isLoading && !hasError && (
          <p className="text-xs text-muted-foreground">
            Showing {filteredPayments.length} of{" "}
            {paymentsResponse?.meta.total ?? 0} loaded payment records.
            {paymentsResponse?.meta.total &&
            paymentsResponse.meta.total > payments.length
              ? " Additional records are available on subsequent API pages."
              : ""}
          </p>
        )}
      </section>

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}