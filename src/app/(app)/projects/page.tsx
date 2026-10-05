"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ProjectTable } from "@/components/projects/project-table";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { ProjectDeleteDialog } from "@/components/projects/project-delete-dialog";

import { useProjects } from "@/features/projects/hooks";
import { useClients } from "@/features/clients/hooks";

import type { Project } from "@/features/projects/types";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useProjects(1, 20, search);

  const { data: clientsData } =
    useClients(1, 100);

  const projects = data?.items ?? [];

  const clients =
    clientsData?.items.map((client) => ({
      id: client.id,
      name: client.name,
    })) ?? [];

  const handleCreate = () => {
    setSelectedProject(null);
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
              Workspace
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Projects
            </h1>

            <p className="mt-1 text-sm text-black/50">
              Organize work by client and keep
              projects connected to your finances.
            </p>
          </div>

          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New project
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
              placeholder="Search projects..."
              className="pl-9"
            />
          </div>

          {data && (
            <p className="hidden shrink-0 text-sm text-black/40 sm:block">
              {data.total}{" "}
              {data.total === 1
                ? "project"
                : "projects"}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-black/8 bg-white">
          {isLoading && (
            <div className="p-8 text-sm text-black/50">
              Loading projects...
            </div>
          )}

          {isError && (
            <div className="p-8 text-sm text-destructive">
              Unable to load projects.
            </div>
          )}

          {!isLoading &&
            !isError &&
            projects.length === 0 && (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
                <h2 className="text-sm font-medium">
                  {search
                    ? "No projects found"
                    : "No projects yet"}
                </h2>

                <p className="mt-1 max-w-sm text-sm text-black/45">
                  {search
                    ? "Try adjusting your search."
                    : "Create your first project and connect it to a client."}
                </p>

                {!search && (
                  <Button
                    className="mt-5"
                    onClick={handleCreate}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add project
                  </Button>
                )}
              </div>
            )}

          {!isLoading &&
            !isError &&
            projects.length > 0 && (
              <ProjectTable
                projects={projects}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
        </div>
      </div>

      {/* Create / Edit */}
      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={selectedProject}
        clients={clients}
      />

      {/* Delete */}
      <ProjectDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        project={selectedProject}
      />
    </div>
  );
}