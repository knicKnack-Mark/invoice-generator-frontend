"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from "./api";
import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from "./types";

export function useExpenses(
  page = 1,
  perPage = 20,
  search = "",
) {
  return useQuery({
    queryKey: ["expenses", page, perPage, search],
    queryFn: () => getExpenses(page, perPage, search),
  });
}

export function useExpense(id?: string) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => getExpense(id!),
    enabled: Boolean(id),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpenseRequest) =>
      createExpense(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExpenseRequest;
    }) => updateExpense(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.id],
      });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
}