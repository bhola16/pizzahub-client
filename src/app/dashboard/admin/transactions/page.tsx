"use client";

import {
  AdminTransaction,
  getAdminTransactions,
} from "@/lib/api/admin/transactions-api";
import {
  ArrowDownUp,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Loader2,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const formatDate = (date: string) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.toUpperCase() || "USD",
  }).format(amount || 0);
};

const getPaymentStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return {
        label: "Paid",
        className:
          "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
        icon: CheckCircle2,
      };

    case "unpaid":
      return {
        label: "Unpaid",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
        icon: Clock3,
      };

    case "no_payment_required":
      return {
        label: "No Payment Required",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        icon: CheckCircle2,
      };

    default:
      return {
        label: status || "Unknown",
        className:
          "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        icon: XCircle,
      };
  }
};

const AdminTransactionsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [planFilter, setPlanFilter] = useState(
    searchParams.get("plan") || "all",
  );
  const [paymentFilter, setPaymentFilter] = useState(
    searchParams.get("paymentStatus") || "all",
  );

  // Sync filters when URL changes (Back / Forward)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setPlanFilter(searchParams.get("plan") || "all");
    setPaymentFilter(searchParams.get("paymentStatus") || "all");
  }, [searchParams]);

  // Update URL search parameters
  const updateURLParams = useCallback(
    (search: string, plan: string, paymentStatus: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      if (plan !== "all") {
        params.set("plan", plan);
      } else {
        params.delete("plan");
      }

      if (paymentStatus !== "all") {
        params.set("paymentStatus", paymentStatus);
      } else {
        params.delete("paymentStatus");
      }

      const queryString = params.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateURLParams(value, planFilter, paymentFilter);
  };

  const handlePlanFilter = (value: string) => {
    setPlanFilter(value);
    updateURLParams(searchTerm, value, paymentFilter);
  };

  const handlePaymentFilter = (value: string) => {
    setPaymentFilter(value);
    updateURLParams(searchTerm, planFilter, value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPlanFilter("all");
    setPaymentFilter("all");
    router.replace(pathname, { scroll: false });
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAdminTransactions(
        searchTerm,
        planFilter,
        paymentFilter,
      );

      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load transactions.",
      );
    } finally {
      setLoading(false);
    }
  }, [searchTerm, planFilter, paymentFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTransactions();
    }, 350);

    return () => clearTimeout(timeout);
  }, [fetchTransactions]);

  const statistics = useMemo(() => {
    const paidTransactions = transactions.filter(
      (transaction) => transaction.payment_status?.toLowerCase() === "paid",
    );

    const pendingTransactions = transactions.filter(
      (transaction) => transaction.payment_status?.toLowerCase() === "unpaid",
    );

    const totalRevenue = paidTransactions.reduce(
      (total, transaction) => total + (transaction.amount || 0),
      0,
    );

    return {
      total: transactions.length,
      paid: paidTransactions.length,
      pending: pendingTransactions.length,
      revenue: totalRevenue,
    };
  }, [transactions]);

  const handleRefresh = async () => {
    try {
      setLoading(true);

      const data = await getAdminTransactions(
        searchTerm,
        planFilter,
        paymentFilter,
      );

      setTransactions(data);
    } catch (error) {
      console.error("Failed to refresh transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasFilters =
    searchTerm.trim() !== "" || planFilter !== "all" || paymentFilter !== "all";

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/dashboard/admin"
            className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-orange-500">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View and monitor all vendor subscription payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            Read-only records
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-500/10">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              All records
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">
            {statistics.total}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Total Transactions
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-green-100 p-3 dark:bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              Successful
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">
            {statistics.paid}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Paid Transactions
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-yellow-100 p-3 dark:bg-yellow-500/10">
              <Clock3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
              Awaiting payment
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">
            {statistics.pending}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pending Transactions
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-500/10">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Paid only
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">
            {statistics.revenue.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Paid Amount (mixed currencies)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search vendor email or transaction ID..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => handlePlanFilter(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => handlePaymentFilter(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="no_payment_required">No Payment Required</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <div className="mt-4 flex justify-end border-t border-border pt-3">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive">
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Payment History</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowDownUp className="h-4 w-4" />
            Newest first
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">Vendor</th>
                <th className="px-5 py-4 font-semibold">Plan</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Payment Status</th>
                <th className="px-5 py-4 font-semibold">Checkout Status</th>
                <th className="px-5 py-4 font-semibold">Transaction ID</th>
                <th className="px-5 py-4 font-semibold">Transaction Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Loading transactions...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-muted p-4">
                        <CreditCard className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <p className="font-semibold text-foreground">
                        No transactions found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const paymentStatus = getPaymentStatus(
                    transaction.payment_status,
                  );
                  const StatusIcon = paymentStatus.icon;

                  return (
                    <tr
                      key={transaction._id}
                      className="transition hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-foreground">
                            {transaction.vendorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {transaction.customer_email}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold capitalize ${
                            transaction.plan?.toLowerCase() === "premium"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
                              : "bg-muted text-muted-foreground"
                          }`}>
                          {transaction.plan}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-foreground">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${paymentStatus.className}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {paymentStatus.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
                          {transaction.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          title={transaction.payment_intent}
                          className="block max-w-[170px] truncate font-mono text-xs text-muted-foreground">
                          {transaction.payment_intent || "N/A"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(transaction.payment_date)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </p>
          <span className="text-xs font-medium text-muted-foreground">
            <CreditCard className="mr-1 inline h-3.5 w-3.5" />
            View only
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
