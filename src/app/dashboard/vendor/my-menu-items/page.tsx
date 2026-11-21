"use client";

import {
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  getVendorMenuItems,
  updateMenuItemAvailability,
} from "@/lib/api/vendor/vendor-menu-api";
import { useSession } from "@/lib/auth-client";

import DeleteMenuModal from "@/components/dashboard/vendor/DeleteMenuModal";
import EditMenuItemModal from "@/components/dashboard/vendor/EditMenuItemModal";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorEmail: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: string;
};

export default function MyMenuItemsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const vendorEmail = user?.email;

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all",
  );

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  // Fetch vendor menu items
  const fetchMenuItems = useCallback(async () => {
    if (!vendorEmail) return;

    try {
      setLoading(true);

      const data = await getVendorMenuItems(vendorEmail);
      setMenuItems(data);
    } catch {
      toast.error("Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  }, [vendorEmail]);

  useEffect(() => {
    if (vendorEmail) {
      fetchMenuItems();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [vendorEmail, isPending, fetchMenuItems]);

  // Synchronize filters when browser Back/Forward changes the URL
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");

    const status = searchParams.get("status") || "all";

    setStatusFilter(
      ["all", "approved", "pending", "rejected"].includes(status)
        ? status
        : "all",
    );
  }, [searchParams]);

  // Update URL search parameters
  const updateURLParams = (search: string, status: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateURLParams(value, statusFilter);
  };

  // Handle status filter
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    updateURLParams(searchTerm, value);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    router.replace(pathname, { scroll: false });
  };

  // Update availability
  const handleAvailability = async (item: MenuItem) => {
    try {
      setUpdatingId(item._id);

      await updateMenuItemAvailability(
        item._id,
        item.vendorEmail,
        !item.isActive,
      );

      toast.success(
        item.isActive
          ? "Menu item is now unavailable."
          : "Menu item is now available.",
      );

      setMenuItems((previous) =>
        previous.map((menuItem) =>
          menuItem._id === item._id
            ? { ...menuItem, isActive: !item.isActive }
            : menuItem,
        ),
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update availability.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const approvedCount = menuItems.filter(
    (item) => item.status === "approved",
  ).length;

  const pendingCount = menuItems.filter(
    (item) => item.status === "pending",
  ).length;

  const rejectedCount = menuItems.filter(
    (item) => item.status === "rejected",
  ).length;

  const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "all";

  // Status styles
  const getStatusClass = (status: MenuItem["status"]) => {
    switch (status) {
      case "approved":
        return "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400";
      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
      case "rejected":
        return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400";
      default:
        return "";
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Please log in to view your menu items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Menu Items
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your menu, update availability, and track item reviews.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-menu-item"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-[0.98] sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Menu Item
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Items
            </p>
            <div className="rounded-lg bg-muted p-2">
              <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-foreground">
            {menuItems.length}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            All submitted items
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Approved
            </p>
            <div className="rounded-lg bg-green-500/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-green-600 dark:text-green-400">
            {approvedCount}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Reviewed and approved
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-amber-600 dark:text-amber-400">
            {pendingCount}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Waiting for review
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Rejected
            </p>
            <div className="rounded-lg bg-red-500/10 p-2">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-red-600 dark:text-red-400">
            {rejectedCount}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Requires your attention
          </p>
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Section Header */}
        <div className="border-b border-border p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Menu Overview
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                View and manage all your submitted menu items.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-10 pl-9 pr-9 sm:w-60"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => handleSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label="Clear search">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring">
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-10 gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden items-center justify-between border-b border-border bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:flex">
          <span>Menu Item</span>
          <span>Status & Actions</span>
        </div>

        {/* Menu Item Rows */}
        <div className="divide-y divide-border">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
              </div>

              <h3 className="font-semibold text-foreground">
                No menu items found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {menuItems.length === 0
                  ? "You haven't added any menu items yet. Add your first item to get started."
                  : "No items match your search or selected status."}
              </p>

              {menuItems.length === 0 && (
                <Button
                  className="mt-5"
                  render={<Link href="/dashboard/vendor/add-menu-item" />}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              )}

              {menuItems.length > 0 && hasActiveFilters && (
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-muted/30 lg:flex-row lg:items-center lg:justify-between">
                {/* Item Information */}
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-muted">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="76px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <UtensilsCrossed className="h-7 w-7 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-foreground">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.category}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        ৳ {Number(item.price).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground/50">|</span>
                      <span>{item.location}</span>
                    </div>

                    {/* Availability */}
                    {item.status === "approved" && (
                      <button
                        type="button"
                        disabled={updatingId === item._id}
                        onClick={() => handleAvailability(item)}
                        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium transition disabled:opacity-50 ${
                          item.isActive
                            ? "text-green-600 hover:text-green-700 dark:text-green-400"
                            : "text-muted-foreground hover:text-foreground"
                        }`}>
                        {updatingId === item._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <span
                            className={`h-2 w-2 rounded-full ${
                              item.isActive
                                ? "bg-green-500"
                                : "bg-muted-foreground"
                            }`}
                          />
                        )}

                        {item.isActive ? "Available" : "Unavailable"}

                        <span className="text-muted-foreground/70">
                          · Click to change
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-wrap items-center gap-2 lg:w-[416px] lg:shrink-0 lg:justify-end">
                  <Badge
                    variant="outline"
                    className={`flex h-9 w-24 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${getStatusClass(
                      item.status,
                    )}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>

                  <Link
                    href={`/menu/${item._id}`}
                    className="inline-flex h-9 w-24 shrink-0 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Eye className="h-4 w-4 shrink-0" />
                    <span>View</span>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                    className="h-9 w-24 shrink-0">
                    <Pencil className="mr-2 h-4 w-4 shrink-0" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingItem(item)}
                    className="h-9 w-24 shrink-0 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-300">
                    <Trash2 className="mr-2 h-4 w-4 shrink-0" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {filteredItems.length > 0 && (
          <div className="border-t border-border bg-muted/30 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredItems.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {menuItems.length}
              </span>{" "}
              menu items
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdated={() => {
            setEditingItem(null);
            fetchMenuItems();
          }}
        />
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <DeleteMenuModal
          item={deletingItem}
          open={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onDeleted={() => {
            setDeletingItem(null);
            fetchMenuItems();
          }}
        />
      )}
    </div>
  );
}
