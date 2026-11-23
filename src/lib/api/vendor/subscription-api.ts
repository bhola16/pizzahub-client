import { getTokenFromClient } from "@/lib/api/get-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface VendorSubscription {
  subscriptionPlan: "free" | "premium";
  subscriptionStatus: string;
  premium?: boolean;
  stripeSubscriptionId?: string | null;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const { token, error } = await getTokenFromClient();

  if (error || !token) {
    throw new Error("Authentication failed. Please log in again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Get vendor subscription
export async function getVendorSubscription(): Promise<VendorSubscription> {
  const response = await fetch(`${API_URL}/api/payments/subscription`, {
    method: "GET",
    credentials: "include",
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load subscription");
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
      headers: await getAuthHeaders(),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create checkout session");
  }

  if (!data.url) {
    throw new Error("Stripe Checkout URL was not returned");
  }

  return data.url;
}

// Cancel vendor subscription
export async function cancelVendorSubscription(): Promise<{
  success: boolean;
  message: string;
  subscription: {
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
  };
}> {
  const response = await fetch(`${API_URL}/api/payments/cancel-subscription`, {
    method: "POST",
    credentials: "include",
    headers: await getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to cancel subscription");
  }

  return data;
}
