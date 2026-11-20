import { checkoutVerify } from "@/lib/api/payment/payments-api";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <section id="success">
        <h2>Payment verification failed!</h2>
        <p>Session ID is missing.</p>
      </section>
    );
  }

  let isSuccessful = false;
  let message = "";

  try {
    const result = await checkoutVerify(session_id);
    isSuccessful = true;
    message = result.message;
  } catch (error) {
    message =
      error instanceof Error ? error.message : "Payment verification failed.";
  }

  if (!isSuccessful) {
    return (
      <section id="success">
        <h2>Payment verification failed!</h2>
        <p>{message}</p>
        <p>Please contact support if your payment was deducted.</p>
      </section>
    );
  }

  return (
    <section id="success">
      <h2>Payment successful!</h2>
      <p>{message}</p>
      <p>
        We appreciate your business! A confirmation email will be sent to your
        registered email address.
      </p>
      <p>
        If you have any questions, please email{" "}
        <a href="mailto:ku.bhola16@gmail.com">ku.bhola16@gmail.com</a>.
      </p>
    </section>
  );
}
