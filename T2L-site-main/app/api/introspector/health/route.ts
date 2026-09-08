import { NextResponse } from "next/server";
import { INTROSPECTOR_URL } from "@/lib/introspector-origin";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const upstream = await fetch(`${INTROSPECTOR_URL}/api/health`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    const text = await upstream.text();
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { status: upstream.ok ? "healthy" : "unhealthy" };
    }
    return NextResponse.json(payload, { status: upstream.status });
  } catch {
    return NextResponse.json({ status: "unreachable" }, { status: 502 });
  }
}
