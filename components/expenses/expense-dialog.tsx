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
  useCreateExpense,
  useUpdateExpense,
} from "@/features/expenses/hooks";

import type {
  Expense,
  PaymentMethod,
} from "@/features/expenses/types";

const expenseSchema = z.object({
  client_id: z.string().optional(),
  project_id: z.string().optional(),
  description: z
    .string()
    .min(1, "Description is required"),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0"),
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
}

const defaultValues: ExpenseFormValues = {
  client_id: "",
  project_id: "",
  description: "",
  amount: 0,
  expense_date: new Date().toISOString().split("T")[0],
  payment_method: "cash",
  notes: "",
};

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
}: ExpenseDialogProps) {
  const isEditing = Boolean(expense);

  const { data: clientsData } = useClients(1, 100);
  const { data: projectsData } = useProjects(1, 100);

  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const clients = clientsData?.items ?? [];
  const projects = projectsData?.items ?? [];

  const form = useForm<ExpenseFormValues>({
    defaultValues,
  });

  const selectedClientId = useWatch({
    control: form.control,
    name: "client_id",
  });

  const filteredProjects = selectedClientId
    ? projects.filter(
        (project) =>
          project.client_id === selectedClientId,
      )
    : projects;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (expense) {
      form.reset({
        client_id: expense.client_id ?? "",
        project_id: expense.project_id ?? "",
        description: expense.description,
        amount: expense.amount,
        expense_date: expense.expense_date,
        payment_method: expense.payment_method,
        notes: expense.notes ?? "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [open, expense, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const parsed = expenseSchema.safeParse(values);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];

      if (firstError?.path[0]) {
        form.setError(
          firstError.path[0] as keyof ExpenseFormValues,
          {
            message: firstError.message,
          },
        );
      }

      return;
    }

    const payload = {
      client_id: values.client_id || undefined,
      project_id: values.project_id || undefined,
      description: values.description,
      amount: values.amount,
      expense_date: values.expense_date,
      payment_method:
        values.payment_method as PaymentMethod,
      notes: values.notes || undefined,
    };

    try {
      if (isEditing && expense) {
        await updateExpense.mutateAsync({
          id: expense.id,
          payload,
        });
      } else {
        await createExpense.mutateAsync(payload);
      }

      onOpenChange(false);
    } catch {
      // Mutation error is handled by the hook/UI state.
    }
  });

  const isSubmitting =
    createExpense.isPending ||
    updateExpense.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit expense" : "Add expense"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the expense information below."
              : "Record a new business expense."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expense-client">
                Client
              </Label>

              <select
                id="expense-client"
                {...form.register("client_id")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">
                  No client
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-project">
                Project
              </Label>

              <select
                id="expense-project"
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">
                Amount
              </Label>

              <Input
                id="expense-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...form.register("amount", {
                  valueAsNumber: true,
                })}
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
            <Label htmlFor="expense-payment">
              Payment method
            </Label>

            <select
              id="expense-payment"
              {...form.register("payment_method")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
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
            <Label htmlFor="expense-notes">
              Notes
            </Label>

            <Textarea
              id="expense-notes"
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
                  : "Add expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}