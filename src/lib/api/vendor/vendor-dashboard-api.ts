const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface VendorDashboardData {
  totalMenuItems: number;
  activeMenuItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  subscriptionPlan?: string;
  premium?: boolean;
}

export async function getVendorDashboard(
  vendorEmail: string,
): Promise<VendorDashboardData> {
  const response = await fetch(
    `${API_URL}/vendor-dashboard/${encodeURIComponent(vendorEmail)}`,
    {
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch vendor dashboard.");
  }

  return result;
}
