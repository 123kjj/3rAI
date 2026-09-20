import { NextRequest, NextResponse } from "next/server";
import { mockAnalyzeItem, realAnalyzeItem } from "@/lib/ai";

export const runtime = "nodejs";

/**
 * POST /api/analyze
 * body: { image: string (data URL), location?: string }
 *
 * Uses the real AI vision API when ANTHROPIC_API_KEY is configured,
 * otherwise falls back to mock demo data. This keeps the API key on
 * the server and out of the browser bundle.
 */
export async function POST(req: NextRequest) {
  try {
    const { image, location } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "No image was provided." },
        { status: 400 }
      );
    }

    const hasRealApi = !!process.env.GEMINI_API_KEY;

    if (!hasRealApi) {
      // ── DEMO MODE ──
      const result = mockAnalyzeItem(image);
      return NextResponse.json(result);
    }

    // ── REAL AI MODE ──
    const match = image.match(/^data:(.+);base64,(.*)$/);
    if (!match) {
      return NextResponse.json(
        { error: "Unsupported image format." },
        { status: 400 }
      );
    }
    const [, mediaType, base64Data] = match;

    const result = await realAnalyzeItem(base64Data, mediaType, location);
    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/analyze error:", err);
    // Fail soft: return demo data rather than a technical error so the
    // person never hits a broken flow. Use a random seed (not a fixed
    // string) so a real failure doesn't always land on the same item —
    // that made past failures look like a fixed "always says glass jar"
    // bug rather than the actual underlying error.
    const fallback = mockAnalyzeItem(`fallback-${Date.now()}-${Math.random()}`);
    return NextResponse.json({
      ...fallback,
      // Surface that this was a fallback, not a real analysis, so the UI
      // can tell the person instead of presenting it as a real match.
      isFallback: true,
    });
  }
}
