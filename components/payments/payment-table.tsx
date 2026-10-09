"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Invoice } from "@/features/invoices/types";
import type { Payment } from "@/features/payments/types";

import { PaymentDeleteDialog } from "./payment-delete-dialog";

interface PaymentTableProps {
  payments: Payment[];
  invoices: Invoice[];
  loading?: boolean;
}

function formatMoney(
  amount: number | string,
  currency: string,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

function formatDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function PaymentTable({
  payments,
  invoices,
  loading = false,
}: PaymentTableProps) {
  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const invoiceLookup = useMemo(
    () => new Map(invoices.map((invoice) => [invoice.id, invoice])),
    [invoices],
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-center text-sm text-muted-foreground">
        Loading payments...
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
        <ArrowDownLeft className="mx-auto mb-3 size-8 text-muted-foreground" />

        <h3 className="text-sm font-semibold">
          No payments yet
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Recorded payments will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/8 bg-[#fafaf8] text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">
                  Invoice
                </th>
                <th className="px-5 py-3 font-medium">
                  Payment date
                </th>
                <th className="px-5 py-3 font-medium">
                  Method
                </th>
                <th className="px-5 py-3 font-medium">
                  Reference
                </th>
                <th className="px-5 py-3 text-right font-medium">
                  Amount
                </th>
                <th className="px-5 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5">
              {payments.map((payment) => {
                const invoice = invoiceLookup.get(
                  payment.invoice_id,
                );

                return (
                  <tr
                    key={payment.id}
                    className="transition-colors hover:bg-black/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {invoice?.invoice_number ??
                          `Invoice ${payment.invoice_id.slice(0, 8)}`}
                      </p>

                      {invoice?.client_name && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {invoice.client_name}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {formatDate(payment.payment_date)}
                    </td>

                    <td className="px-5 py-4">
                      {payment.payment_method}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {payment.reference_number || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums">
                      {formatMoney(
                        payment.amount,
                        payment.currency,
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Delete payment"
                        title="Delete payment"
                        onClick={() =>
                          setSelectedPayment(payment)
                        }
                      >
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentDeleteDialog
        payment={selectedPayment}
        open={Boolean(selectedPayment)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPayment(null);
          }
        }}
      />
    </>
  );
}