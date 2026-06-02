import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-supabase-server";
import { canAccessCreator, getRoleFromMetadata } from "@/lib/roles";
import CreatorShell from "./CreatorShell";

export const dynamic = "force-dynamic";

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth?next=/creator/dashboard");
  }

  const role = getRoleFromMetadata(session.user.app_metadata, session.user.user_metadata);

  if (!canAccessCreator(role)) {
    redirect("/dashboard?forbidden=creator");
  }

  return <CreatorShell>{children}</CreatorShell>;
}
