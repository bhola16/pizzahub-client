const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AdminMenuItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorName: string;
  vendorEmail: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

interface MenuItemsResponse {
  success: boolean;
  count: number;
  data: AdminMenuItem[];
  message?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

// Handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result as T;
};

// Get all menu items with search and filters
export const getAdminMenuItems = async (
  search = "",
  category = "all",
  status = "all",
): Promise<AdminMenuItem[]> => {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (category !== "all") params.set("category", category);
  if (status !== "all") params.set("status", status);

  const query = params.toString();

  const response = await fetch(
    `${SERVER_URL}/admin/menu-items${query ? `?${query}` : ""}`,
  );

  const result = await handleResponse<MenuItemsResponse>(response);

  return result.data;
};

// Approve or reject a pending item
export const reviewAdminMenuItem = async (
  id: string,
  status: "approved" | "rejected",
) => {
  const response = await fetch(`${SERVER_URL}/admin/menu-items/${id}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse<ApiResponse>(response);
};

// Activate or deactivate an approved item
export const updateAdminMenuItemAvailability = async (
  id: string,
  isActive: boolean,
) => {
  const response = await fetch(
    `${SERVER_URL}/admin/menu-items/${id}/availability`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    },
  );

  return handleResponse<ApiResponse>(response);
};

// Delete a menu item
export const deleteAdminMenuItem = async (id: string) => {
  const response = await fetch(`${SERVER_URL}/admin/menu-items/${id}`, {
    method: "DELETE",
  });

  return handleResponse<ApiResponse>(response);
};
