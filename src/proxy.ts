import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Require authentication.
  if (!session?.user) {
    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set(
      "callbackURL",
      pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(signInUrl);
  }

  const user = session.user as typeof session.user & {
    role?: string;
  };

  // Payment pages are available to authenticated vendors only.
  const isPaymentRoute =
    pathname === "/dashboard/payment" ||
    pathname.startsWith("/dashboard/payment/");

  if (isPaymentRoute && user.role !== "vendor") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/menu/:id",
    "/profile/:path*",
    "/payment-success",
    "/payment-cancel",
    "/dashboard/payment",
    "/dashboard/payment/:path*",
  ],
};
