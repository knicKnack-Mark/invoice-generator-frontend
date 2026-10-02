export function DashboardHeader() {
  return (
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
  );
}