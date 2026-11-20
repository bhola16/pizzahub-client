
import { getSession } from "@/lib/core/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const userSession = await getSession();

    if (!userSession?.user?.id || !userSession.user.email) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const headersList = await headers();
    const origin = headersList.get("origin");

    if (!origin) {
      return NextResponse.json(
        { error: "Origin not found." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1UdtAjRWGZTqrdTsTHF7MYeg",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userSession.user.email,
      metadata: {
        userId: userSession.user.id,
      },
      success_url: `${origin}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/payment/cancel`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Error creating checkout session:", error.message);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
