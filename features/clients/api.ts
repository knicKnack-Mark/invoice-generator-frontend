import { apiClient } from "@/lib/api/client";
import type {
  Client,
  ClientListResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from "./types";

export async function getClients(
  page = 1,
  perPage = 20,
  search = "",
): Promise<ClientListResponse> {
  const response = await apiClient.get<ClientListResponse>("/clients", {
    params: {
      page,
      per_page: perPage,
      search: search || undefined,
    },
  });

  return response.data;
}

export async function getClient(id: string): Promise<Client> {
  const response = await apiClient.get<Client>(`/clients/${id}`);

  return response.data;
}

export async function createClient(
  payload: CreateClientRequest,
): Promise<Client> {
  const response = await apiClient.post<Client>("/clients", payload);

  return response.data;
}

export async function updateClient(
  id: string,
  payload: UpdateClientRequest,
): Promise<Client> {
  const response = await apiClient.patch<Client>(
    `/clients/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteClient(id: string): Promise<void> {
  await apiClient.delete(`/clients/${id}`);
}