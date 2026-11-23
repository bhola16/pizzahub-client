import { getTokenFromClient } from "../get-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders(): Promise<HeadersInit> {
  const { token, error } = await getTokenFromClient();

  if (error || !token) {
    throw new Error("Authentication failed. Please log in again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function updateMenuItem(
  id: string,
  data: {
    name: string;
    category: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    vendorEmail: string;
  },
) {
  const response = await fetch(`${API_URL}/menuItems/${id}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update menu item.");
  }

  return result;
}

export async function deleteMenuItem(id: string, vendorEmail: string) {
  const response = await fetch(`${API_URL}/menuItems/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ vendorEmail }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete menu item.");
  }

  return result;
}

export async function updateMenuItemAvailability(
  id: string,
  vendorEmail: string,
  isActive: boolean,
) {
  const response = await fetch(`${API_URL}/menuItems/${id}/availability`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ vendorEmail, isActive }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update availability.");
  }

  return result;
}

export async function getVendorMenuItems(vendorEmail: string) {
  const response = await fetch(
    `${API_URL}/vendor-menu-items/${encodeURIComponent(vendorEmail)}`,
    {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to fetch menu items.");
  }

  return response.json();
}
