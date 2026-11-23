import { getTokenFromClient } from "../get-token";

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
  const { token, error } = await getTokenFromClient();

  if (error || !token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${SERVER_URL}/customer-dashboard/${encodeURIComponent(customerEmail)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  const { token, error } = await getTokenFromClient();

  if (error || !token) {
    throw new Error("Authentication required.");
  }
  c

  const response = await fetch(`${SERVER_URL}/orders/${orderId}/rejected`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ customerEmail }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete order.");
  }

  return data;
}
