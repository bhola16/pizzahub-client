
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth, connectMongoDB } from "@/lib/auth";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectMongoDB();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "vendor") {
    redirect(`/dashboard/${session.user.role}`);
  }

  return <>{children}</>;
}
