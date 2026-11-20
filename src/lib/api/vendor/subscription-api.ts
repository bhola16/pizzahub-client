const SERVER_URL =  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export interface VendorSubscription {
  subscriptionPlan: "free" | "premium";
  subscriptionStatus?: string;
}

interface VendorDashboardResponse {
  success?: boolean;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  message?: string;
}

interface CheckoutResponse {
  url?: string;
  message?: string;
}

async function getApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Invalid server response.');
  }
}

// Get vendor subscription
export async function getVendorSubscription(
  vendorEmail: string,
): Promise<VendorSubscription> {
  let response: Response;

  try {
    response = await fetch(
      `${SERVER_URL}/vendor-dashboard/${encodeURIComponent(vendorEmail)}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error(
      `Cannot connect to backend at ${SERVER_URL}. Check whether your Express server is running.`,
    );
  }

  const result = await getApiResponse<VendorDashboardResponse>(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch subscription.");
  }

  return {
    subscriptionPlan:
      result.subscriptionPlan === "premium" ? "premium" : "free",
    subscriptionStatus: result.subscriptionStatus || "inactive",
  };
}

// Create Stripe Checkout session
export async function createSubscriptionCheckout(
  vendorEmail: string,
): Promise<string> {
  const response = await fetch(`${SERVER_URL}/subscriptions/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vendorEmail }),
  });

  const result = await getApiResponse<CheckoutResponse>(response);

  if (!response.ok) {
    throw new Error(result.message || "Unable to start checkout.");
  }

  if (!result.url) {
    throw new Error("Stripe checkout URL was not returned.");
  }

  return result.url;
}
