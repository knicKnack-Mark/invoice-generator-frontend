import type { ReactNode } from "react";

interface SummaryCardProps {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}

export function SummaryCard({
  label,
  value,
  detail,
  icon,
}: SummaryCardProps) {
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

      <p className="mt-1 text-[11px] text-black/40">
        {detail}
      </p>
    </div>
  );
}