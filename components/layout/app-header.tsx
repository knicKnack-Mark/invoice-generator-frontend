import Link from "next/link";
import { Bell, Plus, Search } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-black/8 bg-[#f7f7f5] px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#20201e] text-sm font-semibold text-white">
            I
          </div>
        </div>

        <div className="hidden items-center gap-2 text-sm text-black/45 sm:flex">
          <span>Workspace</span>
          <span>/</span>
          <span className="text-black/75">
            Overview
          </span>
        </div>

        <span className="text-sm font-medium sm:hidden">
          Overview
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="hidden h-9 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-xs text-black/55 shadow-sm transition hover:border-black/20 hover:text-black sm:flex"
        >
          <Search className="h-3.5 w-3.5" />
          Search

          <span className="ml-2 rounded border border-black/10 px-1.5 py-0.5 text-[9px]">
            /
          </span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-md text-black/50 transition hover:bg-white hover:text-black"
        >
          <Bell
            className="h-[17px] w-[17px]"
            strokeWidth={1.7}
          />
        </button>

        <Link
          href="/invoices/new"
          className="flex h-9 items-center gap-2 rounded-md bg-[#20201e] px-3 text-xs font-medium text-white transition hover:bg-black"
        >
          <Plus className="h-3.5 w-3.5" />

          <span className="hidden sm:inline">
            New invoice
          </span>

          <span className="sm:hidden">
            New
          </span>
        </Link>
      </div>
    </header>
  );
}