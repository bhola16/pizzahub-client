const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
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
  );

  if (!response.ok) {
    throw new Error("Failed to fetch menu items.");
  }

  return response.json();
}
