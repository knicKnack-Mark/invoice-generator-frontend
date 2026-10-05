export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export interface Invoice {
  id: string;
  client_id: string;
  client_name: string;

  project_id?: string | null;
  project_name?: string | null;

  invoice_number: string;

  issue_date: string;
  due_date: string;

  subtotal: number;
  tax: number;
  total: number;

  status: InvoiceStatus;

  notes?: string | null;

  created_at: string;
}

export interface CreateInvoiceRequest {
  client_id: string;
  project_id?: string;

  invoice_number: string;

  issue_date: string;
  due_date: string;

  subtotal: number;
  tax?: number;

  notes?: string;
}

export interface UpdateInvoiceRequest {
  client_id?: string;
  project_id?: string;

  invoice_number?: string;

  issue_date?: string;
  due_date?: string;

  subtotal?: number;
  tax?: number;

  status?: InvoiceStatus;

  notes?: string;
}

export interface InvoiceListResponse {
  items: Invoice[];
  total: number;
  page: number;
  per_page: number;
}