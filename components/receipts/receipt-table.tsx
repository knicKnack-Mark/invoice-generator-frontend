"use client";

import {
  Download,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Receipt } from "@/features/receipts/types";

interface ReceiptTableProps {
  receipts: Receipt[];
  onDelete: (receipt: Receipt) => void;
}

function formatDate(date: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatFileSize(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024),
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 1,
  )} ${units[index]}`;
}

function isImage(fileType: string) {
  return fileType.startsWith("image/");
}

export function ReceiptTable({
  receipts,
  onDelete,
}: ReceiptTableProps) {
  if (receipts.length === 0) {
    return (
      <div className="rounded-xl border border-black/8 bg-white px-6 py-16 text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-black/25" />

        <h3 className="text-sm font-medium text-[#1d1d1b]">
          No receipts found
        </h3>

        <p className="mt-1 text-sm text-black/45">
          Upload a receipt to get started.
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
                Receipt
              </th>

              <th className="px-5 py-3 font-medium text-black/55">
                Expense
              </th>

              <th className="px-5 py-3 font-medium text-black/55">
                Type
              </th>

              <th className="px-5 py-3 font-medium text-black/55">
                Size
              </th>

              <th className="px-5 py-3 font-medium text-black/55">
                Uploaded
              </th>

              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>

          <tbody>
            {receipts.map((receipt) => (
              <tr
                key={receipt.id}
                className="border-b border-black/6 last:border-0 hover:bg-black/[0.015]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.04]">
                      {isImage(receipt.file_type) ? (
                        <ImageIcon className="h-4 w-4 text-black/50" />
                      ) : (
                        <FileText className="h-4 w-4 text-black/50" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#1d1d1b]">
                        {receipt.file_name}
                      </p>

                      <p className="text-xs text-black/40">
                        {receipt.file_type}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-black/65">
                  {receipt.expense_description || "—"}
                </td>

                <td className="px-5 py-4 uppercase text-black/50">
                  {receipt.file_type.split("/")[1] || "FILE"}
                </td>

                <td className="px-5 py-4 text-black/50">
                  {formatFileSize(receipt.file_size)}
                </td>

                <td className="px-5 py-4 text-black/50">
                  {formatDate(receipt.created_at)}
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
                          Receipt actions
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {receipt.file_url && (
                        <DropdownMenuItem asChild>
                          <a
                            href={receipt.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Open receipt
                          </a>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDelete(receipt)}
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