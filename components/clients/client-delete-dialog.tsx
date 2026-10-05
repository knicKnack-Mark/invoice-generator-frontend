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

import { useDeleteClient } from "@/features/clients/hooks";

import type { Client } from "@/features/clients/types";

interface ClientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
}

export function ClientDeleteDialog({
  open,
  onOpenChange,
  client,
}: ClientDeleteDialogProps) {
  const deleteMutation = useDeleteClient();

  const handleDelete = () => {
    if (!client) {
      return;
    }

    deleteMutation.mutate(client.id, {
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
            Delete client?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {client?.name}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteMutation.isError && (
          <p className="text-sm text-destructive">
            Unable to delete the client. Please try
            again.
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? "Deleting..."
              : "Delete client"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}