import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow payment result pages without authentication redirect.
  if (
    pathname === "/dashboard/payment/success" ||
    pathname === "/dashboard/payment/cancel"
  ) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

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
