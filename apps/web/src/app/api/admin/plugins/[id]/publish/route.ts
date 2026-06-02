import { NextRequest, NextResponse } from "next/server";
import { toAdminPlugin, type PluginRecord } from "@/lib/plugin-records";
import { requireAdminRoute } from "@/lib/route-auth";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "edge";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminRoute();
    if (authError) return authError;

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ message: "Supabase admin client is not configured" }, { status: 500 });
    }

    const { id } = await params;
    const { data, error } = await supabase
      .from("plugins")
      .update({ published: true })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(toAdminPlugin(data as PluginRecord));
  } catch (error) {
    console.error("Error publishing plugin:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to publish plugin" },
      { status: 500 }
    );
  }
}
