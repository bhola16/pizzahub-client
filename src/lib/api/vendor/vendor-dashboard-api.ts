const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface VendorDashboardData {
  totalMenuItems: number;
  activeMenuItems: number;
  pendingOrders: number;
  acceptedOrders: number;
}

export async function getVendorDashboard(
  vendorEmail: string,
): Promise<VendorDashboardData> {
  const response = await fetch(
    `${API_URL}/vendor-dashboard/${encodeURIComponent(vendorEmail)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch vendor dashboard.");
  }

  return result;
}
