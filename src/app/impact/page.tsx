"use client";

import { StatCard } from "@/components/StatCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import { RecentActionItem } from "@/components/RecentActionItem";
import { useImpact } from "@/context/ImpactContext";
import { useAuth } from "@/context/AuthContext";
import { ACHIEVEMENTS } from "@/lib/mockData";
import { LinkButton } from "@/components/Button";

export default function ImpactPage() {
  const { stats, actions, isDemo } = useImpact();
  const { isConfigured, signIn } = useAuth();

  const journeyTotal = Math.max(
    stats.reducedCount + stats.reusedCount + stats.recycledCount,
    1
  );
  const journeySegments = [
    { key: "reduced", value: stats.reducedCount, color: "bg-moss-600", label: "Reduced" },
    { key: "reused", value: stats.reusedCount, color: "bg-soil-500", label: "Reused" },
    { key: "recycled", value: stats.recycledCount, color: "bg-moss-400", label: "Recycled" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-moss-900 sm:text-4xl">
        My 3R Impact
      </h1>

      {isDemo && (
        <div className="mt-4 organic-card border border-soil-300/60 bg-soil-100/40 p-4 text-sm text-soil-900">
          {isConfigured ? (
            <p>
              You&rsquo;re viewing demo data.{" "}
              <button onClick={signIn} className="font-semibold underline underline-offset-2">
                Sign in with Google
              </button>{" "}
              to save your real progress.
            </p>
          ) : (
            <p>
              You&rsquo;re viewing demo data. Connect Firebase to let people save
              their real progress across visits.
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard value={stats.totalActions} label="Items Saved" icon="🌎" />
        <StatCard value={stats.reusedCount} label="Reused" icon="🔵" />
        <StatCard value={stats.recycledCount} label="Recycled" icon="♻️" />
        <StatCard value={stats.reducedCount} label="Reduced" icon="🟢" />
      </div>

      {/* Journey */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-moss-900">
          My 3R Journey
        </h2>
        <div className="organic-card mt-4 border border-moss-100 bg-white p-6 shadow-soft">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-moss-50">
            {journeySegments.map((seg) => (
              <div
                key={seg.key}
                className={`${seg.color} h-full transition-[width] duration-700`}
                style={{ width: `${(seg.value / journeyTotal) * 100}%` }}
                title={`${seg.label}: ${seg.value}`}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {journeySegments.map((seg) => (
              <span key={seg.key} className="flex items-center gap-2 text-ink/70">
                <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${seg.color}`} />
                {seg.label}: {seg.value}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-moss-900">
          Achievements
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACHIEVEMENTS.map((a) => (
            <AchievementBadge key={a.id} achievement={a} stats={stats} />
          ))}
        </div>
      </section>

      {/* Recent actions */}
      <section className="mt-10 pb-8">
        <h2 className="font-display text-xl font-semibold text-moss-900">
          Recent Actions
        </h2>
        <div className="organic-card mt-4 border border-moss-100 bg-white px-5 py-2 shadow-soft">
          {actions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-ink/60">
                No actions yet — scan your first item to start your journey.
              </p>
              <LinkButton href="/scan" variant="secondary" size="md" className="mt-4">
                Scan an Item
              </LinkButton>
            </div>
          ) : (
            <ul>
              {actions.map((action) => (
                <RecentActionItem key={action.id} action={action} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
