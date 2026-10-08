"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";

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

import {
  useCreateReceipt,
} from "@/features/receipts/hooks";

import type { Expense } from "@/features/expenses/types";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: Expense[];
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
  expenses,
}: ReceiptDialogProps) {
  const createMutation = useCreateReceipt();

  const [file, setFile] = useState<File | null>(null);
  const [expenseId, setExpenseId] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError(
        "Invalid file type. Please upload JPG, PNG, WEBP, or PDF.",
      );
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size cannot exceed 10 MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  function handleClose() {
    if (createMutation.isPending) {
      return;
    }

    setFile(null);
    setExpenseId("");
    setError("");

    onOpenChange(false);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!file) {
      setError("Please select a receipt file.");
      return;
    }

    setError("");

    try {
      await createMutation.mutateAsync({
        file,
        expense_id: expenseId || undefined,
      });

      setFile(null);
      setExpenseId("");
      setError("");

      onOpenChange(false);
    } catch {
      setError(
        "Failed to upload receipt. Please try again.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
          return;
        }

        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Upload receipt</DialogTitle>

          <DialogDescription>
            Upload a receipt and optionally link it to an
            expense.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="receipt-file">
              Receipt file
            </Label>

            <label
              htmlFor="receipt-file"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/15 bg-black/[0.015] px-6 py-10 text-center transition hover:bg-black/[0.03]"
            >
              <FileUp className="mb-3 h-7 w-7 text-black/40" />

              <span className="text-sm font-medium">
                {file
                  ? file.name
                  : "Choose a receipt file"}
              </span>

              <span className="mt-1 text-xs text-black/40">
                JPG, PNG, WEBP or PDF · Max 10 MB
              </span>

              <input
                id="receipt-file"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt-expense">
              Link to expense
            </Label>

            <select
              id="receipt-expense"
              value={expenseId}
              onChange={(event) =>
                setExpenseId(event.target.value)
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">No expense</option>

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
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createMutation.isPending || !file
              }
            >
              {createMutation.isPending
                ? "Uploading..."
                : "Upload receipt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}