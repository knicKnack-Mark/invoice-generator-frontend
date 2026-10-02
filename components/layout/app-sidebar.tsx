"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  Clock3,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

const navigation = [
  {
    label: "WORKSPACE",
    items: [
      {
        name: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Clients",
        href: "/clients",
        icon: Users,
      },
      {
        name: "Projects",
        href: "/projects",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "FINANCE",
    items: [
      {
        name: "Invoices",
        href: "/invoices",
        icon: FileText,
      },
      {
        name: "Expenses",
        href: "/expenses",
        icon: Receipt,
      },
      {
        name: "Payments",
        href: "/payments",
        icon: WalletCards,
      },
    ],
  },
  {
    label: "TRACKING",
    items: [
      {
        name: "Time logs",
        href: "/time",
        icon: Clock3,
      },
      {
        name: "Reports",
        href: "/reports",
        icon: FileText,
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden h-screen w-[230px] shrink-0 border-r border-black/8 bg-[#f3f3f0] lg:flex lg:flex-col">
      <div className="flex h-20 items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#20201e] text-sm font-semibold text-white">
            I
          </div>

          <div>
            <p className="text-[14px] font-semibold tracking-[-0.02em]">
              Invoice
            </p>

            <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
              Tracker
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navigation.map((group) => (
          <div
            key={group.label}
            className="mb-7"
          >
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-black/35">
              {group.label}
            </p>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/dashboard";

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex h-9 items-center gap-3 rounded-md px-3 text-[13px] transition ${
                      active
                        ? "bg-white font-medium text-[#1d1d1b] shadow-sm ring-1 ring-black/5"
                        : "text-black/55 hover:bg-white/60 hover:text-black"
                    }`}
                  >
                    <Icon
                      className="h-[16px] w-[16px]"
                      strokeWidth={1.7}
                    />

                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-black/8 p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-black/55 hover:bg-white/60"
        >
          <Settings
            className="h-4 w-4"
            strokeWidth={1.7}
          />

          Settings
        </Link>

        <div className="mt-2 flex items-center gap-3 rounded-lg p-2">
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
        </div>
      </div>
    </aside>
  );
}