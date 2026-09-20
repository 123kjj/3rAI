"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/Button";
import { StatCard } from "@/components/StatCard";
import { TipCard } from "@/components/TipCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { useImpact } from "@/context/ImpactContext";
import { DAILY_TIPS } from "@/lib/mockData";

export default function HomePage() {
  const { stats, isDemo } = useImpact();

  // Computing this from `new Date()` directly during render caused a
  // React hydration mismatch in production: Vercel can statically
  // pre-render this page at build time, so the server-rendered HTML's
  // date and the client's live date can disagree (even just by crossing
  // midnight), producing "today's date changed" hydration errors.
  // Fix: render a fixed value on both the server and the first client
  // pass (index 0), then update it client-side only after mount.
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    setTipIndex(new Date().getDate() % DAILY_TIPS.length);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-14 sm:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-blob bg-moss-100 sm:h-96 sm:w-96"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-blob bg-soil-100/70"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-moss-900 sm:text-6xl">
            Before you throw
            <br />
            it away, ask why.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
            Snap a photo. Discover your best environmental option. Take action.
            3R AI helps you decide whether everyday items should be reduced,
            reused, or recycled.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/scan" size="lg" variant="primary">
              Scan an Item
            </LinkButton>
            <LinkButton href="/learn" size="lg" variant="secondary">
              Learn the 3Rs
            </LinkButton>
          </div>
          <p className="mt-4 text-sm text-ink/50">
            Reduce. Reuse. Recycle. Make your next choice count.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-10 px-6 pb-16">
        {/* Your Impact */}
        <section aria-labelledby="your-impact-heading">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="your-impact-heading" className="font-display text-2xl font-semibold text-moss-900">
              Your Impact
            </h2>
            {isDemo && (
              <span className="text-xs font-medium text-soil-700">Demo data</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard value={stats.reusedCount} label="Items Reused" icon="🔵" />
            <StatCard value={stats.recycledCount} label="Items Recycled" icon="♻️" />
            <StatCard value={stats.reducedCount} label="Items Reduced" icon="🟢" />
          </div>
        </section>

        {/* Today's tip */}
        <section aria-label="Today's 3R tip">
          <TipCard tip={DAILY_TIPS[tipIndex]} />
        </section>

        {/* Challenge */}
        <section aria-label="7-day 3R challenge">
          <ChallengeCard day={stats.challengeDay} />
        </section>
      </div>
    </div>
  );
}
