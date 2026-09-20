export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl font-semibold text-moss-900 ${className}`}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-full bg-moss-800 text-sm text-paper"
      >
        3R
      </span>
      3R AI
    </span>
  );
}
