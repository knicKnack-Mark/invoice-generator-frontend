
export type ProjectStatus =
  | "active"
  | "completed"
  | "archived";

export interface Project {
  id: string;
  client_id: string;
  client_name: string;

  name: string;
  description?: string | null;

  status: ProjectStatus;

  start_date?: string | null;
  end_date?: string | null;

  created_at: string;
}

export interface CreateProjectRequest {
  client_id: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
}

export interface UpdateProjectRequest {
  client_id?: string;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  per_page: number;
}