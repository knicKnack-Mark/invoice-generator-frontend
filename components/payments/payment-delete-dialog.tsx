"use client";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeletePayment } from "@/features/payments/hooks";
import type { Payment } from "@/features/payments/types";

interface PaymentDeleteDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDeleteDialog({
  payment,
  open,
  onOpenChange,
}: PaymentDeleteDialogProps) {
  const deletePayment = useDeletePayment();

  const handleDelete = async () => {
    if (!payment) {
      return;
    }

    try {
      await deletePayment.mutateAsync(payment.id);

      toast.success(
        "Payment deleted. The invoice balance has been recalculated.",
      );

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete payment.");
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!deletePayment.isPending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete this payment?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will remove the recorded payment of{" "}
            {payment
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: payment.currency,
                }).format(Number(payment.amount))
              : ""}{" "}
            from the payment ledger. The backend will
            recalculate the invoice balance and status.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deletePayment.isPending}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            disabled={deletePayment.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deletePayment.isPending
              ? "Deleting..."
              : "Delete payment"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}