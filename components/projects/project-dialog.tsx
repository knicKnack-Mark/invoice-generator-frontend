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
  useCreateProject,
  useUpdateProject,
} from "@/features/projects/hooks";

import type { Project } from "@/features/projects/types";

const projectSchema = z.object({
  client_id: z.string().min(1, "Select a client."),

  name: z
    .string()
    .min(2, "Project name must be at least 2 characters."),

  description: z.string().optional(),

  start_date: z.string().optional(),

  end_date: z.string().optional(),
});

type ProjectFormValues =
  z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;

  clients: {
    id: string;
    name: string;
  }[];
}

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  clients,
}: ProjectDialogProps) {
  const isEditing = Boolean(project);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),

    defaultValues: {
      client_id: "",
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      client_id: project?.client_id ?? "",
      name: project?.name ?? "",
      description: project?.description ?? "",
      start_date: project?.start_date ?? "",
      end_date: project?.end_date ?? "",
    });
  }, [open, project, form]);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  const handleSubmit = form.handleSubmit(
    (values) => {
      if (project) {
        updateMutation.mutate(
          {
            id: project.id,
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

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit project"
              : "New project"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the project information."
              : "Create a project for one of your clients."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="project-client">
              Client
            </Label>

            <select
              id="project-client"
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

            {form.formState.errors.client_id && (
              <p className="text-sm text-destructive">
                {
                  form.formState.errors
                    .client_id.message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-name">
              Project name
            </Label>

            <Input
              id="project-name"
              placeholder="Website redesign"
              {...form.register("name")}
              disabled={isPending}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {
                  form.formState.errors.name.message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">
              Description
            </Label>

            <Input
              id="project-description"
              placeholder="Optional project description"
              {...form.register("description")}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-start">
                Start date
              </Label>

              <Input
                id="project-start"
                type="date"
                {...form.register("start_date")}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-end">
                End date
              </Label>

              <Input
                id="project-end"
                type="date"
                {...form.register("end_date")}
                disabled={isPending}
              />
            </div>
          </div>

          {(createMutation.isError ||
            updateMutation.isError) && (
            <p className="text-sm text-destructive">
              Unable to save project. Please try
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
                  : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}