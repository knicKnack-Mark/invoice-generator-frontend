"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ReceiptTable } from "@/components/receipts/receipt-table";
import { ReceiptDialog } from "@/components/receipts/receipt-dialog";
import { ReceiptDeleteDialog } from "@/components/receipts/receipt-delete-dialog";

import { useReceipts } from "@/features/receipts/hooks";
import type { Receipt } from "@/features/receipts/types";

import { useExpenses } from "@/features/expenses/hooks";

export default function ReceiptsPage() {
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedReceipt, setSelectedReceipt] =
    useState<Receipt | null>(null);

  const receiptsQuery = useReceipts(
    1,
    20,
    search,
  );

  const expensesQuery = useExpenses(1, 100);

  const receipts =
    receiptsQuery.data?.items ?? [];

  const expenses =
    expensesQuery.data?.items ?? [];

  function handleCreate() {
    setSelectedReceipt(null);
    setDialogOpen(true);
  }

  function handleDelete(receipt: Receipt) {
    setSelectedReceipt(receipt);
    setDeleteDialogOpen(true);
  }

  const isLoading =
    receiptsQuery.isLoading ||
    expensesQuery.isLoading;

  const hasError =
    receiptsQuery.isError ||
    expensesQuery.isError;

  return (
    <div className="p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/40">
              Finance
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Receipts
            </h1>

            <p className="mt-1 text-sm text-black/50">
              Store and organize your expense receipts.
            </p>
          </div>

          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Upload receipt
          </Button>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search receipts..."
              className="pl-9"
            />
          </div>

          <p className="text-sm text-black/45">
            {receiptsQuery.data?.total ?? 0}{" "}
            {(receiptsQuery.data?.total ?? 0) === 1
              ? "receipt"
              : "receipts"}
          </p>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-black/8 bg-white px-6 py-16 text-center text-sm text-black/45">
            Loading receipts...
          </div>
        )}

        {hasError && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
            <p className="text-sm font-medium text-red-700">
              Failed to load receipts.
            </p>

            <p className="mt-1 text-sm text-red-600/80">
              Please check your API connection and try
              again.
            </p>
          </div>
        )}

        {!isLoading && !hasError && (
          <ReceiptTable
            receipts={receipts}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ReceiptDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        expenses={expenses}
      />

      <ReceiptDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        receipt={selectedReceipt}
      />
    </div>
  );
}