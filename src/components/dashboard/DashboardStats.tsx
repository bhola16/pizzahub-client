import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface DashboardStat {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

interface DashboardStatsProps {
  stats: DashboardStat[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isUp = stat.trend?.direction === "up";

        return (
          <div
            key={`${stat.title}-${index}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-gray-800 dark:bg-[#211C19] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E87932]/10 text-[#E87932]">
                <Icon size={22} />
              </div>
            </div>

            {(stat.description || stat.trend) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                {stat.trend && (
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      isUp ? "text-green-600" : "text-red-500"
                    }`}>
                    {isUp ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {stat.trend.value}
                  </span>
                )}

                {stat.description && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
