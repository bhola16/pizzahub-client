const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface VendorPremiumResponse {
  isPremium: boolean;
  subscriptionPlan?: "free" | "premium";
  subscriptionStatus?: string;
}

export const getVendorPremiumById = async (
  userId: string,
): Promise<VendorPremiumResponse> => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const response = await fetch(
    `${SERVER_URL}/users/${encodeURIComponent(userId)}/premium`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch vendor premium status.");
  }

  return result;
};
