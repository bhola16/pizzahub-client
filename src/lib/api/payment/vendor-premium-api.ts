const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getVendorPremiumById = async (userId: string) => {
  const response = await fetch(`${SERVER_URL}/users/${userId}/premium`);

  if (!response.ok) {
    throw new Error("Failed to fetch vendor premium status.");
  }

  return response.json();
};
