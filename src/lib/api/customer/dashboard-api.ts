const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    `${SERVER_URL}/customer-dashboard/${encodeURIComponent(customerEmail)}`,
    {
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch customer dashboard.");
  }

  return result;
}

export async function deleteRejectedCustomerOrder(
  orderId: string,
  customerEmail: string,
) {
  const response = await fetch(`${SERVER_URL}/orders/${orderId}/rejected`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customerEmail }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete order.");
  }

  return data;
}
