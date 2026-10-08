
export interface Receipt {
  id: string;
  expense_id?: string | null;
  expense_description?: string | null;
  file_name: string;
  file_url?: string | null;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface ReceiptListResponse {
  items: Receipt[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreateReceiptRequest {
  file: File;
  expense_id?: string;
}