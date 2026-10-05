"use client";

import { useState } from "react";
import {
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { InvoiceTable } from "@/components/invoices/invoice-table";
import { InvoiceDialog } from "@/components/invoices/invoice-dialog";
import { InvoiceDeleteDialog } from "@/components/invoices/invoice-delete-dialog";

import { useInvoices } from "@/features/invoices/hooks";
import { useClients } from "@/features/clients/hooks";
import { useProjects } from "@/features/projects/hooks";

import type { Invoice } from "@/features/invoices/types";

export default function InvoicesPage() {
  const [search, setSearch] =
    useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useInvoices(
    1,
    20,
    search,
  );

  const { data: clientsData } =
    useClients(1, 100);

  const { data: projectsData } =
    useProjects(1, 100);

  const invoices =
    data?.items ?? [];

  const clients =
    clientsData?.items.map(
      (client) => ({
        id: client.id,
        name: client.name,
      }),
    ) ?? [];

  const projects =
    projectsData?.items.map(
      (project) => ({
        id: project.id,
        name: project.name,
        client_id: project.client_id,
      }),
    ) ?? [];

  const handleCreate = () => {
    setSelectedInvoice(null);
    setDialogOpen(true);
  };

  const handleEdit = (
    invoice: Invoice,
  ) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleDelete = (
    invoice: Invoice,
  ) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
              Finance
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Invoices
            </h1>

            <p className="mt-1 text-sm text-black/50">
              Create, manage, and track invoices
              for your clients.
            </p>
          </div>

          <Button
            onClick={handleCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            New invoice
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search invoices..."
              className="pl-9"
            />
          </div>

          {data && (
            <p className="hidden shrink-0 text-sm text-black/40 sm:block">
              {data.total}{" "}
              {data.total === 1
                ? "invoice"
                : "invoices"}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-black/8 bg-white">
          {isLoading && (
            <div className="p-8 text-sm text-black/50">
              Loading invoices...
            </div>
          )}

          {isError && (
            <div className="p-8 text-sm text-destructive">
              Unable to load invoices.
            </div>
          )}

          {!isLoading &&
            !isError &&
            invoices.length === 0 && (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
                <h2 className="text-sm font-medium">
                  {search
                    ? "No invoices found"
                    : "No invoices yet"}
                </h2>

                <p className="mt-1 max-w-sm text-sm text-black/45">
                  {search
                    ? "Try adjusting your search."
                    : "Create your first invoice and start tracking payments."}
                </p>

                {!search && (
                  <Button
                    className="mt-5"
                    onClick={
                      handleCreate
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create invoice
                  </Button>
                )}
              </div>
            )}

          {!isLoading &&
            !isError &&
            invoices.length > 0 && (
              <InvoiceTable
                invoices={invoices}
                onEdit={handleEdit}
                onDelete={
                  handleDelete
                }
              />
            )}
        </div>
      </div>

      {/* Create / Edit */}
      <InvoiceDialog
        open={dialogOpen}
        onOpenChange={
          setDialogOpen
        }
        invoice={
          selectedInvoice
        }
        clients={clients}
        projects={projects}
      />

      {/* Delete */}
      <InvoiceDeleteDialog
        open={
          deleteDialogOpen
        }
        onOpenChange={
          setDeleteDialogOpen
        }
        invoice={
          selectedInvoice
        }
      />
    </div>
  );
}