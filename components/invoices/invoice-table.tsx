"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Invoice } from "@/features/invoices/types";

interface InvoiceTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

const currencyFormatter =
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

function getStatusLabel(
  status: Invoice["status"],
) {
  switch (status) {
    case "draft":
      return "Draft";

    case "sent":
      return "Sent";

    case "paid":
      return "Paid";

    case "overdue":
      return "Overdue";

    case "cancelled":
      return "Cancelled";
  }
}

function getStatusClass(
  status: Invoice["status"],
) {
  switch (status) {
    case "paid":
      return "text-emerald-700";

    case "overdue":
      return "text-red-600";

    case "cancelled":
      return "text-black/35";

    case "sent":
      return "text-blue-700";

    default:
      return "text-black/55";
  }
}

export function InvoiceTable({
  invoices,
  onEdit,
  onDelete,
}: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/8 text-left text-xs uppercase tracking-[0.12em] text-black/40">
            <th className="px-5 py-4 font-medium">
              Invoice
            </th>

            <th className="px-5 py-4 font-medium">
              Client
            </th>

            <th className="px-5 py-4 font-medium">
              Due
            </th>

            <th className="px-5 py-4 font-medium">
              Amount
            </th>

            <th className="px-5 py-4 font-medium">
              Status
            </th>

            <th className="w-12 px-3 py-4" />
          </tr>
        </thead>

        <tbody className="divide-y divide-black/6">
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="group transition-colors hover:bg-black/[0.02]"
            >
              <td className="px-5 py-4">
                <div>
                  <p className="font-medium">
                    {invoice.invoice_number}
                  </p>

                  <p className="mt-0.5 text-xs text-black/45">
                    {invoice.issue_date}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <div>
                  <p className="text-black/75">
                    {invoice.client_name}
                  </p>

                  {invoice.project_name && (
                    <p className="mt-0.5 text-xs text-black/40">
                      {invoice.project_name}
                    </p>
                  )}
                </div>
              </td>

              <td className="px-5 py-4 text-black/55">
                {invoice.due_date}
              </td>

              <td className="px-5 py-4 font-medium">
                {currencyFormatter.format(
                  invoice.total,
                )}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`text-xs font-medium ${getStatusClass(
                    invoice.status,
                  )}`}
                >
                  {getStatusLabel(
                    invoice.status,
                  )}
                </span>
              </td>

              <td className="px-3 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />

                      <span className="sr-only">
                        Invoice actions
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onEdit(invoice)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        onDelete(invoice)
                      }
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
  );
}