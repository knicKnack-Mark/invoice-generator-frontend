import { apiClient } from "@/lib/api/client";

import type {
  CreatePaymentRequest,
  Payment,
  PaymentListResponse,
} from "./types";

export async function getPayments(
  page = 1,
  pageSize = 20,
  invoiceId?: string,
): Promise<PaymentListResponse> {
  const response = await apiClient.get<PaymentListResponse>(
    "/payments",
    {
      params: {
        page,
        page_size: pageSize,
        invoice_id: invoiceId || undefined,
      },
    },
  );

  return response.data;
}

export async function getPayment(
  paymentId: string,
): Promise<Payment> {
  const response = await apiClient.get<Payment>(
    `/payments/${paymentId}`,
  );

  return response.data;
}

export async function getInvoicePayments(
  invoiceId: string,
): Promise<Payment[]> {
  const response = await apiClient.get<Payment[]>(
    `/invoices/${invoiceId}/payments`,
  );

  return response.data;
}

export async function createPayment(
  invoiceId: string,
  payload: CreatePaymentRequest,
): Promise<Payment> {
  const response = await apiClient.post<Payment>(
    `/invoices/${invoiceId}/payments`,
    payload,
  );

  return response.data;
}

export async function deletePayment(
  paymentId: string,
): Promise<void> {
  await apiClient.delete(`/payments/${paymentId}`);
}