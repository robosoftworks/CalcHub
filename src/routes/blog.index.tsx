import { createFileRoute, Link } from "@tanstack/react-router";
import { blogPosts, calculators } from "@/lib/calculators";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "CalcHub Blog — Calculator Guides, Formulas & Tutorials" },
      { name: "description", content: "Step-by-step guides on GPA, percentages, profit & loss, currency exchange and more — written by the team behind CalcHub." },
      { property: "og:title", content: "CalcHub Blog — Guides & Tutorials" },
      { property: "og:description", content: "Long-form guides for every CalcHub calculator." },
    ],
    links: [{ rel: "canonical", href: absUrl("/blog") }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="container-tight py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">CalcHub Blog</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Practical guides and worked examples to help you get the most out of every calculator.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {blogPosts.map((p) => {
          const calc = calculators.find((c) => c.slug === p.related);
          return (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:border-accent hover:shadow-elegant"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.date} · {calc?.title}</div>
              <h2 className="mt-2 text-xl font-bold leading-snug">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-foreground underline-offset-4 group-hover:underline">Read article →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
