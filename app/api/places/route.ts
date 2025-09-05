// app/api/places/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;              // 캐시 안 함 (항상 최신)
export const dynamic = "force-dynamic";   // 동적 라우트로 처리

export async function GET() {
  // 필요한 필드만 선택
  const { data, error } = await supabase
    .from("places")
    .select("id, slug, name, summary, description, lat, lng, image_url, status")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const featureCollection = {
    type: "FeatureCollection",
    features: (data ?? []).map((p) => ({
      type: "Feature",
      properties: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        summary: p.summary,
        description: p.description,
        image_url: p.image_url,
      },
      geometry: {
        type: "Point",
        coordinates: [p.lng, p.lat],
      },
    })),
  };

  return NextResponse.json(featureCollection, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
