
const SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AdminDashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
}

interface DashboardStatsResponse {
  success: boolean;
  data: AdminDashboardStats;
  message?: string;
}

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    const response = await fetch(
      `${SERVER_URL}/admin/dashboard/stats`,
      {
        cache: "no-store",
      },
    );

    const result: DashboardStatsResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to fetch dashboard statistics.",
      );
    }

    return result.data;
  };
