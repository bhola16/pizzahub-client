const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CustomerDashboardData = {
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
};

export async function getCustomerDashboard(
  customerEmail: string,
): Promise<CustomerDashboardData> {
  const response = await fetch(
    `${API_URL}/customer-dashboard/${encodeURIComponent(customerEmail)}`,
    {
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch customer dashboard.",
    );
  }

  return result;
}