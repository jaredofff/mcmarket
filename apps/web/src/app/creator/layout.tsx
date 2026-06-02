import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-supabase-server";
import { canAccessCreator, getTrustedRoleFromMetadata } from "@/lib/roles";
import CreatorShell from "./CreatorShell";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth?next=/admin/plugins");
  }

  const role = getTrustedRoleFromMetadata(session.user.app_metadata);

  if (!canAccessCreator(role)) {
    redirect("/dashboard?forbidden=creator");
  }

  return <CreatorShell>{children}</CreatorShell>;
}
