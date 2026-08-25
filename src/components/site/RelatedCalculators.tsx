import { Link } from "@tanstack/react-router";
import { calculators, type CalcMeta } from "@/lib/calculators";

type Props = {
  currentSlug?: string;
  preferred?: string[];
  limit?: number;
  heading?: string;
  variant?: "compact" | "full";
  className?: string;
};

export function RelatedCalculators({
  currentSlug,
  preferred,
  limit = 4,
  heading = "Related Calculators",
  variant = "full",
  className,
}: Props) {
  const pool = calculators.filter((c) => c.slug !== currentSlug);
  let picked: CalcMeta[] = [];

  if (preferred && preferred.length) {
    picked = preferred
      .map((slug) => pool.find((c) => c.slug === slug))
      .filter((c): c is CalcMeta => Boolean(c));
  }
  for (const c of pool) {
    if (picked.length >= limit) break;
    if (!picked.find((p) => p.slug === c.slug)) picked.push(c);
  }
  picked = picked.slice(0, Math.max(3, Math.min(limit, 5)));

  return (
    <section className={className} aria-label={heading}>
      <h2 className="mb-4 text-lg font-bold tracking-tight md:text-2xl">{heading}</h2>
      {variant === "compact" ? (
        <div className="flex flex-wrap gap-2">
          {picked.map((c) => (
            <Link
              key={c.slug}
              to={c.path}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold transition-smooth hover:-translate-y-0.5 hover:border-primary hover:shadow-elegant"
            >
              <span aria-hidden>{c.emoji}</span>
              <span>{c.title}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {picked.map((c) => (
            <Link
              key={c.slug}
              to={c.path}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-smooth hover:-translate-y-0.5 hover:border-primary hover:shadow-elegant"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-lg text-primary-foreground">
                {c.emoji}
              </div>
              <div className="min-w-0">
                <div className="font-semibold leading-tight">{c.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{c.short}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
