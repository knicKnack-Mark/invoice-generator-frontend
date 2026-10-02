import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1d1d1b]">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1">
          <AppHeader />

          {children}
        </main>
      </div>
    </div>
  );
}