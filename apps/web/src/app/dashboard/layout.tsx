import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-supabase-server";
import DashboardShell from "./DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth?next=/dashboard");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
