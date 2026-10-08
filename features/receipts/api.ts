
import { apiClient } from "@/lib/api/client";
import type {
  CreateReceiptRequest,
  Receipt,
  ReceiptListResponse,
} from "./types";

export async function getReceipts(
  page = 1,
  perPage = 20,
  search = "",
): Promise<ReceiptListResponse> {
  const response = await apiClient.get<ReceiptListResponse>(
    "/receipts",
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

export async function getReceipt(
  id: string,
): Promise<Receipt> {
  const response = await apiClient.get<Receipt>(
    `/receipts/${id}`,
  );

  return response.data;
}

export async function createReceipt(
  payload: CreateReceiptRequest,
): Promise<Receipt> {
  const formData = new FormData();

  formData.append("file", payload.file);

  if (payload.expense_id) {
    formData.append("expense_id", payload.expense_id);
  }

  const response = await apiClient.post<Receipt>(
    "/receipts",
    formData,
  );

  return response.data;
}

export async function deleteReceipt(
  id: string,
): Promise<void> {
  await apiClient.delete(`/receipts/${id}`);
}