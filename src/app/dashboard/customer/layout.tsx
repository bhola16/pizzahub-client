import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Vendor dashboard session:", {
    userId: session?.user?.id,
    role: session?.user?.role,
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "customer") {
    redirect(`/dashboard/${session.user.role}`);
  }

  return <>{children}</>;
}