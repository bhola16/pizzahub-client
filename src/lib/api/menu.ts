import type { MenuItem } from "./menu-server";
export type { MenuItem } from "./menu-server";
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface MenuResponse {
  success: boolean;
  count?: number;
  data?: MenuItem[];
  message?: string;
}

export async function getMenuItems(filters?: {
  search?: string;
  category?: string;
  location?: string;
}): Promise<MenuItem[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.set("search", filters.search);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.location) params.set("location", filters.location);

  const query = params.toString();

  const response = await fetch(
    `${SERVER_URL}/menuItems${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch menu items.");
  }

  const result: MenuResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch menu items.");
  }

  return result.data || [];
}

export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  const response = await fetch(`${SERVER_URL}/menuItems/featured`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load featured menu items.");
  }

  const result: MenuResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Unable to load featured menu items.");
  }

  return result.data || [];
}
