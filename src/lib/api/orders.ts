const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Order {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  price: number;
  vendorName: string;
  vendorEmail: string;
  customerName: string;
  customerEmail: string;
  deliveryDate: string;
  deliveryAddress: string;
  customerMessage: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  cancelledAt?: string;
  updatedAt?: string;
}

interface OrderResponse {
  success: boolean;
  alreadyOrdered?: boolean;
  message: string;
  data?: Order;
}

async function getApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("Invalid API response:", {
      status: response.status,
      statusText: response.statusText,
      body: text,
    });

    throw new Error(
      `Server returned an invalid response (${response.status}).`,
    );
  }
}

// Check existing active order
export async function checkExistingOrder(
  itemId: string,
  customerEmail: string,
): Promise<{
  alreadyOrdered: boolean;
  orderId?: string;
  status?: Order["status"];
}> {
  const params = new URLSearchParams({ itemId, customerEmail });

  const response = await fetch(
    `${SERVER_URL}/orders/check?${params.toString()}`,
    { cache: "no-store" },
  );

  const result = await getApiResponse<{
    alreadyOrdered: boolean;
    orderId?: string;
    status?: Order["status"];
    message?: string;
  }>(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to check order.");
  }

  return result;
}

// Place order
export async function placeOrder(data: {
  itemId: string;
  customerName: string;
  customerEmail: string;
  deliveryDate: string;
  deliveryAddress: string;
  customerMessage: string;
}): Promise<OrderResponse> {
  const response = await fetch(`${SERVER_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await getApiResponse<OrderResponse>(response);

  if (!response.ok) {
    console.error("Order API error:", {
      status: response.status,
      statusText: response.statusText,
      body: result,
      submittedData: data,
    });

    if (response.status === 409) {
      return { ...result, alreadyOrdered: true };
    }

    throw new Error(
      result.message || `Failed to place order (${response.status}).`,
    );
  }

  return result;
}

// Get customer's orders
export async function getCustomerOrders(
  customerEmail: string,
): Promise<Order[]> {
  const response = await fetch(
    `${SERVER_URL}/orders/customer/${encodeURIComponent(customerEmail)}`,
    { cache: "no-store" },
  );

  const result = await getApiResponse<Order[]>(response);

  if (!response.ok) {
    throw new Error("Failed to fetch customer orders.");
  }

  return result;
}

// Cancel customer's pending order
export async function cancelCustomerOrder(
  orderId: string,
  customerEmail: string,
): Promise<OrderResponse> {
  const response = await fetch(`${SERVER_URL}/orders/${orderId}/withdraw`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customerEmail }),
  });

  const result = await getApiResponse<OrderResponse>(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to withdraw order.");
  }

  return result;
}

// Get vendor's orders
export async function getVendorOrders(vendorEmail: string): Promise<Order[]> {
  const response = await fetch(
    `${SERVER_URL}/orders/vendor/${encodeURIComponent(vendorEmail)}`,
    { cache: "no-store" },
  );

  const result = await getApiResponse<Order[]>(response);

  if (!response.ok) {
    throw new Error("Failed to fetch vendor orders.");
  }

  return result;
}

// Vendor accepts or rejects an order
export async function updateVendorOrderStatus(
  orderId: string,
  vendorEmail: string,
  status: "accepted" | "rejected",
): Promise<OrderResponse> {
  const response = await fetch(
    `${SERVER_URL}/orders/${orderId}/vendor-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vendorEmail, status }),
    },
  );

  const result = await getApiResponse<OrderResponse>(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to update order.");
  }

  return result;
}
