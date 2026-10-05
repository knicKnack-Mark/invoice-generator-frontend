"use client";

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

import { useDeleteInvoice } from "@/features/invoices/hooks";

import type { Invoice } from "@/features/invoices/types";

interface InvoiceDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
}

export function InvoiceDeleteDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceDeleteDialogProps) {
  const deleteMutation =
    useDeleteInvoice();

  const handleDelete = () => {
    if (!invoice) {
      return;
    }

    deleteMutation.mutate(invoice.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete invoice?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {invoice?.invoice_number}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteMutation.isError && (
          <p className="text-sm text-destructive">
            Unable to delete the invoice. Please
            try again.
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={
              deleteMutation.isPending
            }
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={
              deleteMutation.isPending
            }
          >
            {deleteMutation.isPending
              ? "Deleting..."
              : "Delete invoice"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}