import { toast } from "sonner";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  location: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone?: string;
  vendorAddress?: string;
  status: string;
  isActive: boolean;
  createdAt?: string;
}

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


// Get a single menu item
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  try {
    const response = await fetch(`${SERVER_URL}/menuItems/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result: SingleMenuResponse = await response.json();
    return result.data || null;
  } catch (error) {
    // console.error("Get menu item error:", error);
    // toast.error("Unable to connect to the server. Please try again later.");
    return null;
  }
}
