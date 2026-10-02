import Link from "next/link";
import {
  FileText,
  Receipt,
  WalletCards,
} from "lucide-react";

import type { DashboardActivity } from "@/features/dashboard/types";

interface ActivityFeedProps {
  activities: DashboardActivity[];
}

export function ActivityFeed({
  activities,
}: ActivityFeedProps) {
  return (
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
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex gap-3 px-5 py-4 ${
              index !== activities.length - 1
                ? "border-b border-black/6"
                : ""
            }`}
          >
            <ActivityIcon type={activity.type} />

            <div className="min-w-0">
              <p className="text-xs font-medium">
                {activity.title}
              </p>

              <p className="mt-0.5 text-[11px] leading-5 text-black/40">
                {activity.description}
              </p>

              <p className="mt-1 text-[10px] text-black/25">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityIcon({
  type,
}: {
  type: DashboardActivity["type"];
}) {
  const Icon =
    type === "payment"
      ? WalletCards
      : type === "expense"
        ? Receipt
        : FileText;

  return (
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1f1ed]">
      <Icon
        className="h-3.5 w-3.5 text-black/50"
        strokeWidth={1.7}
      />
    </div>
  );
}