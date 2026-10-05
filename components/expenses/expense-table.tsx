"use client";

import {
  MoreHorizontal,
  Pencil,
  Receipt,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Expense } from "@/features/expenses/types";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

function formatDate(date: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusLabel(status: Expense["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

function getStatusClass(status: Expense["status"]) {
  switch (status) {
    case "approved":
      return "text-emerald-700";
    case "rejected":
      return "text-red-700";
    case "pending":
      return "text-amber-700";
    default:
      return "text-black/60";
  }
}

export function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-black/8 bg-white px-6 py-16 text-center">
        <Receipt className="mx-auto mb-3 h-8 w-8 text-black/25" />

        <h3 className="text-sm font-medium text-[#1d1d1b]">
          No expenses found
        </h3>

        <p className="mt-1 text-sm text-black/45">
          Try adjusting your search or create a new expense.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/8 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/8 bg-black/[0.02] text-left">
              <th className="px-5 py-3 font-medium text-black/55">
                Expense
              </th>

              <th className="px-5 py-3 font-medium text-black/55">
                Client
              </th>

              <th className="px-5 py-3 font-medium text-black/55">
                Date
              </th>

              <th className="px-5 py-3 font-medium text-black/55">
                Payment
              </th>

              <th className="px-5 py-3 text-right font-medium text-black/55">
                Amount
              </th>

              <th className="px-5 py-3 font-medium text-black/55">
                Status
              </th>

              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-black/6 last:border-0 hover:bg-black/[0.015]"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-[#1d1d1b]">
                      {expense.description}
                    </p>

                    {expense.category_name && (
                      <p className="mt-0.5 text-xs text-black/40">
                        {expense.category_name}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div>
                    <p className="text-black/75">
                      {expense.client_name || "—"}
                    </p>

                    {expense.project_name && (
                      <p className="mt-0.5 text-xs text-black/40">
                        {expense.project_name}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4 text-black/60">
                  {formatDate(expense.expense_date)}
                </td>

                <td className="px-5 py-4 capitalize text-black/60">
                  {expense.payment_method.replaceAll("_", " ")}
                </td>

                <td className="px-5 py-4 text-right font-medium text-[#1d1d1b]">
                  {currencyFormatter.format(expense.amount)}
                </td>

                <td
                  className={`px-5 py-4 font-medium ${getStatusClass(
                    expense.status,
                  )}`}
                >
                  {getStatusLabel(expense.status)}
                </td>

                <td className="px-3 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">
                          Expense actions
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(expense)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDelete(expense)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}