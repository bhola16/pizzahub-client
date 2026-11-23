import { toast } from "sonner";
import { MenuItem } from "./menu-server";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface MenuResponse {
  success: boolean;
  count?: number;
  data?: MenuItem[];
  message?: string;
}

interface SingleMenuResponse {
  success: boolean;
  data?: MenuItem;
  message?: string;
}

// Get all menu items
export async function getMenuItems(filters?: {
  search?: string;
  category?: string;
  location?: string;
}): Promise<MenuItem[]> {
  try {
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
      toast.error("Failed to fetch menu items. Please try again.");
      return [];
    }

    const result: MenuResponse = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Get menu items error:", error);
    toast.error("Unable to connect to the server. Please try again later.");
    return [];
  }
}

// Get latest 6 featured menu items
export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${SERVER_URL}/menuItems/featured`, {
      cache: "no-store",
    });

    if (!response.ok) {
      toast.error("Unable to load featured menu items.");
      return [];
    }

    const result: MenuResponse = await response.json();
    return result.data || [];
  } catch {
    toast.error("Server is unavailable. Please try again later.");
    return [];
  }
}

