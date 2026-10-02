export type InvoiceStatus = "Paid" | "Due soon" | "Overdue";

export interface DashboardSummary {
  outstanding: {
    amount: number;
    count: number;
  };
  collected: {
    amount: number;
    change: number;
  };
  expenses: {
    amount: number;
    count: number;
  };
  drafts: {
    count: number;
    attention: number;
  };
}

export interface DashboardInvoice {
  id: string;
  number: string;
  client: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "payment" | "expense" | "invoice";
}

export interface DashboardReceivables {
  overdueAmount: number;
  overdueCount: number;
  outstandingAmount: number;
  percentage: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  invoices: DashboardInvoice[];
  receivables: DashboardReceivables;
  activity: DashboardActivity[];
}