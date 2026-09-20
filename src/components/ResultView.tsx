"use client";

import { useState } from "react";
import { AnalyzeItemResult, ThreeRAction } from "@/lib/types";
import { Button } from "./Button";
import { LocationCheck } from "./LocationCheck";
import { ReuseIdeas } from "./ReuseIdeas";

const CARD_META: Record<
  ThreeRAction,
  { title: string; icon: string; accent: string }
> = {
  reduce: { title: "Reduce", icon: "🟢", accent: "border-moss-300 bg-moss-50" },
  reuse: { title: "Reuse", icon: "🔵", accent: "border-soil-300 bg-soil-100/50" },
  recycle: { title: "Recycle", icon: "♻️", accent: "border-moss-300 bg-moss-50" },
};

interface ResultViewProps {
  result: AnalyzeItemResult;
  onTookAction: () => void;
  onScanAnother: () => void;
  onDescribe: (description: string) => void;
  actionTaken: boolean;
}

export function ResultView({
  result,
  onTookAction,
  onScanAnother,
  onDescribe,
  actionTaken,
}: ResultViewProps) {
  const [description, setDescription] = useState("");

  if (result.uncertain) {
    return (
      <div className="organic-card mx-auto max-w-lg border border-moss-100 bg-white p-8 text-center shadow-soft">
        <span aria-hidden className="text-4xl">
          🤔
        </span>
        <h2 className="mt-3 font-display text-2xl font-semibold text-moss-900">
          We&rsquo;re not completely sure what this item is.
        </h2>
        <p className="mt-2 text-sm text-ink/60">
          Could you describe it in a few words? For example, &ldquo;a foam
          takeout container&rdquo; or &ldquo;a broken phone charger.&rdquo;
        </p>
        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (description.trim()) onDescribe(description.trim());
          }}
        >
          <label htmlFor="describe-input" className="sr-only">
            Describe the item
          </label>
          <input
            id="describe-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item…"
            className="flex-1 rounded-full border border-moss-200 px-4 py-2.5 text-sm focus:border-moss-500"
          />
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </form>
        <button
          onClick={onScanAnother}
          className="mt-4 text-sm font-medium text-ink/50 underline-offset-2 hover:text-moss-800 hover:underline"
        >
          Try a different photo instead
        </button>
      </div>
    );
  }

  const order: ThreeRAction[] = ["reduce", "reuse", "recycle"];
  const adviceMap: Record<ThreeRAction, string> = {
    reduce: result.reduceAdvice,
    reuse: result.reuseAdvice,
    recycle: result.recycleAdvice,
  };
  const best = CARD_META[result.bestAction];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Item header */}
      <div className="animate-rise-in text-center">
        <h2 className="font-display text-3xl font-semibold text-moss-900">
          {result.itemName}
        </h2>
        <p className="mt-1 text-sm text-ink/60">{result.category}</p>
      </div>

      {/* Best choice banner */}
      <div
        className="animate-rise-in organic-card border-2 border-moss-300 bg-white p-6 text-center shadow-lift sm:p-8"
        style={{ animationDelay: "80ms" }}
      >
        <p className="text-sm font-medium text-ink/50">Best choice</p>
        <p className="mt-1 font-display text-3xl font-semibold text-moss-900">
          {best.icon} {best.title}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
          {result.explanation}
        </p>
        {typeof result.confidence === "number" && (
          <p className="mt-3 text-xs text-ink/40">
            {Math.round(result.confidence * 100)}% confidence
          </p>
        )}
      </div>

      {/* Three cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {order.map((action, i) => {
          const meta = CARD_META[action];
          const isBest = action === result.bestAction;
          return (
            <div
              key={action}
              className={`animate-rise-in organic-card border-2 p-5 ${meta.accent} ${
                isBest ? "ring-2 ring-moss-600 ring-offset-2 ring-offset-paper" : ""
              }`}
              style={{ animationDelay: `${160 + i * 90}ms` }}
            >
              <p className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                <span aria-hidden>{meta.icon}</span> {meta.title}
              </p>
              <p className="mt-2 text-sm text-ink/70">{adviceMap[action]}</p>
            </div>
          );
        })}
      </div>

      <LocationCheck
        warning={result.localRuleWarning}
        item={result.itemName}
        category={result.category}
      />
      <ReuseIdeas ideas={result.reuseIdeas} />

      {/* Environmental impact footnote */}
      {result.environmentalImpact && (
        <p className="text-center text-sm text-ink/50">
          🌎 {result.environmentalImpact}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={onTookAction}
          disabled={actionTaken}
        >
          {actionTaken ? "✓ Action saved" : "I Took Action"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={onScanAnother}
        >
          Scan Another Item
        </Button>
      </div>
    </div>
  );
}
