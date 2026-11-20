import { getSession } from "@/lib/core/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const userSession = await getSession();

  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1UdtAjRWGZTqrdTsTHF7MYeg",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userSession?.user?.email,
      metadata: {
        userId: userSession?.user?.id ?? null,
      },
      success_url: `${origin}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      integration_identifier: "pizzahub_web_0001",
    });
    return NextResponse.redirect(session.url as string, 303);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Error creating checkout session:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
