const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const checkoutVerify = async (sessionId: string) => {
  const response = await fetch(`${SERVER_URL}/payments/checkout-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
    cache: "no-store",
  });

  const result = await response.json();

//   console.log("Verification status:", response.status);
//   console.log("Verification response:", result);

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Payment verification failed.");
  }

  return result;
};
