
const SERVER_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

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
  payment_intent: string | null;
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

  const url = `${SERVER_URL}/admin/transactions?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error(
      `Invalid backend response. HTTP ${response.status}`,
    );
  }

  const result: TransactionsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || `Failed to fetch transactions. HTTP ${response.status}`,
    );
  }

  return result.data || [];
};
