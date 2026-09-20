"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/scan", label: "Scan", icon: ScanIcon },
  { href: "/impact", label: "My Impact", icon: ImpactIcon },
  { href: "/learn", label: "Learn", icon: LearnIcon },
];

export function Nav() {
  const pathname = usePathname();
  const { user, isConfigured, signIn, signOut, loading } = useAuth();

  return (
    <>
      {/* Desktop top nav */}
      <header className="sticky top-0 z-40 hidden border-b border-moss-100 bg-paper/90 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" aria-label="3R AI home">
            <Logo />
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-moss-800 text-paper"
                      : "text-ink/70 hover:bg-moss-50 hover:text-moss-800"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div>
            {!isConfigured ? (
              <span className="rounded-full bg-soil-100 px-3 py-1.5 text-xs font-medium text-soil-700">
                Demo mode
              </span>
            ) : loading ? (
              <span className="text-sm text-ink/50">Loading…</span>
            ) : user ? (
              <button
                onClick={signOut}
                className="rounded-full border border-moss-200 px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-moss-50"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={signIn}
                className="rounded-full bg-moss-800 px-4 py-2 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5 hover:bg-moss-700"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-moss-100 bg-paper/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-medium"
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    active ? "text-moss-700" : "text-ink/40"
                  }`}
                />
                <span className={active ? "text-moss-800" : "text-ink/50"}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ScanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M18 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M6 20H4a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function ImpactIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 20V11M12 20V4M20 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LearnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 6.5c-1.6-1.3-3.9-2-6.5-2v11c2.6 0 4.9.7 6.5 2 1.6-1.3 3.9-2 6.5-2v-11c-2.6 0-4.9.7-6.5 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6.5v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
