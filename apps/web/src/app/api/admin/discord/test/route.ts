import { NextResponse } from "next/server";
import { sendResourceNotification } from "@/lib/discord-webhook";
import { requireAdminRoute } from "@/lib/route-auth";

export const runtime = "edge";

async function sendDiscordTest() {
  const authError = await requireAdminRoute();
  if (authError) return authError;

  const result = await sendResourceNotification({
    title: "Prueba de Discord",
    slug: "discord-test",
    description: "Mensaje de prueba enviado desde el runtime de MC Market.",
    tier: "free",
    resourcePath: "/admin/plugins",
    resourceType: "Diagnostico",
  });

  return NextResponse.json({
    ok: result.ok,
    result,
  });
}

export async function GET() {
  return sendDiscordTest();
}

export async function POST() {
  return sendDiscordTest();
}
