const SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface OrderResponse {
  success: boolean;
  alreadyOrdered?: boolean;
  message: string;
  data?: unknown;
}

export async function checkExistingOrder(
  itemId: string,
  customerEmail: string,
): Promise<boolean> {
  const params = new URLSearchParams({
    itemId,
    customerEmail,
  });

  const response = await fetch(
    `${SERVER_URL}/orders/check?${params.toString()}`,
    { cache: "no-store" },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to check order");
  }

  return result.alreadyOrdered;
}

export async function placeOrder(data: {
  itemId: string;
  customerName: string;
  customerEmail: string;
}): Promise<OrderResponse> {
  const response = await fetch(`${SERVER_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: OrderResponse = await response.json();

  if (!response.ok) {
    if (response.status === 409) {
      return {
        ...result,
        alreadyOrdered: true,
      };
    }

    throw new Error(result.message || "Failed to place order");
  }

  return result;
}
