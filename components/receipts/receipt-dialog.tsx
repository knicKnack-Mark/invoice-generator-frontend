"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useExpenses } from "@/features/expenses/hooks";
import { useCreateReceipt } from "@/features/receipts/hooks";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export function ReceiptDialog({
  open,
  onOpenChange,
}: ReceiptDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [expenseId, setExpenseId] = useState("");
  const [error, setError] = useState("");

  const { data: expensesData } = useExpenses(
    1,
    100,
  );

  const createReceipt = useCreateReceipt();

  const expenses = expensesData?.items ?? [];

  const resetForm = () => {
    setFile(null);
    setExpenseId("");
    setError("");
  };

  const handleClose = () => {
    if (createReceipt.isPending) {
      return;
    }

    resetForm();
    onOpenChange(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError("");

    const selectedFile =
      event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setFile(null);
      setError(
        "Only JPG, PNG, WEBP, and PDF files are allowed.",
      );
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError(
        "File size must not exceed 10 MB.",
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    setError("");

    if (!file) {
      setError("Please select a receipt file.");
      return;
    }

    try {
      await createReceipt.mutateAsync({
        file,
        expense_id: expenseId || undefined,
      });

      resetForm();
      onOpenChange(false);
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to upload receipt.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
          return;
        }

        onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            Upload receipt
          </DialogTitle>

          <DialogDescription>
            Upload a receipt and optionally link it
            to an expense.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="receipt-file">
              Receipt file
            </Label>

            <input
              id="receipt-file"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={handleFileChange}
              disabled={createReceipt.isPending}
              className="block w-full cursor-pointer rounded-md border border-input bg-background text-sm file:mr-4 file:border-0 file:border-r file:border-input file:bg-muted file:px-4 file:py-2 file:text-sm"
            />

            <p className="text-xs text-muted-foreground">
              JPG, PNG, WEBP, or PDF. Maximum size:
              10 MB.
            </p>

            {file && (
              <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                <p className="font-medium">
                  {file.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt-expense">
              Link to expense
            </Label>

            <select
              id="receipt-expense"
              value={expenseId}
              onChange={(event) => {
                setExpenseId(event.target.value);
              }}
              disabled={createReceipt.isPending}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">
                No expense
              </option>

              {expenses.map((expense) => (
                <option
                  key={expense.id}
                  value={expense.id}
                >
                  {expense.description} —{" "}
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(expense.amount)}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createReceipt.isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={
              createReceipt.isPending ||
              !file
            }
          >
            {createReceipt.isPending
              ? "Uploading..."
              : "Upload receipt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}