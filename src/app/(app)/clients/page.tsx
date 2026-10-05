"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ClientDialog } from "@/components/clients/client-dialog";
import { ClientDeleteDialog } from "@/components/clients/client-delete-dialog";
import { ClientTable } from "@/components/clients/client-table";

import { useClients } from "@/features/clients/hooks";
import type { Client } from "@/features/clients/types";

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useClients(1, 20, search);

  const clients = data?.items ?? [];

  const handleCreate = () => {
    setSelectedClient(null);
    setDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
              Workspace
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Clients
            </h1>

            <p className="mt-1 text-sm text-black/50">
              Manage the people and businesses you
              invoice.
            </p>
          </div>

          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New client
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search clients..."
              className="pl-9"
            />
          </div>

          {data && (
            <p className="hidden shrink-0 text-sm text-black/40 sm:block">
              {data.total}{" "}
              {data.total === 1
                ? "client"
                : "clients"}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-black/8 bg-white">
          {isLoading && (
            <div className="p-8 text-sm text-black/50">
              Loading clients...
            </div>
          )}

          {isError && (
            <div className="p-8 text-sm text-destructive">
              Unable to load clients.
            </div>
          )}

          {!isLoading &&
            !isError &&
            clients.length === 0 && (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
                <h2 className="text-sm font-medium">
                  {search
                    ? "No clients found"
                    : "No clients yet"}
                </h2>

                <p className="mt-1 max-w-sm text-sm text-black/45">
                  {search
                    ? "Try adjusting your search."
                    : "Add your first client to start tracking invoices, projects, and payments."}
                </p>

                {!search && (
                  <Button
                    className="mt-5"
                    onClick={handleCreate}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add client
                  </Button>
                )}
              </div>
            )}

          {!isLoading &&
            !isError &&
            clients.length > 0 && (
              <ClientTable
                clients={clients}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
        </div>
      </div>

      {/* Create / Edit */}
      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={selectedClient}
      />

      {/* Delete */}
      <ClientDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        client={selectedClient}
      />
    </div>
  );
}