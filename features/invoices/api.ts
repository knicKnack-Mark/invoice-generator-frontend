import { apiClient } from "@/lib/api/client";

import type {
  CreateInvoiceRequest,
  Invoice,
  InvoiceListResponse,
  UpdateInvoiceRequest,
} from "./types";

export async function getInvoices(
  page = 1,
  perPage = 20,
  search = "",
): Promise<InvoiceListResponse> {
  const response =
    await apiClient.get<InvoiceListResponse>(
      "/invoices",
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

export async function getInvoice(
  id: string,
): Promise<Invoice> {
  const response =
    await apiClient.get<Invoice>(
      `/invoices/${id}`,
    );

  return response.data;
}

export async function createInvoice(
  payload: CreateInvoiceRequest,
): Promise<Invoice> {
  const response =
    await apiClient.post<Invoice>(
      "/invoices",
      payload,
    );

  return response.data;
}

export async function updateInvoice(
  id: string,
  payload: UpdateInvoiceRequest,
): Promise<Invoice> {
  const response =
    await apiClient.patch<Invoice>(
      `/invoices/${id}`,
      payload,
    );

  return response.data;
}

export async function deleteInvoice(
  id: string,
): Promise<void> {
  await apiClient.delete(`/invoices/${id}`);
}