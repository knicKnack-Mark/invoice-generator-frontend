import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[#f7f7f5] text-[#1d1d1b]">
      <div className="flex h-full">
        <AppSidebar />

        <main className="flex min-w-0 flex-1 flex-col">
          <AppHeader />

          <div className="min-h-0 flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}