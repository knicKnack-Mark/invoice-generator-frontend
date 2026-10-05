
import { apiClient } from "@/lib/api/client";

import type {
  CreateProjectRequest,
  Project,
  ProjectListResponse,
  UpdateProjectRequest,
} from "./types";

export async function getProjects(
  page = 1,
  perPage = 20,
  search = "",
): Promise<ProjectListResponse> {
  const response =
    await apiClient.get<ProjectListResponse>(
      "/projects",
      {
        params: {
          page,
          per_page: perPage,
          search: search || undefined,
        },
      },
    );

  return response.data;
}

export async function getProject(
  id: string,
): Promise<Project> {
  const response = await apiClient.get<Project>(
    `/projects/${id}`,
  );

  return response.data;
}

export async function createProject(
  payload: CreateProjectRequest,
): Promise<Project> {
  const response =
    await apiClient.post<Project>(
      "/projects",
      payload,
    );

  return response.data;
}

export async function updateProject(
  id: string,
  payload: UpdateProjectRequest,
): Promise<Project> {
  const response =
    await apiClient.patch<Project>(
      `/projects/${id}`,
      payload,
    );

  return response.data;
}

export async function deleteProject(
  id: string,
): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}