import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { calculators } from "@/lib/calculators";
import { AdSlot } from "./AdSlot";
import { RelatedCalculators } from "./RelatedCalculators";
import { JsonLd } from "./JsonLd";
import { absUrl } from "@/lib/site";
import { recordVisit } from "@/lib/recent";

type Props = {
  slug: string;
  title: string;
  tagline: string;
  children: React.ReactNode;
  article: React.ReactNode;
  faqs: { q: string; a: string }[];
};

export function CalcLayout({ slug, title, tagline, children, article, faqs }: Props) {
  const current = calculators.find((c) => c.slug === slug);
  const preferred = current?.related ?? [];

  useEffect(() => {
    recordVisit(slug);
  }, [slug]);

  return (
    <div className="container-tight py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1" aria-hidden="true">›</span>{" "}
        <span aria-current="page" className="text-foreground">{title}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{tagline}</p>
      </header>

      <RelatedCalculators
        currentSlug={slug}
        preferred={preferred}
        limit={5}
        variant="compact"
        heading="You may also like"
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <main>
          <AdSlot label="Advertisement" className="mt-0 mb-6" />

          <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant md:p-8">
            {children}
          </div>

          <AdSlot label="Sponsored" />

          <article className="prose prose-neutral mt-4 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-a:text-foreground prose-a:underline-offset-4">
            {article}
          </article>

          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              {faqs.map((f, i) => (
                <details key={i} className="group p-4 open:bg-muted/40">
                  <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                    <span className="mr-2 text-accent-foreground">▸</span>{f.q}
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedCalculators
            currentSlug={slug}
            preferred={preferred}
            limit={5}
            variant="full"
            heading="Related Calculators"
            className="mt-12"
          />
        </main>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">All tools</h3>
            <ul className="space-y-1">
              {calculators.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={c.path}
                    activeProps={{ className: "bg-accent text-accent-foreground" }}
                    className="block rounded-md px-2.5 py-1.5 text-sm hover:bg-secondary"
                  >
                    {c.emoji} {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <AdSlot label="Sidebar Ad" className="min-h-[250px]" />
        </aside>
      </div>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
              { "@type": "ListItem", position: 2, name: title, item: absUrl(`/${slug}`) },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: title,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            url: absUrl(`/${slug}`),
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
        ]}
      />
    </div>
  );
}
