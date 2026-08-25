import { createFileRoute, Link } from "@tanstack/react-router";
import { calculators, blogPosts } from "@/lib/calculators";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — All Calculators & Blog Posts | CalcHub" },
      { name: "description", content: "Browse every CalcHub calculator and blog post in one place. Quick links to GPA, age, percentage, profit & loss, currency tools and tutorials." },
      { property: "og:title", content: "CalcHub Sitemap — All Pages" },
      { property: "og:description", content: "Complete index of CalcHub calculators, guides and blog posts." },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: absUrl("/sitemap") }],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  return (
    <div className="container-tight py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">›</span>{" "}
          <span className="text-foreground">Sitemap</span>
        </nav>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Site Map</h1>
        <p className="mt-3 text-muted-foreground">
          A bird’s-eye view of every calculator, guide and page on CalcHub. Use this hub to jump to any
          tool — and discover related calculators you didn’t know we had.
        </p>
      </header>

      {/* Calculators */}
      <section aria-labelledby="calculators-heading" className="mb-14">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 id="calculators-heading" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            All Calculators <span className="text-muted-foreground">({calculators.length})</span>
          </h2>
          <Link to="/" className="hidden text-sm font-semibold underline-offset-4 hover:underline md:inline">Back to home →</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c) => {
            const related = calculators.filter((r) => r.slug !== c.slug).slice(0, 3);
            return (
              <article key={c.slug} className="group rounded-2xl border border-border bg-card p-5 transition-smooth hover:-translate-y-0.5 hover:border-accent hover:shadow-elegant">
                <Link to={c.path} className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-xl text-accent-foreground">{c.emoji}</div>
                  <div className="min-w-0">
                    <h3 className="font-bold leading-tight">{c.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  </div>
                </Link>

                <div className="mt-4 border-t border-border pt-3">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Related calculators</div>
                  <ul className="flex flex-wrap gap-1.5">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          to={r.path}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium hover:border-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          <span aria-hidden>{r.emoji}</span> {r.title.replace(" Calculator", "").replace(" Converter", "")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Blog */}
      <section aria-labelledby="blog-heading" className="mb-14">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 id="blog-heading" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Blog & Guides <span className="text-muted-foreground">({blogPosts.length})</span>
          </h2>
          <Link to="/blog" className="hidden text-sm font-semibold underline-offset-4 hover:underline md:inline">All posts →</Link>
        </div>

        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {blogPosts.map((p) => {
            const calc = calculators.find((c) => c.slug === p.related);
            return (
              <li key={p.slug} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.date}</div>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="mt-0.5 block font-semibold leading-tight underline-offset-4 hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.excerpt}</p>
                </div>
                {calc && (
                  <Link
                    to={calc.path}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground hover:opacity-90"
                  >
                    Try {calc.emoji} {calc.title.replace(" Calculator", "").replace(" Converter", "")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Other pages */}
      <section aria-labelledby="pages-heading" className="mb-14">
        <h2 id="pages-heading" className="mb-5 font-display text-2xl font-bold tracking-tight md:text-3xl">Site pages</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/" as const, t: "Home", d: "Calculator hub & featured tools" },
            { to: "/blog" as const, t: "Blog", d: "Long-form guides & tutorials" },
            { to: "/about" as const, t: "About CalcHub", d: "Our mission and team" },
            { to: "/contact" as const, t: "Contact", d: "Suggest tools or report bugs" },
            { to: "/privacy" as const, t: "Privacy Policy", d: "How we handle your data" },
            { to: "/terms" as const, t: "Terms & Conditions", d: "Legal terms of use" },
          ].map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-smooth hover:border-accent hover:bg-secondary"
            >
              <div>
                <div className="font-semibold">{p.t}</div>
                <div className="text-xs text-muted-foreground">{p.d}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* Machine-readable hint */}
      <aside className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        🤖 Looking for the XML version for search engines? See{" "}
        <a href="/sitemap.xml" className="font-semibold text-foreground underline-offset-4 hover:underline">/sitemap.xml</a>.
      </aside>

      <SitemapJsonLd />
    </div>
  );
}

function SitemapJsonLd() {
  const items = [
    ...calculators.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: absUrl(c.path),
    })),
    ...blogPosts.map((p, i) => ({
      "@type": "ListItem",
      position: calculators.length + i + 1,
      name: p.title,
      url: absUrl(`/blog/${p.slug}`),
    })),
  ];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "CalcHub Sitemap",
        itemListElement: items,
      }}
    />
  );
}
