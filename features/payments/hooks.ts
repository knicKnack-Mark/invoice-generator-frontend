"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPayment,
  deletePayment,
  getInvoicePayments,
  getPayment,
  getPayments,
} from "./api";

import type { CreatePaymentRequest } from "./types";

export function usePayments(
  page = 1,
  pageSize = 20,
  invoiceId?: string,
) {
  return useQuery({
    queryKey: ["payments", page, pageSize, invoiceId],
    queryFn: () => getPayments(page, pageSize, invoiceId),
  });
}

export function usePayment(paymentId?: string) {
  return useQuery({
    queryKey: ["payments", paymentId],
    queryFn: () => getPayment(paymentId!),
    enabled: Boolean(paymentId),
  });
}

export function useInvoicePayments(invoiceId?: string) {
  return useQuery({
    queryKey: ["invoice-payments", invoiceId],
    queryFn: () => getInvoicePayments(invoiceId!),
    enabled: Boolean(invoiceId),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      payload,
    }: {
      invoiceId: string;
      payload: CreatePaymentRequest;
    }) => createPayment(invoiceId, payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["payments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["invoice-payments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["invoices"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayment,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["payments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["invoice-payments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["invoices"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
}