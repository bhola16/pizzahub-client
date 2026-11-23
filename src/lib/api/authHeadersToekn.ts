import { getTokenFromClient } from "./get-token";


export async function getAuthHeaders(): Promise<HeadersInit> {
  const { token, error } = await getTokenFromClient();

  if (error || !token) {
    throw new Error("Authentication failed. Please log in again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}