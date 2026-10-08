"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createReceipt,
  deleteReceipt,
  getReceipt,
  getReceipts,
} from "./api";

import type { CreateReceiptRequest } from "./types";

export function useReceipts(
  page = 1,
  perPage = 20,
  search = "",
) {
  return useQuery({
    queryKey: ["receipts", page, perPage, search],
    queryFn: () => getReceipts(page, perPage, search),
  });
}

export function useReceipt(id?: string) {
  return useQuery({
    queryKey: ["receipts", id],
    queryFn: () => getReceipt(id!),
    enabled: Boolean(id),
  });
}

export function useCreateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReceiptRequest) =>
      createReceipt(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["receipts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
}

export function useDeleteReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReceipt,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["receipts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
}
