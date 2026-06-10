import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const MEDIA_BUCKET = "plugin-media";

function getMarkdownStoragePath(src: string) {
  try {
    const url = new URL(src);
    const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  const storagePath = src ? getMarkdownStoragePath(src) : null;

  if (!storagePath || !storagePath.startsWith("markdown/")) {
    return NextResponse.json({ message: "Invalid markdown image source" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({ message: "Supabase URL is not configured" }, { status: 500 });
  }

  const imageUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${MEDIA_BUCKET}/${encodeURI(storagePath)}`;
  const imageResponse = await fetch(imageUrl, {
    headers: {
      Accept: "image/avif,image/webp,image/png,image/jpeg,image/*",
    },
  });

  if (!imageResponse.ok || !imageResponse.body) {
    return NextResponse.json({ message: "Image not found" }, { status: imageResponse.status || 404 });
  }

  return new NextResponse(imageResponse.body, {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
      "Content-Type": imageResponse.headers.get("Content-Type") || "image/png",
    },
  });
}
