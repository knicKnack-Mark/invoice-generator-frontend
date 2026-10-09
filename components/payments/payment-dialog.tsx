"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useInvoices } from "@/features/invoices/hooks";
import { useCreatePayment } from "@/features/payments/hooks";

import {
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/features/payments/types";

import type { Invoice } from "@/features/invoices/types";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type InvoiceWithCurrency = Invoice & {
  currency?: string;
  status: string;
  balance_due?: number | string;
};

const today = () => {
  const now = new Date();
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 10);
};

export function PaymentDialog({
  open,
  onOpenChange,
}: PaymentDialogProps) {
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentDate, setPaymentDate] = useState(today());
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Bank Transfer");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const { data: invoiceData, isLoading: invoicesLoading } =
    useInvoices(1, 100, "");

  const createPayment = useCreatePayment();

  const invoices = (invoiceData?.items ?? []) as InvoiceWithCurrency[];

  const payableInvoices = invoices.filter((invoice) =>
    ["sent", "viewed", "partially_paid"].includes(
      String(invoice.status).toLowerCase(),
    ),
  );

  const selectedInvoice = payableInvoices.find(
    (invoice) => invoice.id === invoiceId,
  );

  const resetForm = () => {
    setInvoiceId("");
    setAmount("");
    setCurrency("USD");
    setPaymentDate(today());
    setPaymentMethod("Bank Transfer");
    setReferenceNumber("");
    setNotes("");
    setError("");
  };

  const handleClose = () => {
    if (createPayment.isPending) {
      return;
    }

    resetForm();
    onOpenChange(false);
  };

  const handleInvoiceChange = (nextInvoiceId: string) => {
    setInvoiceId(nextInvoiceId);
    setAmount("");
    setError("");

    const invoice = payableInvoices.find(
      (item) => item.id === nextInvoiceId,
    );

    if (invoice?.currency) {
      setCurrency(invoice.currency.toUpperCase());
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    if (!invoiceId || !selectedInvoice) {
      setError("Select an eligible invoice.");
      return;
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (!paymentDate) {
      setError("Select the payment date.");
      return;
    }

    if (!/^[A-Za-z]{3}$/.test(currency)) {
      setError("Enter a valid three-letter currency code.");
      return;
    }

    try {
      await createPayment.mutateAsync({
        invoiceId,
        payload: {
          amount: parsedAmount,
          currency: currency.toUpperCase(),
          payment_date: paymentDate,
          payment_method: paymentMethod,
          reference_number: referenceNumber.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      });

      toast.success("Payment recorded successfully.");
      resetForm();
      onOpenChange(false);
    } catch (mutationError) {
      const message =
        mutationError &&
        typeof mutationError === "object" &&
        "response" in mutationError
          ? String(
              (
                mutationError as {
                  response?: {
                    data?: {
                      detail?: string | { message?: string };
                      message?: string;
                    };
                  };
                }
              ).response?.data?.message ??
                (
                  (
                    mutationError as {
                      response?: {
                        data?: {
                          detail?: string | { message?: string };
                        };
                      };
                    }
                  ).response?.data?.detail &&
                  typeof (
                    mutationError as {
                      response?: {
                        data?: {
                          detail?: string | { message?: string };
                        };
                      };
                    }
                  ).response?.data?.detail === "object"
                    ? (
                        (
                          mutationError as {
                            response?: {
                              data?: {
                                detail?: { message?: string };
                              };
                            };
                          }
                        ).response?.data?.detail as {
                          message?: string;
                        }
                      ).message
                    : (
                        mutationError as {
                          response?: {
                            data?: {
                              detail?: string;
                            };
                          };
                        }
                      ).response?.data?.detail
                ) ??
                "Failed to record payment.",
            )
          : "Failed to record payment.";

      setError(message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        } else {
          onOpenChange(true);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>

          <DialogDescription>
            Record a full or partial payment against an
            existing invoice.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="payment-invoice">
              Invoice
            </Label>

            <select
              id="payment-invoice"
              value={invoiceId}
              onChange={(event) =>
                handleInvoiceChange(event.target.value)
              }
              disabled={invoicesLoading || createPayment.isPending}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              required
            >
              <option value="">
                {invoicesLoading
                  ? "Loading invoices..."
                  : "Select an invoice"}
              </option>

              {payableInvoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoice_number} — {invoice.client_name}
                  {invoice.currency
                    ? ` (${invoice.currency})`
                    : ""}
                </option>
              ))}
            </select>

            {!invoicesLoading && payableInvoices.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No eligible invoices are available. The backend
                accepts payments for sent, viewed, or partially
                paid invoices.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">
                Amount
              </Label>

              <Input
                id="payment-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                required
                disabled={!invoiceId || createPayment.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-currency">
                Currency
              </Label>

              <Input
                id="payment-currency"
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value.toUpperCase())
                }
                maxLength={3}
                placeholder="USD"
                required
                disabled={!invoiceId || createPayment.isPending}
              />

              <p className="text-xs text-muted-foreground">
                Must match the selected invoice currency.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment-date">
                Payment date
              </Label>

              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(event) =>
                  setPaymentDate(event.target.value)
                }
                required
                disabled={createPayment.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">
                Payment method
              </Label>

              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value as PaymentMethod,
                  )
                }
                disabled={createPayment.isPending}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-reference">
              Reference number
            </Label>

            <Input
              id="payment-reference"
              value={referenceNumber}
              onChange={(event) =>
                setReferenceNumber(event.target.value)
              }
              maxLength={100}
              placeholder="Optional transaction reference"
              disabled={createPayment.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-notes">
              Notes
            </Label>

            <Textarea
              id="payment-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional payment notes"
              rows={3}
              disabled={createPayment.isPending}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createPayment.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createPayment.isPending ||
                !invoiceId ||
                invoicesLoading
              }
            >
              {createPayment.isPending
                ? "Recording..."
                : "Record payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 