import { ThreeRAction } from "./types";

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export const ACTION_META: Record<
  ThreeRAction,
  { label: string; icon: string; color: string; bg: string }
> = {
  reduce: { label: "Reduce", icon: "🟢", color: "text-moss-700", bg: "bg-moss-100" },
  reuse: { label: "Reuse", icon: "🔵", color: "text-soil-700", bg: "bg-soil-100" },
  recycle: { label: "Recycle", icon: "♻️", color: "text-moss-800", bg: "bg-moss-100" },
};

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
