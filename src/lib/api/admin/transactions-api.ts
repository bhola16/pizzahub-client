const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AdminTransaction {
  _id: string;
  sessionId: string;
  userId: string;
  vendorName: string;
  customer_email: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  payment_status: string;
  payment_intent: string;
  payment_date: string;
}

interface TransactionsResponse {
  success: boolean;
  count: number;
  data: AdminTransaction[];
  message?: string;
}

export const getAdminTransactions = async (
  search = "",
  plan = "all",
  paymentStatus = "all",
): Promise<AdminTransaction[]> => {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (plan !== "all") params.set("plan", plan);
  if (paymentStatus !== "all") {
    params.set("paymentStatus", paymentStatus);
  }

  const response = await fetch(
    `${SERVER_URL}/admin/transactions?${params.toString()}`,
  );

  const result: TransactionsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch transactions.");
  }

  return result.data;
};
