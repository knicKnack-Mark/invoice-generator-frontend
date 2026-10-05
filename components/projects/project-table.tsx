"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Project } from "@/features/projects/types";

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function getStatusLabel(
  status: Project["status"],
) {
  switch (status) {
    case "active":
      return "Active";

    case "completed":
      return "Completed";

    case "archived":
      return "Archived";
  }
}

export function ProjectTable({
  projects,
  onEdit,
  onDelete,
}: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/8 text-left text-xs uppercase tracking-[0.12em] text-black/40">
            <th className="px-5 py-4 font-medium">
              Project
            </th>

            <th className="px-5 py-4 font-medium">
              Client
            </th>

            <th className="px-5 py-4 font-medium">
              Dates
            </th>

            <th className="px-5 py-4 font-medium">
              Status
            </th>

            <th className="w-12 px-3 py-4" />
          </tr>
        </thead>

        <tbody className="divide-y divide-black/6">
          {projects.map((project) => (
            <tr
              key={project.id}
              className="group transition-colors hover:bg-black/[0.02]"
            >
              <td className="px-5 py-4">
                <div>
                  <p className="font-medium">
                    {project.name}
                  </p>

                  {project.description && (
                    <p className="mt-0.5 max-w-md truncate text-xs text-black/45">
                      {project.description}
                    </p>
                  )}
                </div>
              </td>

              <td className="px-5 py-4 text-black/65">
                {project.client_name}
              </td>

              <td className="px-5 py-4 text-black/55">
                {project.start_date ||
                project.end_date ? (
                  <>
                    {project.start_date || "—"}
                    {" → "}
                    {project.end_date || "—"}
                  </>
                ) : (
                  "—"
                )}
              </td>

              <td className="px-5 py-4">
                <span className="text-xs font-medium text-black/60">
                  {getStatusLabel(project.status)}
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
                        Project actions
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onEdit(project)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        onDelete(project)
                      }
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