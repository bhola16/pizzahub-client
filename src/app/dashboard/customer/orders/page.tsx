"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  MessageSquare,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  cancelCustomerOrder,
  getCustomerOrders,
  type Order,
} from "@/lib/api/orders";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteRejectedCustomerOrder } from "@/lib/api/customer/dashboard-api";

type OrderFilter = "all" | "pending" | "accepted" | "rejected";

const formatDate = (date: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Order Status Timeline
function OrderStatusTimeline({ order }: { order: Order }) {
  const isPending = order.status === "pending";
  const isAccepted = order.status === "accepted";
  const isRejected = order.status === "rejected";
  const isCancelled = order.status === "cancelled";

  const isFinal = isAccepted || isRejected || isCancelled;

  const finalTitle = isAccepted
    ? "Order Accepted"
    : isRejected
      ? "Order Rejected"
      : "Order Cancelled";

  const finalDescription = isAccepted
    ? "The vendor has accepted your order."
    : isRejected
      ? "The vendor has rejected your order."
      : "This order has been cancelled.";

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
          <Package size={18} />
        </div>

        <div>
          <h4 className="font-bold text-foreground">
            Order Status Timeline
          </h4>
          <p className="text-xs text-muted-foreground">
            Follow your order progress
          </p>
        </div>
      </div>

      <div className="space-y-0">
        {/* Order Placed */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
              <CheckCircle size={19} />
            </div>

            <div className="my-1 min-h-10 w-0.5 bg-green-300 dark:bg-green-800" />
          </div>

          <div className="pb-5">
            <p className="font-semibold text-foreground">
              Order Placed
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your order request was submitted successfully.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>

            <span className="mt-2 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400">
              Completed
            </span>
          </div>
        </div>

        {/* Current / Final Status */}
        <div className="flex gap-3">
          <div className="flex shrink-0 flex-col items-center">
            <div
              className={`flex size-9 items-center justify-center rounded-full ${
                isRejected || isCancelled
                  ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                  : isAccepted
                    ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"
                    : "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
              }`}
            >
              {isRejected || isCancelled ? (
                <XCircle size={19} />
              ) : isAccepted ? (
                <CheckCircle size={19} />
              ) : (
                <Clock size={19} />
              )}
            </div>
          </div>

          <div className="pb-1">
            <p className="font-semibold text-foreground">
              {isPending ? "Waiting for Vendor" : finalTitle}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {isPending
                ? "The vendor has not responded to your order yet."
                : finalDescription}
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                isPending
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                  : isRejected || isCancelled
                    ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                    : "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
              }`}
            >
              {isPending ? "Current status" : "Completed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | { name?: string; email?: string; role?: string }
    | undefined;

  const userEmail = user?.email;
  const userRole = user?.role;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");

  // Fetch customer orders
  const fetchOrders = useCallback(async () => {
    if (!userEmail) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getCustomerOrders(userEmail);
      setOrders(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!isPending) {
      if (userRole === "customer" && userEmail) {
        fetchOrders();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, userRole, userEmail, fetchOrders]);

  // Withdraw pending order
  const handleWithdraw = async (order: Order) => {
    if (
      order.status !== "pending" ||
      !userEmail ||
      order.customerEmail.toLowerCase() !== userEmail.toLowerCase()
    ) {
      return;
    }

    try {
      setWithdrawingId(order.id);

      await cancelCustomerOrder(order.id, userEmail);

      setOrders((previousOrders) =>
        previousOrders.filter((item) => item.id !== order.id)
      );

      setExpandedOrderId(null);
      toast.success("Your order has been withdrawn successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to withdraw order."
      );

      await fetchOrders();
    } finally {
      setWithdrawingId(null);
    }
  };

  // Permanently delete rejected order
  const handleDeleteRejectedOrder = async (order: Order) => {
    if (
      order.status !== "rejected" ||
      !userEmail ||
      order.customerEmail.toLowerCase() !== userEmail.toLowerCase()
    ) {
      return;
    }

    try {
      setDeletingId(order.id);

      await deleteRejectedCustomerOrder(order.id, userEmail);

      setOrders((previousOrders) =>
        previousOrders.filter((item) => item.id !== order.id)
      );

      setExpandedOrderId(null);
      toast.success("Rejected order deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete order."
      );

      await fetchOrders();
    } finally {
      setDeletingId(null);
    }
  };

  // Expand or collapse order details
  const toggleDetails = (orderId: string) => {
    setExpandedOrderId((current) =>
      current === orderId ? null : orderId
    );
  };

  // Filter configuration
  const filters: { label: string; value: OrderFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
  ];

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const getFilterCount = (filter: OrderFilter) =>
    filter === "all"
      ? orders.length
      : orders.filter((order) => order.status === filter).length;

  // Order status styles
  const statusStyles: Record<Order["status"], string> = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    accepted:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    rejected:
      "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    cancelled:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
  };

  // Loading state
  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F3] dark:bg-[#171412]">
        <RefreshCw className="animate-spin text-orange-500" size={30} />
      </main>
    );
  }

  // Customer access validation
  if (!user || userRole !== "customer") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFF9F3] px-4 text-center dark:bg-[#171412]">
        <ShoppingBag size={45} className="text-orange-500" />

        <h1 className="text-2xl font-bold text-foreground">
          Customer Access Only
        </h1>

        <p className="text-muted-foreground">
          Please sign in with a customer account to view your orders.
        </p>

        <Link
          href="/menu"
          className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F3] text-[#30231D] dark:bg-[#171412] dark:text-white">
      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-7 lg:px-6">
        {/* Page Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/customer"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-orange-500"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                View your orders and track their delivery status.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-5 py-14 text-center shadow-sm sm:px-6">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-500 dark:from-orange-500/20 dark:to-amber-500/10">
              <ShoppingBag size={30} />
            </div>

            <h2 className="text-lg font-bold">No Orders Yet</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              You haven&apos;t placed any orders yet. Explore our menu and
              discover something delicious!
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md"
            >
              <ShoppingBag size={16} />
              Explore Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Order Filters */}
            <div className="mb-5 flex flex-wrap gap-2">
              {filters.map((filter) => {
                const count = getFilterCount(filter.value);
                const isActive = activeFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                      isActive
                        ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10"
                    }`}
                  >
                    {filter.label}

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filtered Orders */}
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card px-5 py-14 text-center shadow-sm sm:px-6">
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-500 dark:from-orange-500/20 dark:to-amber-500/10">
                  <ShoppingBag size={30} />
                </div>

                <h3 className="text-lg font-bold">
                  No {activeFilter} Orders Found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  You don&apos;t have any {activeFilter} orders at the moment.
                  Your orders will appear here when their status changes.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md"
                >
                  <ShoppingBag size={16} />
                  View All Orders
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const isWithdrawing = withdrawingId === order.id;
                  const isDeleting = deletingId === order.id;

                  return (
                    <article
                      key={order.id}
                      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-4 sm:px-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock size={16} />
                          <span>
                            Requested on {formatDate(order.createdAt)}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Main Order Information */}
                      <div className="grid gap-4 p-4 sm:grid-cols-[140px_1fr] sm:gap-5 sm:p-5 lg:grid-cols-[160px_1fr]">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted sm:aspect-square">
                          <Image
                            src={order.itemImage || "/placeholder-pizza.jpg"}
                            alt={order.itemName}
                            fill
                            sizes="(max-width: 640px) 100vw, 160px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex min-w-0 flex-col justify-between gap-5">
                          <div>
                            <h2 className="text-xl font-bold">
                              {order.itemName}
                            </h2>

                            <p className="mt-1 text-lg font-bold text-orange-500">
                              ৳{order.price}
                            </p>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                              {/* Vendor */}
                              <div className="flex min-w-0 items-start gap-2">
                                <Store
                                  size={17}
                                  className="mt-0.5 shrink-0 text-orange-500"
                                />

                                <div className="min-w-0">
                                  <p className="text-xs text-muted-foreground">
                                    Vendor
                                  </p>

                                  <p className="break-words font-semibold">
                                    {order.vendorName}
                                  </p>
                                </div>
                              </div>

                              {/* Delivery Date */}
                              <div className="flex items-start gap-2">
                                <CalendarDays
                                  size={17}
                                  className="mt-0.5 shrink-0 text-orange-500"
                                />

                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Delivery Date
                                  </p>

                                  <p className="font-semibold">
                                    {formatDate(order.deliveryDate)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4 sm:gap-3">
                            <button
                              type="button"
                              onClick={() => toggleDetails(order.id)}
                              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold transition hover:bg-muted sm:px-4"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp size={16} />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={16} />
                                  View Order Details
                                </>
                              )}
                            </button>

                            {/* Withdraw Pending Order */}
                            {order.status === "pending" && (
                              <AlertDialog>
                                <AlertDialogTrigger
                                  render={
                                    <button
                                      type="button"
                                      disabled={isWithdrawing}
                                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:hover:bg-red-500/10 sm:px-4"
                                    >
                                      {isWithdrawing ? (
                                        <RefreshCw
                                          size={16}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <XCircle size={16} />
                                      )}
                                      Withdraw Order
                                    </button>
                                  }
                                />

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Withdraw this order?
                                    </AlertDialogTitle>

                                    <AlertDialogDescription>
                                      Are you sure you want to withdraw your
                                      order for {order.itemName}? This action
                                      cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Keep Order
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                      disabled={isWithdrawing}
                                      onClick={(event) => {
                                        event.preventDefault();
                                        handleWithdraw(order);
                                      }}
                                      className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                      {isWithdrawing
                                        ? "Withdrawing..."
                                        : "Yes, Withdraw"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {/* Delete Rejected Order */}
                            {order.status === "rejected" && (
                              <>
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                  This order was rejected by the vendor.
                                </span>

                                <AlertDialog>
                                  <AlertDialogTrigger
                                    render={
                                      <button
                                        type="button"
                                        disabled={isDeleting}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:hover:bg-red-500/10 sm:px-4"
                                      >
                                        {isDeleting ? (
                                          <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                          />
                                        ) : (
                                          <XCircle size={16} />
                                        )}
                                        Delete the Order
                                      </button>
                                    }
                                  />

                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete this rejected order?
                                      </AlertDialogTitle>

                                      <AlertDialogDescription>
                                        Are you sure you want to permanently
                                        delete your rejected order for{" "}
                                        {order.itemName}? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Keep Order
                                      </AlertDialogCancel>

                                      <AlertDialogAction
                                        disabled={isDeleting}
                                        onClick={(event) => {
                                          event.preventDefault();
                                          handleDeleteRejectedOrder(order);
                                        }}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                      >
                                        {isDeleting
                                          ? "Deleting..."
                                          : "Yes, Delete"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}

                            {/* Accepted Order */}
                            {order.status === "accepted" && (
                              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950/30">
                                <CheckCircle
                                  size={17}
                                  className="shrink-0 text-green-600 dark:text-green-400"
                                />

                                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                  Your order has been accepted.
                                </span>
                              </div>
                            )}

                            {/* Cancelled Order */}
                            {order.status === "cancelled" && (
                              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/40">
                                <XCircle
                                  size={17}
                                  className="shrink-0 text-gray-500"
                                />

                                <span className="text-sm font-medium text-muted-foreground">
                                  This order has been cancelled.
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Order Details */}
                      {isExpanded && (
                        <div className="border-t border-border bg-muted/20 p-4 sm:p-6">
                          {/* Order Details Heading */}
                          <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-bold">
                                Order Details
                              </h3>

                              <p className="mt-1 text-sm text-muted-foreground">
                                Complete information about your order
                              </p>
                            </div>

                            <Package
                              className="shrink-0 text-orange-500"
                              size={22}
                            />
                          </div>

                          {/* Status Timeline */}
                          <div className="mb-5">
                            <OrderStatusTimeline order={order} />
                          </div>

                          {/* Details Grid */}
                          <div className="grid gap-4 sm:grid-cols-2">
                            {/* Vendor Information */}
                            <div className="rounded-xl border border-border bg-card p-4">
                              <div className="mb-3 flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                                  <Store size={18} />
                                </div>

                                <h4 className="font-semibold">
                                  Vendor Information
                                </h4>
                              </div>

                              <p className="break-words font-medium">
                                {order.vendorName}
                              </p>

                              <p className="mt-1 break-all text-sm text-muted-foreground">
                                {order.vendorEmail}
                              </p>
                            </div>

                            {/* Delivery Date */}
                            <div className="rounded-xl border border-border bg-card p-4">
                              <div className="mb-3 flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                                  <CalendarDays size={18} />
                                </div>

                                <h4 className="font-semibold">
                                  Delivery Date
                                </h4>
                              </div>

                              <p className="font-medium">
                                {formatDate(order.deliveryDate)}
                              </p>

                              <p className="mt-1 text-sm text-muted-foreground">
                                Scheduled delivery
                              </p>
                            </div>

                            {/* Delivery Address */}
                            <div className="rounded-xl border border-border bg-card p-4 sm:col-span-2">
                              <div className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                                  <MapPin size={18} />
                                </div>

                                <div className="min-w-0">
                                  <h4 className="font-semibold">
                                    Delivery Address
                                  </h4>

                                  <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
                                    {order.deliveryAddress}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Customer Message */}
                            {order.customerMessage && (
                              <div className="rounded-xl border border-border bg-card p-4 sm:col-span-2">
                                <div className="flex items-start gap-3">
                                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                                    <MessageSquare size={18} />
                                  </div>

                                  <div className="min-w-0">
                                    <h4 className="font-semibold">
                                      Your Message
                                    </h4>

                                    <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
                                      {order.customerMessage}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Request Information */}
                          <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Clock size={18} />
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Request Date
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="mb-1 text-xs text-muted-foreground">
                                Order Status
                              </p>

                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
