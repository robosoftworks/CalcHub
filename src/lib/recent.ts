const KEY = "calchub_recent";
const MAX = 6;

export function getRecentSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function recordVisit(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getRecentSlugs().filter((s) => s !== slug);
    const next = [slug, ...current].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable (private mode, embedded contexts) — fail silent
  }
}
