"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClients } from "@/features/clients/hooks";

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useClients(
    1,
    20,
    search,
  );

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
              Workspace
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Clients
            </h1>

            <p className="mt-1 text-sm text-black/50">
              Manage the people and businesses you invoice.
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New client
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search clients..."
            className="pl-9"
          />
        </div>

        {/* Content */}
        <div className="rounded-xl border border-black/8 bg-white">
          {isLoading && (
            <div className="p-8 text-sm text-black/50">
              Loading clients...
            </div>
          )}

          {isError && (
            <div className="p-8 text-sm text-destructive">
              Unable to load clients.
            </div>
          )}

          {!isLoading &&
            !isError &&
            data?.items.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                <h2 className="text-sm font-medium">
                  No clients yet
                </h2>

                <p className="mt-1 max-w-sm text-sm text-black/45">
                  Add your first client to start tracking
                  invoices, payments, and projects.
                </p>

                <Button className="mt-5">
                  <Plus className="mr-2 h-4 w-4" />
                  Add client
                </Button>
              </div>
            )}

          {!isLoading &&
            !isError &&
            data &&
            data.items.length > 0 && (
              <div className="divide-y divide-black/8">
                {data.items.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-5"
                  >
                    <div>
                      <p className="font-medium">
                        {client.name}
                      </p>

                      <p className="mt-1 text-sm text-black/45">
                        {client.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm">
                        {client.company || "—"}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        {client.is_active
                          ? "Active"
                          : "Inactive"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}