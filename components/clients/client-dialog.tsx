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

import {
  useCreateClient,
  useUpdateClient,
} from "@/features/clients/hooks";

import type { Client } from "@/features/clients/types";

const clientSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters."),

  email: z
    .string()
    .email("Enter a valid email address."),

  phone: z.string().optional(),

  company: z.string().optional(),

  address: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
}

export function ClientDialog({
  open,
  onOpenChange,
  client,
}: ClientDialogProps) {
  const isEditing = Boolean(client);

  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: client?.name ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      company: client?.company ?? "",
      address: client?.address ?? "",
    });
  }, [open, client, form]);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  const handleSubmit = form.handleSubmit((values) => {
    if (client) {
      updateMutation.mutate(
        {
          id: client.id,
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
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit client" : "New client"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the client's information."
              : "Add a client to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="client-name">
              Name
            </Label>

            <Input
              id="client-name"
              placeholder="John Doe"
              {...form.register("name")}
              disabled={isPending}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-email">
              Email
            </Label>

            <Input
              id="client-email"
              type="email"
              placeholder="john@example.com"
              {...form.register("email")}
              disabled={isPending}
            />

            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client-company">
                Company
              </Label>

              <Input
                id="client-company"
                placeholder="Acme Inc."
                {...form.register("company")}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-phone">
                Phone
              </Label>

              <Input
                id="client-phone"
                placeholder="+63 900 000 0000"
                {...form.register("phone")}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-address">
              Address
            </Label>

            <Input
              id="client-address"
              placeholder="Client address"
              {...form.register("address")}
              disabled={isPending}
            />
          </div>

          {(createMutation.isError ||
            updateMutation.isError) && (
            <p className="text-sm text-destructive">
              Unable to save client. Please try again.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                  : "Create client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}