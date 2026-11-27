import { auth, connectMongoDB } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CustomerLayout({
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

  if (session.user.role !== "customer") {
    redirect(`/dashboard/${session.user.role}`);
  }

  return <>{children}</>;
}
