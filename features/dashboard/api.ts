import type { DashboardData } from "./types";

export async function getDashboard(): Promise<DashboardData> {
  return {
    summary: {
      outstanding: {
        amount: 51750,
        count: 3,
      },
      collected: {
        amount: 81200,
        change: 12.4,
      },
      expenses: {
        amount: 14680,
        count: 18,
      },
      drafts: {
        count: 8,
        attention: 2,
      },
    },

    invoices: [
      {
        id: "1",
        number: "INV-2026-018",
        client: "Northstar Studio",
        date: "Oct 02, 2026",
        amount: 18400,
        status: "Due soon",
      },
      {
        id: "2",
        number: "INV-2026-017",
        client: "Morrow & Co.",
        date: "Sep 29, 2026",
        amount: 32750,
        status: "Paid",
      },
      {
        id: "3",
        number: "INV-2026-016",
        client: "Paper Street Media",
        date: "Sep 24, 2026",
        amount: 12600,
        status: "Overdue",
      },
      {
        id: "4",
        number: "INV-2026-015",
        client: "Haven Digital",
        date: "Sep 18, 2026",
        amount: 26900,
        status: "Paid",
      },
    ],

    receivables: {
      overdueAmount: 12600,
      overdueCount: 1,
      outstandingAmount: 51750,
      percentage: 31,
    },

    activity: [
      {
        id: "1",
        title: "Payment received",
        description: "Morrow & Co. paid INV-2026-017",
        time: "38 minutes ago",
        type: "payment",
      },
      {
        id: "2",
        title: "Expense added",
        description: "Adobe Creative Cloud · ₱1,249.00",
        time: "2 hours ago",
        type: "expense",
      },
      {
        id: "3",
        title: "Invoice sent",
        description: "INV-2026-018 sent to Northstar Studio",
        time: "Yesterday",
        type: "invoice",
      },
    ],
  };
}