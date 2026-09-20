import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/local-rules
 * body: { item: string, category: string, location: string }
 *
 * Uses Gemini to give GENERAL, typical guidance for how an item is usually
 * handled in a given city/state. This is NOT live municipal data — no free,
 * self-serve API for that exists (real ones like Earth911 or Recycle Coach
 * are B2B/partner-only). The response is always clearly framed as general
 * guidance, and the UI keeps a visible disclaimer.
 *
 * Without GEMINI_API_KEY configured, returns a generic fallback message.
 *
 * NOTE: Google periodically retires Gemini model versions (see the model
 * name below and src/lib/ai.ts) — if this starts returning 404s, the error
 * body from Google names the current replacement model directly.
 */
export async function POST(req: NextRequest) {
  try {
    const { item, category, location } = await req.json();

    if (!location || typeof location !== "string" || !location.trim()) {
      return NextResponse.json(
        { error: "Please enter a city or state." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        guidance: `We don't have live recycling data for ${location} yet, but most local programs post accepted materials on their city or waste-hauler website — search "${location} recycling guide" to confirm.`,
        isGeneric: true,
      });
    }

    const prompt = `A person in ${location} wants to know how a "${item}" (category: ${category}) is
typically handled by local waste/recycling programs in that area.

Give general, typical guidance in 2-3 short sentences — e.g. whether this type of item is
usually accepted curbside, needs drop-off, or is commonly excluded in that region. Do NOT invent
specific municipal program names, exact bin colors, or pickup schedules you cannot verify.
Be honest that this is general/typical guidance, not an official lookup, and that the person
should confirm with their local hauler or city website.

Respond with ONLY a JSON object, no prose, no markdown fences:
{ "guidance": string }`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "AQ."-prefixed keys are rejected as a ?key= query param; must
          // go in this header (works for "AIzaSy" keys too).
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            // Forces strictly valid JSON matching this shape — without
            // it, a stray unescaped quote in the guidance text can break
            // JSON.parse (this happened in practice on /api/analyze).
            responseSchema: {
              type: "OBJECT",
              properties: { guidance: { type: "STRING" } },
              required: ["guidance"],
            },
            temperature: 0.3,
            maxOutputTokens: 400,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Gemini API error: ${response.status} ${errorBody.slice(0, 300)}`);
    }

    const data = await response.json();
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    console.log("[local-rules] raw Gemini text:", raw.slice(0, 500));

    if (!cleaned) {
      throw new Error("Gemini returned an empty response for local-rules guidance.");
    }

    let parsed: { guidance?: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      throw new Error(
        `Failed to parse Gemini's local-rules response as JSON: ${
          (parseErr as Error).message
        }. Raw: ${cleaned.slice(0, 200)}`
      );
    }

    return NextResponse.json({
      guidance:
        parsed.guidance ||
        `We couldn't generate specific guidance for ${location} — check your local hauler's website to confirm.`,
      isGeneric: false,
    });
  } catch (err) {
    console.error("/api/local-rules error:", err);
    return NextResponse.json({
      guidance:
        "We couldn't reach the guidance service right now. Most local programs post accepted materials on their city or waste-hauler website.",
      isGeneric: true,
    });
  }
}
