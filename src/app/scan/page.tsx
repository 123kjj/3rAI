"use client";

import { useCallback, useState } from "react";
import { UploadArea } from "@/components/UploadArea";
import { AnalyzingLoader } from "@/components/AnalyzingLoader";
import { ResultView } from "@/components/ResultView";
import { Button } from "@/components/Button";
import { analyzeItem } from "@/lib/ai";
import { fileToDataUrl } from "@/lib/utils";
import { AnalyzeItemResult } from "@/lib/types";
import { MOCK_RESULTS } from "@/lib/mockData";
import { useImpact } from "@/context/ImpactContext";

type Status = "idle" | "preview" | "analyzing" | "result" | "error";

// Keyword aliases for each demo item, used only when the person types a
// description after an "uncertain" result. This is plain local text
// matching (no AI call) — kept intentionally simple, but with enough
// synonyms that common phrasings ("toilet paper roll", "tin can") match
// the right demo item instead of falling through to a random pick.
const DESCRIBE_ALIASES: Record<number, string[]> = {
  0: ["plastic", "bottle", "water bottle"],
  1: ["cardboard", "box", "tube", "roll", "toilet paper", "paper towel", "paper roll"],
  2: ["glass", "jar", "mason jar"],
  3: ["shirt", "t-shirt", "tshirt", "clothing", "fabric", "textile"],
  4: ["aluminum", "aluminium", "can", "tin", "metal can"],
};

export default function ScanPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [image, setImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeItemResult | null>(null);
  const [actionTaken, setActionTaken] = useState(false);
  const { recordAction } = useImpact();

  const handleFile = useCallback(async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError(
        "That file type isn't supported. Please upload a JPG or PNG photo."
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("That image is too large. Please use a photo under 10MB.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setImage(dataUrl);
      setStatus("preview");
    } catch {
      setUploadError("We couldn't read that photo. Please try another one.");
    }
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!image) {
      setUploadError("Please select a photo before analyzing.");
      return;
    }
    setStatus("analyzing");
    setAnalysisError(null);
    setActionTaken(false);

    // Guard against a hung/slow request so the person is never stuck.
    const timeoutMs = 15000;
    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), timeoutMs)
    );

    try {
      const outcome = await Promise.race([analyzeItem(image), timeout]);
      if (!outcome) {
        // Slow analysis: fall back to a demo example rather than leaving
        // the person staring at a spinner.
        setAnalysisError(
          "That took longer than expected, so here's a similar example while we reconnect."
        );
        setResult(MOCK_RESULTS[0]);
      } else if (outcome.isFallback) {
        // The server reached out to the real AI but it failed (bad key,
        // rate limit, model error, etc.) — show a demo example but be
        // upfront that it's NOT a real analysis of this photo.
        setAnalysisError(
          "We couldn't analyze that photo with AI right now, so here's a similar example instead. Check the server terminal for the specific error."
        );
        setResult(outcome);
      } else {
        setResult(outcome);
      }
      setStatus("result");
    } catch {
      setAnalysisError(
        "Something went wrong analyzing that photo. Here's a similar example instead."
      );
      setResult(MOCK_RESULTS[0]);
      setStatus("result");
    }
  }, [image]);

  const handleDescribe = useCallback((description: string) => {
    const lower = description.toLowerCase();
    const matchedIndex = Object.entries(DESCRIBE_ALIASES).find(([, aliases]) =>
      aliases.some((alias) => lower.includes(alias))
    )?.[0];

    const match =
      matchedIndex !== undefined
        ? MOCK_RESULTS[Number(matchedIndex)]
        : MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
    setResult(match);
  }, []);

  const handleTookAction = useCallback(async () => {
    if (!result) return;
    await recordAction(result);
    setActionTaken(true);
  }, [result, recordAction]);

  const reset = useCallback(() => {
    setStatus("idle");
    setImage(null);
    setResult(null);
    setUploadError(null);
    setAnalysisError(null);
    setActionTaken(false);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      {status !== "result" && (
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-moss-900 sm:text-4xl">
            What are you throwing away?
          </h1>
          <p className="mt-2 text-ink/60">
            Upload a photo and we&rsquo;ll help you find the best 3R option.
          </p>
        </div>
      )}

      {status === "idle" && <UploadArea onFile={handleFile} error={uploadError} />}

      {status === "preview" && image && (
        <div className="mx-auto max-w-md text-center">
          <div className="organic-card overflow-hidden border border-moss-100 bg-white p-3 shadow-soft">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-moss-50">
              {/* Preview uses a plain img tag since it's a user-provided data URL */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Selected item to analyze"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="lg" onClick={runAnalysis}>
              Analyze Item
            </Button>
            <Button variant="ghost" size="lg" onClick={reset}>
              Choose a different photo
            </Button>
          </div>
        </div>
      )}

      {status === "analyzing" && <AnalyzingLoader />}

      {status === "result" && result && (
        <div>
          {analysisError && (
            <p
              role="status"
              className="mx-auto mb-6 max-w-lg rounded-2xl bg-soil-100/60 px-4 py-3 text-center text-sm text-soil-800"
            >
              {analysisError}
            </p>
          )}
          <ResultView
            result={result}
            onTookAction={handleTookAction}
            onScanAnother={reset}
            onDescribe={handleDescribe}
            actionTaken={actionTaken}
          />
        </div>
      )}
    </div>
  );
}
