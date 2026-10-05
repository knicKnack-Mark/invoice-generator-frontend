"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useCreateExpense,
  useUpdateExpense,
} from "@/features/expenses/hooks";

import type {
  Expense,
  PaymentMethod,
  ExpenseStatus,
} from "@/features/expenses/types";

import type { Client } from "@/features/clients/types";
import type { Project } from "@/features/projects/types";

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

const expenseSchema = z.object({
  client_id: z.string().optional(),
  project_id: z.string().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(255),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (value) => Number(value) > 0,
      "Amount must be greater than 0",
    ),
  expense_date: z.string().min(1, "Expense date is required"),
  payment_method: z.enum([
    "cash",
    "bank_transfer",
    "credit_card",
    "debit_card",
    "other",
  ]),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
  clients: Client[];
  projects: Project[];
}

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
  clients,
  projects,
}: ExpenseDialogProps) {
  const isEditing = Boolean(expense);

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      client_id: "",
      project_id: "",
      description: "",
      amount: "",
      expense_date: new Date().toISOString().split("T")[0],
      payment_method: "cash",
      notes: "",
    },
  });

  const selectedClientId = form.watch("client_id");

  const filteredProjects = selectedClientId
    ? projects.filter(
        (project) => project.client_id === selectedClientId,
      )
    : projects;

  useEffect(() => {
    if (!open) return;

    if (expense) {
      form.reset({
        client_id: expense.client_id ?? "",
        project_id: expense.project_id ?? "",
        description: expense.description,
        amount: String(expense.amount),
        expense_date: expense.expense_date?.split("T")[0] ?? "",
        payment_method: expense.payment_method,
        notes: expense.notes ?? "",
      });

      return;
    }

    form.reset({
      client_id: "",
      project_id: "",
      description: "",
      amount: "",
      expense_date: new Date().toISOString().split("T")[0],
      payment_method: "cash",
      notes: "",
    });
  }, [open, expense, form]);

  useEffect(() => {
    const project = form.getValues("project_id");

    if (
      project &&
      selectedClientId &&
      !projects.some(
        (item) =>
          item.id === project &&
          item.client_id === selectedClientId,
      )
    ) {
      form.setValue("project_id", "");
    }
  }, [selectedClientId, projects, form]);

  async function onSubmit(values: ExpenseFormValues) {
    const payload = {
      client_id: values.client_id || undefined,
      project_id: values.project_id || undefined,
      description: values.description,
      amount: Number(values.amount),
      expense_date: values.expense_date,
      payment_method: values.payment_method as PaymentMethod,
      notes: values.notes || undefined,
    };

    try {
      if (isEditing && expense) {
        await updateMutation.mutateAsync({
          id: expense.id,
          payload: {
            ...payload,
            status: expense.status as ExpenseStatus,
          },
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      onOpenChange(false);
      form.reset();
    } catch {
      // Keep the dialog open so the user can correct the form.
    }
  }

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit expense" : "Create expense"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the expense information."
              : "Record a new business expense."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expense-client">Client</Label>

              <select
                id="expense-client"
                {...form.register("client_id")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">No client</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-project">Project</Label>

              <select
                id="expense-project"
                {...form.register("project_id")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">No project</option>

                {filteredProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description">
              Description
            </Label>

            <Input
              id="expense-description"
              placeholder="e.g. Adobe subscription"
              {...form.register("description")}
            />

            {form.formState.errors.description && (
              <p className="text-xs text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount</Label>

              <Input
                id="expense-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...form.register("amount")}
              />

              {form.formState.errors.amount && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-date">
                Expense date
              </Label>

              <Input
                id="expense-date"
                type="date"
                {...form.register("expense_date")}
              />

              {form.formState.errors.expense_date && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.expense_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-payment-method">
              Payment method
            </Label>

            <select
              id="expense-payment-method"
              {...form.register("payment_method")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">
                Bank transfer
              </option>
              <option value="credit_card">
                Credit card
              </option>
              <option value="debit_card">
                Debit card
              </option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-notes">Notes</Label>

            <Textarea
              id="expense-notes"
              placeholder="Optional notes..."
              rows={3}
              {...form.register("notes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}