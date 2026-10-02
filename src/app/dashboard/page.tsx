"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Clock3,
  FileText,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Receipt,
  Search,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

const navigation = [
  {
    label: "WORKSPACE",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Clients", href: "/clients", icon: Users },
      { name: "Projects", href: "/projects", icon: BriefcaseBusiness },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { name: "Invoices", href: "/invoices", icon: FileText },
      { name: "Expenses", href: "/expenses", icon: Receipt },
      { name: "Payments", href: "/payments", icon: WalletCards },
    ],
  },
  {
    label: "TRACKING",
    items: [
      { name: "Time logs", href: "/time", icon: Clock3 },
      { name: "Reports", href: "/reports", icon: ArrowUpRight },
    ],
  },
];

const invoices = [
  {
    number: "INV-2026-018",
    client: "Northstar Studio",
    date: "Oct 02, 2026",
    amount: "₱18,400.00",
    status: "Due soon",
  },
  {
    number: "INV-2026-017",
    client: "Morrow & Co.",
    date: "Sep 29, 2026",
    amount: "₱32,750.00",
    status: "Paid",
  },
  {
    number: "INV-2026-016",
    client: "Paper Street Media",
    date: "Sep 24, 2026",
    amount: "₱12,600.00",
    status: "Overdue",
  },
  {
    number: "INV-2026-015",
    client: "Haven Digital",
    date: "Sep 18, 2026",
    amount: "₱26,900.00",
    status: "Paid",
  },
];

const activity = [
  {
    title: "Payment received",
    description: "Morrow & Co. paid INV-2026-017",
    time: "38 minutes ago",
    type: "payment",
  },
  {
    title: "Expense added",
    description: "Adobe Creative Cloud · ₱1,249.00",
    time: "2 hours ago",
    type: "expense",
  },
  {
    title: "Invoice sent",
    description: "INV-2026-018 sent to Northstar Studio",
    time: "Yesterday",
    type: "invoice",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1d1d1b]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[230px] shrink-0 border-r border-black/8 bg-[#f3f3f0] lg:flex lg:flex-col">
          <div className="flex h-20 items-center px-6">
            <Link href="/dashboard" className="flex items-center gap-3">
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
              <div key={group.label} className="mb-7">
                <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-black/35">
                  {group.label}
                </p>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === "/dashboard";

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
                        <Icon className="h-[16px] w-[16px]" strokeWidth={1.7} />
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
              <Settings className="h-4 w-4" strokeWidth={1.7} />
              Settings
            </Link>

            <div className="mt-2 flex items-center gap-3 rounded-lg p-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9d7cf] text-xs font-semibold">
                MN
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">Mark Neil</p>
                <p className="truncate text-[10px] text-black/40">
                  Personal workspace
                </p>
              </div>

              <ChevronDown className="h-3.5 w-3.5 text-black/30" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Header */}
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
                <span className="text-black/75">Overview</span>
              </div>

              <span className="text-sm font-medium sm:hidden">Overview</span>
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
                <Bell className="h-[17px] w-[17px]" strokeWidth={1.7} />
              </button>

              <Link
                href="/invoices/new"
                className="flex h-9 items-center gap-2 rounded-md bg-[#20201e] px-3 text-xs font-medium text-white transition hover:bg-black"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New invoice</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
            {/* Intro */}
            <section className="mb-8">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-black/35">
                Thursday · October 02, 2026
              </p>

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="text-[30px] font-semibold tracking-[-0.035em]">
                    Good evening, Mark.
                  </h1>

                  <p className="mt-1 text-sm text-black/45">
                    Here&apos;s what needs your attention.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-black/35">
                    This month
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    October · 2026
                  </p>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Outstanding"
                value="₱51,750"
                detail="3 invoices"
                icon={<ArrowUpRight className="h-4 w-4" />}
              />

              <SummaryCard
                label="Collected"
                value="₱81,200"
                detail="+12.4% from last month"
                icon={<ArrowDownRight className="h-4 w-4" />}
              />

              <SummaryCard
                label="Expenses"
                value="₱14,680"
                detail="18 transactions"
                icon={<Receipt className="h-4 w-4" />}
              />

              <SummaryCard
                label="Draft invoices"
                value="8"
                detail="2 need attention"
                icon={<FileText className="h-4 w-4" />}
              />
            </section>

            {/* Content grid */}
            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
              {/* Invoices */}
              <section>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">
                      Invoices
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
                      Recent invoices
                    </h2>
                  </div>

                  <Link
                    href="/invoices"
                    className="text-xs font-medium text-black/45 hover:text-black"
                  >
                    View all →
                  </Link>
                </div>

                <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
                  <div className="hidden grid-cols-[1.2fr_1fr_120px_120px_32px] border-b border-black/8 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/35 sm:grid">
                    <span>Invoice</span>
                    <span>Client</span>
                    <span>Date</span>
                    <span className="text-right">Amount</span>
                    <span />
                  </div>

                  {invoices.map((invoice) => (
                    <Link
                      href={`/invoices/${invoice.number}`}
                      key={invoice.number}
                      className="group grid gap-2 border-b border-black/6 px-5 py-4 last:border-0 hover:bg-[#fafaf8] sm:grid-cols-[1.2fr_1fr_120px_120px_32px] sm:items-center sm:gap-0"
                    >
                      <div>
                        <p className="text-[13px] font-medium">
                          {invoice.number}
                        </p>
                        <p className="mt-0.5 text-xs text-black/40 sm:hidden">
                          {invoice.client}
                        </p>
                      </div>

                      <p className="hidden text-xs text-black/55 sm:block">
                        {invoice.client}
                      </p>

                      <p className="text-xs text-black/40">{invoice.date}</p>

                      <p className="text-sm font-medium sm:text-right">
                        {invoice.amount}
                      </p>

                      <div className="flex items-center justify-between sm:justify-end">
                        <Status status={invoice.status} />
                        <MoreHorizontal className="ml-3 hidden h-4 w-4 text-black/25 group-hover:block" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Right column */}
              <div className="space-y-8">
                {/* Outstanding */}
                <section>
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">
                      Receivables
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
                      Needs attention
                    </h2>
                  </div>

                  <div className="rounded-lg border border-black/10 bg-white p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-black/40">Overdue</p>
                        <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                          ₱12,600
                        </p>
                      </div>

                      <span className="rounded-full bg-[#f3e5df] px-2.5 py-1 text-[10px] font-medium text-[#8b4e3b]">
                        1 invoice
                      </span>
                    </div>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/6">
                      <div className="h-full w-[31%] rounded-full bg-[#9a604c]" />
                    </div>

                    <div className="mt-2 flex justify-between text-[10px] text-black/35">
                      <span>31% of outstanding</span>
                      <span>₱51,750 total</span>
                    </div>
                  </div>
                </section>

                {/* Activity */}
                <section>
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">
                        Timeline
                      </p>
                      <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
                        Recent activity
                      </h2>
                    </div>

                    <Link
                      href="/activity"
                      className="text-xs font-medium text-black/45 hover:text-black"
                    >
                      All →
                    </Link>
                  </div>

                  <div className="rounded-lg border border-black/10 bg-white">
                    {activity.map((item, index) => (
                      <div
                        key={item.title}
                        className={`flex gap-3 px-5 py-4 ${
                          index !== activity.length - 1
                            ? "border-b border-black/6"
                            : ""
                        }`}
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1f1ed]">
                          {item.type === "payment" ? (
                            <WalletCards
                              className="h-3.5 w-3.5 text-black/50"
                              strokeWidth={1.7}
                            />
                          ) : item.type === "expense" ? (
                            <Receipt
                              className="h-3.5 w-3.5 text-black/50"
                              strokeWidth={1.7}
                            />
                          ) : (
                            <FileText
                              className="h-3.5 w-3.5 text-black/50"
                              strokeWidth={1.7}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium">{item.title}</p>
                          <p className="mt-0.5 text-[11px] leading-5 text-black/40">
                            {item.description}
                          </p>
                          <p className="mt-1 text-[10px] text-black/25">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/35">
          {label}
        </p>

        <span className="text-black/25">{icon}</span>
      </div>

      <p className="mt-4 text-[24px] font-semibold tracking-[-0.035em]">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-black/40">{detail}</p>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const styles = {
    Paid: "bg-[#e6eee8] text-[#42604c]",
    "Due soon": "bg-[#eee9d9] text-[#756437]",
    Overdue: "bg-[#f3e5df] text-[#8b4e3b]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}