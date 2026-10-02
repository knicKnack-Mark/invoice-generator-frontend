"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/60"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9d7cf] text-xs font-semibold">
          MN
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">
            Mark Neil
          </p>

          <p className="truncate text-[10px] text-black/40">
            Personal workspace
          </p>
        </div>

        <ChevronDown className="h-3.5 w-3.5 text-black/30" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg border border-black/10 bg-white p-1 shadow-lg">
          <button className="w-full rounded-md px-3 py-2 text-left text-xs hover:bg-black/5">
            Profile
          </button>

          <button className="w-full rounded-md px-3 py-2 text-left text-xs hover:bg-black/5">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}