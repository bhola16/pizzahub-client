"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Store,
  UserRound,
  UtensilsCrossed,
  Clock,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "@/lib/api/admin/dashboard-api";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard statistics.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      icon: Users,
      description: "All registered accounts",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Total Vendors",
      value: stats?.totalVendors,
      icon: Store,
      description: "Registered vendors",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers,
      icon: UserRound,
      description: "Registered customers",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      title: "Total Menu Items",
      value: stats?.totalMenuItems,
      icon: UtensilsCrossed,
      description: "All submitted menu items",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      title: "Pending Menu Items",
      value: stats?.pendingMenuItems,
      icon: Clock,
      description: "Waiting for approval",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
    },
    {
      title: "Total Transactions",
      value: stats?.totalTransactions,
      icon: CreditCard,
      description: "All payment records",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your PizzaHub platform at a glance.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>

                  {loading ? (
                    <div className="mt-3 h-9 w-20 animate-pulse rounded-lg bg-muted" />
                  ) : (
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                      {(card.value ?? 0).toLocaleString()}
                    </p>
                  )}
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
