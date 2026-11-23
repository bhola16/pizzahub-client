import { getTokenFromClient } from "../get-token";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "vendor" | "customer";
  createdAt?: string;
  isBlocked: boolean;
  subscriptionPlan?: string;
}

interface UsersResponse {
  success: boolean;
  count: number;
  data: AdminUser[];
  message?: string;
}

// Get JWT Authorization headers
const getAuthHeaders = async () => {
  const { token, error } = await getTokenFromClient();

  if (error || !token) {
    throw new Error("Authentication required.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Handle API responses
const handleResponse = async (response: Response) => {
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
};

// Fetch users with search and role filter
export const getAdminUsers = async (
  search = "",
  role = "all",
): Promise<AdminUser[]> => {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (role !== "all") {
    params.set("role", role);
  }

  const query = params.toString();

  const response = await fetch(
    `${SERVER_URL}/admin/users${query ? `?${query}` : ""}`,
    {
      headers: await getAuthHeaders(),
      cache: "no-store",
    },
  );

  const result: UsersResponse = await handleResponse(response);

  return result.data;
};

// Block user
export const blockAdminUser = async (userId: string) => {
  return updateUserStatus(userId, "block");
};

// Unblock user
export const unblockAdminUser = async (userId: string) => {
  return updateUserStatus(userId, "unblock");
};

// Common status update function
const updateUserStatus = async (
  userId: string,
  action: "block" | "unblock",
) => {
  const response = await fetch(
    `${SERVER_URL}/admin/users/${userId}/${action}`,
    {
      method: "PATCH",
      headers: await getAuthHeaders(),
    },
  );

  return handleResponse(response);
};
