"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ExpenseTable } from "@/components/expenses/expense-table";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { ExpenseDeleteDialog } from "@/components/expenses/expense-delete-dialog";

import { useExpenses } from "@/features/expenses/hooks";
import type { Expense } from "@/features/expenses/types";

import { useClients } from "@/features/clients/hooks";
import { useProjects } from "@/features/projects/hooks";

export default function ExpensesPage() {
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedExpense, setSelectedExpense] =
    useState<Expense | null>(null);

  const expensesQuery = useExpenses(1, 20, search);

  const clientsQuery = useClients(1, 100);
  const projectsQuery = useProjects(1, 100);

  const expenses = expensesQuery.data?.items ?? [];
  const clients = clientsQuery.data?.items ?? [];
  const projects = projectsQuery.data?.items ?? [];

  function handleCreate() {
    setSelectedExpense(null);
    setDialogOpen(true);
  }

  function handleEdit(expense: Expense) {
    setSelectedExpense(expense);
    setDialogOpen(true);
  }

  function handleDelete(expense: Expense) {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  }

  const isLoading =
    expensesQuery.isLoading ||
    clientsQuery.isLoading ||
    projectsQuery.isLoading;

  const hasError =
    expensesQuery.isError ||
    clientsQuery.isError ||
    projectsQuery.isError;

  return (
    <div className="p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/40">
              Finance
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Expenses
            </h1>

            <p className="mt-1 text-sm text-black/50">
              Track and manage your business expenses.
            </p>
          </div>

          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New expense
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
              placeholder="Search expenses..."
              className="pl-9"
            />
          </div>

          <p className="text-sm text-black/45">
            {expensesQuery.data?.total ?? 0}{" "}
            {(expensesQuery.data?.total ?? 0) === 1
              ? "expense"
              : "expenses"}
          </p>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-black/8 bg-white px-6 py-16 text-center text-sm text-black/45">
            Loading expenses...
          </div>
        )}

        {hasError && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
            <p className="text-sm font-medium text-red-700">
              Failed to load expenses.
            </p>

            <p className="mt-1 text-sm text-red-600/80">
              Please check your API connection and try again.
            </p>
          </div>
        )}

        {!isLoading && !hasError && (
          <ExpenseTable
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        expense={selectedExpense}
        clients={clients}
        projects={projects}
      />

      <ExpenseDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        expense={selectedExpense}
      />
    </div>
  );
}