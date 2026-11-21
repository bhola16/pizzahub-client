"use client";

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
import { Button } from "@/components/ui/button";
import {
  deleteAdminMenuItem,
  getAdminMenuItems,
  reviewAdminMenuItem,
  updateAdminMenuItemAvailability,
  type AdminMenuItem,
} from "@/lib/api/admin/manageMenuItems-api";
import { useSession } from "@/lib/auth-client";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

const AdminManageMenuItemsContent = () => {
  const { data: session, isPending: sessionLoading } = useSession();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const user = session?.user as { role?: string } | undefined;

  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const requestId = useRef(0);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstLoad = useRef(true);

  // Keep filters synchronized with browser Back/Forward navigation
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "all");
    setStatus(searchParams.get("status") || "all");
  }, [searchParams]);

  // Update URL without navigating or refreshing the page
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category !== "all") {
        params.set("category", category);
      }

      if (status !== "all") {
        params.set("status", status);
      }

      const query = params.toString();
      const newUrl = query ? `${pathname}?${query}` : pathname;

      const currentUrl = window.location.pathname + window.location.search;

      if (currentUrl !== newUrl) {
        window.history.replaceState(null, "", newUrl);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, status, pathname]);

  // Fetch menu items
  const fetchItems = useCallback(
    async (showRefresh = false) => {
      const currentRequest = ++requestId.current;

      if (showRefresh) {
        setRefreshing(true);
      } else if (firstLoad.current) {
        setLoading(true);
      }

      try {
        const data = await getAdminMenuItems(search, category, status);

        if (currentRequest === requestId.current) {
          setItems(data);
        }
      } catch (error) {
        if (currentRequest === requestId.current) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to fetch menu items.",
          );
        }
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
          setRefreshing(false);
          firstLoad.current = false;
        }
      }
    },
    [search, category, status],
  );

  // Debounced search and filter requests
  useEffect(() => {
    if (sessionLoading || user?.role !== "admin") return;

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      fetchItems();
    }, 350);

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [fetchItems, sessionLoading, user?.role]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

  const hasActiveFilters =
    search.trim() !== "" || category !== "all" || status !== "all";

  // Approve or reject
  const handleReview = async (
    id: string,
    newStatus: "approved" | "rejected",
  ) => {
    try {
      setProcessingId(id);

      await reviewAdminMenuItem(id, newStatus);

      toast.success(`Menu item ${newStatus} successfully.`);
      await fetchItems(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Activate or deactivate
  const handleAvailability = async (id: string, isActive: boolean) => {
    try {
      setProcessingId(id);

      await updateAdminMenuItemAvailability(id, isActive);

      toast.success(
        `Menu item ${isActive ? "activated" : "deactivated"} successfully.`,
      );

      await fetchItems(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Delete menu item
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await deleteAdminMenuItem(id);

      toast.success("Menu item deleted successfully.");

      setItems((previous) => previous.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const pendingCount = items.filter((item) => item.status === "pending").length;

  const approvedCount = items.filter(
    (item) => item.status === "approved",
  ).length;

  const activeCount = items.filter(
    (item) => item.status === "approved" && item.isActive,
  ).length;

  if (sessionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-destructive" />
          <h2 className="text-lg font-bold text-foreground">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 text-foreground md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Manage Menu Items
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, manage, and control submitted menu items.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4 text-green-600" />
          {items.length} Menu Items
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            {items.length}
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <ShieldCheck className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-400">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Approved</p>
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-green-700 dark:text-green-400">
            {approvedCount}
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Active Items</p>
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {activeCount}
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search item or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-9 text-sm text-foreground outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
              <option value="all">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-9 text-sm text-foreground outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground">
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Menu Items Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div>
            <h2 className="font-semibold text-foreground">
              Submitted Menu Items
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {items.length} results
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchItems(true)}
            disabled={refreshing}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-green-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 font-medium text-foreground">
              No menu items found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Menu Item</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images?.[0] || "/placeholder.png"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover shadow-sm transition-transform duration-200 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}

                        <div className="max-w-[200px]">
                          <p className="font-semibold text-foreground">
                            {item.name}
                          </p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {item.location}
                          </p>
                          <Link
                            href={`/menu/${item._id}`}
                            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                            View Details
                            <ArrowRight
                              size={15}
                              className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {item.vendorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.vendorEmail}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-muted-foreground">
                      {item.category}
                    </td>

                    <td className="px-4 py-4 font-semibold text-foreground">
                      ৳{item.price}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                            : item.status === "pending"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {item.status === "approved" ? (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.isActive
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-muted text-muted-foreground"
                          }`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {item.status === "pending" && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={processingId === item._id}
                              onClick={() => handleReview(item._id, "approved")}
                              className="border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950">
                              {processingId === item._id ? (
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="mr-1 h-4 w-4" />
                              )}
                              Approve
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={processingId === item._id}
                              onClick={() => handleReview(item._id, "rejected")}
                              className="border-red-600 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}

                        {item.status === "approved" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={processingId === item._id}
                            onClick={() =>
                              handleAvailability(item._id, !item.isActive)
                            }
                            className={
                              item.isActive
                                ? "border-orange-600 text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950"
                                : "border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                            }>
                            {processingId === item._id ? (
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : item.isActive ? (
                              <X className="mr-1 h-4 w-4" />
                            ) : (
                              <Check className="mr-1 h-4 w-4" />
                            )}
                            {item.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={deletingId === item._id}
                                className="border-red-600 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                              />
                            }>
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete menu item?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete{" "}
                                <span className="font-semibold text-foreground">
                                  {item.name}
                                </span>
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                disabled={deletingId === item._id}
                                onClick={() => handleDelete(item._id)}
                                className="bg-red-600 text-white hover:bg-red-700">
                                {deletingId === item._id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  "Delete"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminManageMenuItemsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      }>
      <AdminManageMenuItemsContent />
    </Suspense>
  );
};

export default AdminManageMenuItemsPage;
