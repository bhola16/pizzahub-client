import { getTokenFromClient } from "../get-token";

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


  const { token, error } = await getTokenFromClient();

  if (error || !token) {
    throw new Error("Authentication failed. Please log in again.");
  }

  // console.log(token)

  const response = await fetch(
    `${API_URL}/vendor-dashboard/${encodeURIComponent(vendorEmail)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch vendor dashboard.");
  }

  return result;
}
