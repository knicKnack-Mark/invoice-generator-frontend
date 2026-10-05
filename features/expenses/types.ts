export type ExpenseStatus = "pending" | "approved" | "rejected";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "credit_card"
  | "debit_card"
  | "other";

export interface Expense {
  id: string;
  client_id?: string | null;
  client_name?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  description: string;
  amount: number;
  expense_date: string;
  payment_method: PaymentMethod;
  status: ExpenseStatus;
  notes?: string | null;
  receipt_url?: string | null;
  created_at: string;
}

export interface CreateExpenseRequest {
  client_id?: string;
  project_id?: string;
  category_id?: string;
  description: string;
  amount: number;
  expense_date: string;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface UpdateExpenseRequest {
  client_id?: string;
  project_id?: string;
  category_id?: string;
  description?: string;
  amount?: number;
  expense_date?: string;
  payment_method?: PaymentMethod;
  status?: ExpenseStatus;
  notes?: string;
}

export interface ExpenseListResponse {
  items: Expense[];
  total: number;
  page: number;
  per_page: number;
}