import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const role = session.user.role;

  if (role !== "vendor" && role !== "customer" && role !== "admin") {
    redirect("/");
  }

  return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
