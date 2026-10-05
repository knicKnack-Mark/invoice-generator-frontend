import { apiClient } from "@/lib/api/client";
import type {
  CreateExpenseRequest,
  Expense,
  ExpenseListResponse,
  UpdateExpenseRequest,
} from "./types";

export async function getExpenses(
  page = 1,
  perPage = 20,
  search = "",
): Promise<ExpenseListResponse> {
  const response = await apiClient.get<ExpenseListResponse>("/expenses", {
    params: {
      page,
      per_page: perPage,
      search: search || undefined,
    },
  });

  return response.data;
}

export async function getExpense(id: string): Promise<Expense> {
  const response = await apiClient.get<Expense>(`/expenses/${id}`);

  return response.data;
}

export async function createExpense(
  payload: CreateExpenseRequest,
): Promise<Expense> {
  const response = await apiClient.post<Expense>("/expenses", payload);

  return response.data;
}

export async function updateExpense(
  id: string,
  payload: UpdateExpenseRequest,
): Promise<Expense> {
  const response = await apiClient.patch<Expense>(
    `/expenses/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteExpense(id: string): Promise<void> {
  await apiClient.delete(`/expenses/${id}`);
}