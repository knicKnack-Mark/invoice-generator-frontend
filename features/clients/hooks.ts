"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  updateClient,
} from "./api";

import type {
  CreateClientRequest,
  UpdateClientRequest,
} from "./types";

export function useClients(
  page = 1,
  perPage = 20,
  search = "",
) {
  return useQuery({
    queryKey: ["clients", page, perPage, search],
    queryFn: () => getClients(page, perPage, search),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => getClient(id),
    enabled: Boolean(id),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientRequest) =>
      createClient(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClientRequest;
    }) => updateClient(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      queryClient.invalidateQueries({
        queryKey: ["clients", variables.id],
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
  });
}