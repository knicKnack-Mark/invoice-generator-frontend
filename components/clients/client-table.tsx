"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Client } from "@/features/clients/types";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientTable({
  clients,
  onEdit,
  onDelete,
}: ClientTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/8 text-left text-xs uppercase tracking-[0.12em] text-black/40">
            <th className="px-5 py-4 font-medium">
              Client
            </th>

            <th className="px-5 py-4 font-medium">
              Company
            </th>

            <th className="px-5 py-4 font-medium">
              Phone
            </th>

            <th className="px-5 py-4 font-medium">
              Status
            </th>

            <th className="w-12 px-3 py-4" />
          </tr>
        </thead>

        <tbody className="divide-y divide-black/6">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="group transition-colors hover:bg-black/[0.02]"
            >
              <td className="px-5 py-4">
                <div>
                  <p className="font-medium text-[#1d1d1b]">
                    {client.name}
                  </p>

                  <p className="mt-0.5 text-xs text-black/45">
                    {client.email}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4 text-black/65">
                {client.company || "—"}
              </td>

              <td className="px-5 py-4 text-black/65">
                {client.phone || "—"}
              </td>

              <td className="px-5 py-4">
                <span
                  className={
                    client.is_active
                      ? "text-xs font-medium text-emerald-700"
                      : "text-xs font-medium text-black/40"
                  }
                >
                  {client.is_active
                    ? "Active"
                    : "Inactive"}
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
                        Client actions
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(client)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(client)}
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