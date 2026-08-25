import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { calculators, blogPosts } from "@/lib/calculators";
import { ArrowRight, Sparkles, Zap, Shield, Search } from "lucide-react";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalcHub — Free Online Calculators (BMI, Loan, GPA, Currency & More)" },
      { name: "description", content: "All-in-one hub of free online calculators: BMI, loan/EMI, GPA, age, percentage, profit & loss, tip, discount and currency. Fast, accurate, mobile-first." },
      { property: "og:title", content: "CalcHub — Free Online Calculators" },
      { property: "og:description", content: "Free, fast, accurate calculators for students and professionals. Used by 1M+ people worldwide." },
    ],
    links: [{ rel: "canonical", href: absUrl("/") }],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return calculators;
    return calculators.filter((c) =>
      [c.title, c.short, c.description, ...c.keywords].some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface text-surface-foreground">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" aria-hidden />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" aria-hidden />
        <div className="container-tight relative grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Used by 1M+ users worldwide
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Every calculator <br />
              you’ll <span className="bg-accent px-2 text-accent-foreground">ever need</span>.
            </h1>
            <p className="mt-5 max-w-lg text-base text-surface-foreground/75 md:text-lg">
              Free, lightning-fast tools for students, professionals and everyday math. No sign-up. No ads in your face. Just answers.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-smooth hover:scale-[1.02] hover:shadow-glow"
              >
                Open Calculator <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/gpa-calculator"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Try GPA Calculator
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 text-sm">
              <div><dt className="text-surface-foreground/60">Calculators</dt><dd className="text-2xl font-bold">{calculators.length}+</dd></div>
              <div><dt className="text-surface-foreground/60">Avg load</dt><dd className="text-2xl font-bold">{`<2s`}</dd></div>
              <div><dt className="text-surface-foreground/60">Cost</dt><dd className="text-2xl font-bold">$0</dd></div>
            </dl>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-elegant">
              <div className="grid grid-cols-2 gap-3">
                {calculators.slice(0, 4).map((c) => (
                  <Link
                    key={c.slug}
                    to={c.path}
                    className="group rounded-xl bg-white/5 p-4 transition-smooth hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="mt-2 font-semibold">{c.title}</div>
                    <div className="text-xs opacity-70">{c.short}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section id="all-calculators" className="container-tight py-16 md:py-20">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">All calculators</h2>
            <p className="mt-2 text-muted-foreground">Pick a tool and get an instant, accurate result.</p>
          </div>
          <Link to="/blog" className="hidden text-sm font-semibold underline-offset-4 hover:underline md:inline">
            Read the blog →
          </Link>
        </div>

        <div className="mb-8 max-w-md">
          <label className="relative block">
            <span className="sr-only">Search calculators</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search calculators (BMI, GPA, loan, tip…)"
              className="w-full rounded-full border border-input bg-background py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center text-sm text-muted-foreground">
            No calculator matches “{query}”. Try a different word — or{" "}
            <Link to="/contact" className="font-semibold text-foreground underline-offset-4 hover:underline">
              suggest a new tool
            </Link>.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Link
                key={c.slug}
                to={c.path}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:border-accent hover:shadow-elegant"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-smooth group-hover:bg-accent/40" aria-hidden />
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-2xl text-accent-foreground">{c.emoji}</div>
                <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Why */}
      <section className="bg-muted/40 py-16">
        <div className="container-tight grid gap-8 md:grid-cols-3">
          {[
            { i: <Zap className="h-5 w-5" />, t: "Instant results", d: "All math runs in your browser. No waiting, no reloads, no servers in the way." },
            { i: <Shield className="h-5 w-5" />, t: "Private by default", d: "Your inputs never leave your device. We don’t store your data." },
            { i: <Sparkles className="h-5 w-5" />, t: "Built for SEO & speed", d: "Lightweight, mobile-first, scoring 90+ on PageSpeed across all tools." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-border bg-background p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">{b.i}</div>
              <h3 className="mt-4 font-bold">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="container-tight py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">From the blog</h2>
          <Link to="/blog" className="text-sm font-semibold underline-offset-4 hover:underline">All posts →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:-translate-y-0.5 hover:border-accent hover:shadow-elegant"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.date}</div>
              <h3 className="mt-2 text-lg font-bold leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Read post <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
