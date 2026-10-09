export const PAYMENT_METHODS = [
  "Bank Transfer",
  "PayPal",
  "Wise",
  "Stripe",
  "Cash",
  "GCash",
  "Other",
] as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[number];

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number | string;
  currency: string;
  payment_date: string;
  payment_method: PaymentMethod;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  payment_date: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}

export interface PaymentListResponse {
  success: boolean;
  data: Payment[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}