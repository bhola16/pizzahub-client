
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface VendorSubscription {
  subscriptionPlan: "free" | "premium";
  subscriptionStatus: string;
}

// Get vendor subscription
export async function getVendorSubscription(): Promise<VendorSubscription> {
  const response = await fetch(
    `${API_URL}/api/payments/subscription`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load subscription"
    );
  }

  return data.subscription;
}

// Create Stripe Checkout Session
export async function createCheckoutSession(): Promise<string> {
  const response = await fetch(
    `${API_URL}/api/payments/create-checkout-session`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create checkout session"
    );
  }

  if (!data.url) {
    throw new Error("Stripe Checkout URL was not returned");
  }

  return data.url;
}
