"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useClients } from "@/features/clients/hooks";
import { useProjects } from "@/features/projects/hooks";
import {
  useCreateInvoice,
  useUpdateInvoice,
} from "@/features/invoices/hooks";

import type {
  Invoice,
  InvoiceStatus,
} from "@/features/invoices/types";

const invoiceSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  project_id: z.string().optional(),
  invoice_number: z
    .string()
    .min(1, "Invoice number is required"),
  issue_date: z
    .string()
    .min(1, "Issue date is required"),
  due_date: z
    .string()
    .min(1, "Due date is required"),
  subtotal: z.coerce
    .number()
    .nonnegative("Subtotal cannot be negative"),
  tax: z.coerce
    .number()
    .nonnegative("Tax cannot be negative"),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
}

const defaultValues: InvoiceFormValues = {
  client_id: "",
  project_id: "",
  invoice_number: "",
  issue_date: new Date().toISOString().split("T")[0],
  due_date: new Date().toISOString().split("T")[0],
  subtotal: 0,
  tax: 0,
  notes: "",
};

export function InvoiceDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceDialogProps) {
  const isEditing = Boolean(invoice);

  const { data: clientsData } = useClients(1, 100);
  const { data: projectsData } = useProjects(1, 100);

  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();

  const clients = clientsData?.items ?? [];
  const projects = projectsData?.items ?? [];

  const form = useForm<InvoiceFormValues>({
    defaultValues,
  });

  const selectedClientId = useWatch({
    control: form.control,
    name: "client_id",
  });

  const subtotal =
    useWatch({
      control: form.control,
      name: "subtotal",
    }) ?? 0;

  const tax =
    useWatch({
      control: form.control,
      name: "tax",
    }) ?? 0;

  const filteredProjects = selectedClientId
    ? projects.filter(
        (project) =>
          project.client_id === selectedClientId,
      )
    : projects;

  const total =
    Number(subtotal || 0) +
    Number(tax || 0);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (invoice) {
      form.reset({
        client_id: invoice.client_id,
        project_id: invoice.project_id ?? "",
        invoice_number: invoice.invoice_number,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        notes: invoice.notes ?? "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [open, invoice, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const parsed = invoiceSchema.safeParse(values);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];

      if (firstError?.path[0]) {
        form.setError(
          firstError.path[0] as keyof InvoiceFormValues,
          {
            message: firstError.message,
          },
        );
      }

      return;
    }

    const payload = {
      client_id: values.client_id,
      project_id: values.project_id || undefined,
      invoice_number: values.invoice_number,
      issue_date: values.issue_date,
      due_date: values.due_date,
      subtotal: values.subtotal,
      tax: values.tax,
      notes: values.notes || undefined,
    };

    try {
      if (isEditing && invoice) {
        await updateInvoice.mutateAsync({
          id: invoice.id,
          payload,
        });
      } else {
        await createInvoice.mutateAsync(payload);
      }

      onOpenChange(false);
    } catch {
      // Mutation error is handled by the hook/UI state.
    }
  });

  const isSubmitting =
    createInvoice.isPending ||
    updateInvoice.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit invoice" : "Create invoice"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the invoice information below."
              : "Create a new invoice for your client."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoice-client">
                Client
              </Label>

              <select
                id="invoice-client"
                {...form.register("client_id")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">
                  Select client
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

              {form.formState.errors.client_id && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.client_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-project">
                Project
              </Label>

              <select
                id="invoice-project"
                {...form.register("project_id")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">
                  No project
                </option>

                {filteredProjects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-number">
              Invoice number
            </Label>

            <Input
              id="invoice-number"
              placeholder="INV-0001"
              {...form.register("invoice_number")}
            />

            {form.formState.errors.invoice_number && (
              <p className="text-xs text-red-600">
                {form.formState.errors.invoice_number.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoice-issue-date">
                Issue date
              </Label>

              <Input
                id="invoice-issue-date"
                type="date"
                {...form.register("issue_date")}
              />

              {form.formState.errors.issue_date && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.issue_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-due-date">
                Due date
              </Label>

              <Input
                id="invoice-due-date"
                type="date"
                {...form.register("due_date")}
              />

              {form.formState.errors.due_date && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.due_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoice-subtotal">
                Subtotal
              </Label>

              <Input
                id="invoice-subtotal"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...form.register("subtotal", {
                  valueAsNumber: true,
                })}
              />

              {form.formState.errors.subtotal && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.subtotal.message}
                </p>
              )}
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
                placeholder="0.00"
                {...form.register("tax", {
                  valueAsNumber: true,
                })}
              />

              {form.formState.errors.tax && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.tax.message}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Total
              </span>

              <span className="text-lg font-semibold">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(total)}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Total is calculated from subtotal + tax.
              The backend remains the source of truth.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-notes">
              Notes
            </Label>

            <Textarea
              id="invoice-notes"
              placeholder="Optional notes..."
              rows={4}
              {...form.register("notes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
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