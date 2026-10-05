"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  useCreateInvoice,
  useUpdateInvoice,
} from "@/features/invoices/hooks";

import type { Invoice } from "@/features/invoices/types";

const invoiceSchema = z.object({
  client_id: z.string().min(1, "Select a client."),

  project_id: z.string().optional(),

  invoice_number: z
    .string()
    .min(1, "Invoice number is required."),

  issue_date: z
    .string()
    .min(1, "Issue date is required."),

  due_date: z
    .string()
    .min(1, "Due date is required."),

  subtotal: z.coerce
    .number()
    .min(0, "Subtotal cannot be negative."),

  tax: z.coerce
    .number()
    .min(0, "Tax cannot be negative."),

  notes: z.string().optional(),
});

type InvoiceFormValues =
  z.infer<typeof invoiceSchema>;

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;

  clients: {
    id: string;
    name: string;
  }[];

  projects: {
    id: string;
    name: string;
    client_id: string;
  }[];
}

export function InvoiceDialog({
  open,
  onOpenChange,
  invoice,
  clients,
  projects,
}: InvoiceDialogProps) {
  const isEditing = Boolean(invoice);

  const createMutation =
    useCreateInvoice();

  const updateMutation =
    useUpdateInvoice();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),

    defaultValues: {
      client_id: "",
      project_id: "",
      invoice_number: "",
      issue_date: "",
      due_date: "",
      subtotal: 0,
      tax: 0,
      notes: "",
    },
  });

  const selectedClientId =
    form.watch("client_id");

  const filteredProjects =
    projects.filter(
      (project) =>
        project.client_id ===
        selectedClientId,
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      client_id:
        invoice?.client_id ?? "",

      project_id:
        invoice?.project_id ?? "",

      invoice_number:
        invoice?.invoice_number ?? "",

      issue_date:
        invoice?.issue_date ?? "",

      due_date:
        invoice?.due_date ?? "",

      subtotal:
        invoice?.subtotal ?? 0,

      tax:
        invoice?.tax ?? 0,

      notes:
        invoice?.notes ?? "",
    });
  }, [open, invoice, form]);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  const handleSubmit = form.handleSubmit(
    (values) => {
      if (invoice) {
        updateMutation.mutate(
          {
            id: invoice.id,
            payload: values,
          },
          {
            onSuccess: () => {
              onOpenChange(false);
              form.reset();
            },
          },
        );

        return;
      }

      createMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    },
  );

  const subtotal =
    Number(form.watch("subtotal")) || 0;

  const tax =
    Number(form.watch("tax")) || 0;

  const total = subtotal + tax;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit invoice"
              : "New invoice"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the invoice information."
              : "Create a new invoice for your client."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoice-number">
                Invoice number
              </Label>

              <Input
                id="invoice-number"
                placeholder="INV-2026-001"
                {...form.register(
                  "invoice_number",
                )}
                disabled={isPending}
              />

              {form.formState.errors
                .invoice_number && (
                <p className="text-sm text-destructive">
                  {
                    form.formState.errors
                      .invoice_number.message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-client">
                Client
              </Label>

              <select
                id="invoice-client"
                {...form.register("client_id")}
                disabled={isPending}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">
                  Select a client
                </option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>

              {form.formState.errors
                .client_id && (
                <p className="text-sm text-destructive">
                  {
                    form.formState.errors
                      .client_id.message
                  }
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-project">
              Project
            </Label>

            <select
              id="invoice-project"
              {...form.register("project_id")}
              disabled={
                isPending ||
                !selectedClientId
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">
                No project
              </option>

              {filteredProjects.map(
                (project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoice-issue-date">
                Issue date
              </Label>

              <Input
                id="invoice-issue-date"
                type="date"
                {...form.register(
                  "issue_date",
                )}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-due-date">
                Due date
              </Label>

              <Input
                id="invoice-due-date"
                type="date"
                {...form.register(
                  "due_date",
                )}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoice-subtotal">
                Subtotal
              </Label>

              <Input
                id="invoice-subtotal"
                type="number"
                min="0"
                step="0.01"
                {...form.register(
                  "subtotal",
                )}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-tax">
                Tax
              </Label>

              <Input
                id="invoice-tax"
                type="number"
                min="0"
                step="0.01"
                {...form.register("tax")}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="rounded-lg border border-black/8 bg-black/[0.02] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/50">
                Total
              </span>

              <span className="text-lg font-semibold">
                {new Intl.NumberFormat(
                  "en-PH",
                  {
                    style: "currency",
                    currency: "PHP",
                  },
                ).format(total)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-notes">
              Notes
            </Label>

            <Textarea
              id="invoice-notes"
              placeholder="Optional notes for this invoice"
              {...form.register("notes")}
              disabled={isPending}
            />
          </div>

          {(createMutation.isError ||
            updateMutation.isError) && (
            <p className="text-sm text-destructive">
              Unable to save invoice. Please try
              again.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}