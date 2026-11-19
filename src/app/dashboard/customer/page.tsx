
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import {
  getCustomerDashboard,
  type CustomerDashboardData,
} from "@/lib/api/customer/dashboard-api";

export default function CustomerDashboardPage() {
  const { data: session, isPending } = useSession();
  const customerEmail = session?.user?.email;

  const [dashboard, setDashboard] =
    useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!customerEmail) return;

    try {
      setLoading(true);

      const data = await getCustomerDashboard(customerEmail);
      setDashboard(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [customerEmail]);

  useEffect(() => {
    if (customerEmail) {
      fetchDashboard();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [customerEmail, isPending, fetchDashboard]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!customerEmail) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  const statistics = [
    {
      title: "Total Orders",
      value: dashboard?.totalOrders ?? 0,
      description: "All your placed orders",
      icon: ShoppingBag,
      iconClass:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    },
    {
      title: "Pending Orders",
      value: dashboard?.pendingOrders ?? 0,
      description: "Waiting for confirmation",
      icon: Clock3,
      iconClass:
        "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    },
    {
      title: "Accepted Orders",
      value: dashboard?.acceptedOrders ?? 0,
      description: "Orders accepted",
      icon: CheckCircle2,
      iconClass:
        "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
    },
    {
      title: "Rejected Orders",
      value: dashboard?.rejectedOrders ?? 0,
      description: "Orders not accepted",
      icon: XCircle,
      iconClass:
        "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
    },
  ];

  const totalOrders = dashboard?.totalOrders ?? 0;

  const orderBreakdown = [
    {
      label: "Pending",
      count: dashboard?.pendingOrders ?? 0,
      color: "bg-amber-500",
    },
    {
      label: "Accepted",
      count: dashboard?.acceptedOrders ?? 0,
      color: "bg-green-500",
    },
    {
      label: "Rejected",
      count: dashboard?.rejectedOrders ?? 0,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
            <TrendingUp className="h-4 w-4" />
            Customer Dashboard
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Overview
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track your orders and stay updated on their status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboard}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {stat.value}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Order Summary
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A breakdown of your order statuses.
          </p>
        </div>

        <div className="space-y-6">
          {orderBreakdown.map((item) => {
            const percentage =
              totalOrders > 0
                ? (item.count / totalOrders) * 100
                : 0;

            return (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>

                  <span className="text-muted-foreground">
                    {item.count} ({Math.round(percentage)}%)
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {totalOrders === 0 && (
          <div className="mt-6 rounded-xl bg-muted/50 p-6 text-center">
            <ShoppingBag className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">
              No orders yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your order statistics will appear here when you place your first order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
