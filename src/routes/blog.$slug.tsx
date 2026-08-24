import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { blogPosts, calculators } from "@/lib/calculators";
import { RelatedCalculators } from "@/components/site/RelatedCalculators";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Article not found" }] };
    return {
      meta: [
        { title: `${post.title} | CalcHub Blog` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.date },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-tight py-20 text-center">
      <h1 className="text-3xl font-bold">Article not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-sm font-semibold underline">Back to blog</Link>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const calc = calculators.find((c) => c.slug === post.related);
  const Body = bodies[post.slug];
  const preferred = [post.related, ...(calc?.related ?? [])].filter(Boolean) as string[];

  return (
    <article className="container-tight py-12 md:py-16">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link to="/blog" className="hover:text-foreground">Blog</Link> <span className="mx-1">›</span>{" "}
        <span className="text-foreground">{post.title}</span>
      </nav>
      <header className="mb-6 max-w-3xl">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{post.date}</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>
      </header>

      <RelatedCalculators
        preferred={preferred}
        limit={5}
        variant="compact"
        heading="Related Calculators"
        className="mb-10"
      />

      {calc && (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Try the tool</div>
            <div className="text-lg font-bold">{calc.emoji} {calc.title}</div>
          </div>
          <Link to={calc.path} className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground hover:opacity-90">Open calculator →</Link>
        </div>
      )}

      <div className="prose prose-neutral max-w-3xl prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-a:text-foreground prose-a:underline-offset-4">
        {Body ? <Body /> : <p>Content coming soon.</p>}
      </div>

      <RelatedCalculators
        preferred={preferred}
        limit={5}
        variant="full"
        heading="Keep exploring — Related Calculators"
        className="mt-14"
      />
    </article>
  );
}

const bodies: Record<string, () => React.ReactElement> = {
  "how-to-calculate-gpa": () => (
    <>
      <p>Your GPA — Grade Point Average — is the single most cited number on most college applications. In this guide we break down exactly how it’s computed, the difference between weighted and unweighted scales, and how to project your GPA semester by semester.</p>
      <h2>The formula</h2>
      <p>GPA is a weighted average of grade points and credit hours: <code>GPA = Σ(grade × credits) / Σ(credits)</code>. Each letter grade maps to a number on the chosen scale.</p>
      <h2>Step-by-step example</h2>
      <ol>
        <li>List all your courses for the period.</li>
        <li>Look up the grade-point value for each letter grade on your scale (4.0 or 5.0).</li>
        <li>Multiply each course’s grade by its credit hours to get quality points.</li>
        <li>Sum quality points and credits.</li>
        <li>Divide quality points by credits.</li>
      </ol>
      <h2>Cumulative vs semester GPA</h2>
      <p>Semester GPA covers a single term; cumulative GPA covers your entire academic history. Schools usually report both. Boosting your cumulative GPA gets harder as you accumulate credits — every new term is a smaller proportion of the total.</p>
      <h2>Tools that help</h2>
      <p>Use our <Link to="/gpa-calculator">GPA Calculator</Link> to try this in seconds. Add as many subjects as you need and switch between 4.0 and 5.0 scales.</p>
      <h2>Common mistakes</h2>
      <ul>
        <li>Confusing credit hours with course count.</li>
        <li>Mixing weighted and unweighted scales between semesters.</li>
        <li>Forgetting to include withdrawn courses where school policy requires it.</li>
      </ul>
    </>
  ),
  "age-calculator-explained": () => (
    <>
      <p>An age calculator looks like a one-line subtraction, but real calendars make it surprisingly nuanced. This guide explains the math behind your exact age, why month lengths matter, and how to count days lived precisely.</p>
      <h2>Years, months, days — the right way</h2>
      <p>Start with year and month differences. If today’s day-of-month is earlier than your birth day, borrow one month and use the previous month’s length to compute remaining days. This handles February and leap years naturally.</p>
      <h2>Days lived</h2>
      <p>For totals like “days lived”, just compute the millisecond difference between the two dates and divide by 86,400,000. JavaScript handles all calendar oddities automatically.</p>
      <h2>Try it</h2>
      <p>Open our <Link to="/age-calculator">Age Calculator</Link> and enter any date of birth. You’ll instantly see your age plus your next birthday.</p>
      <h2>Cultural variations</h2>
      <p>South Korea historically counted everyone as age 1 at birth and added a year every January 1. Many Asian astrology systems still use lunar calendars. We use the universal Western convention here.</p>
    </>
  ),
  "percentage-formula-made-easy": () => (
    <>
      <p>If percentages feel slippery, you’re not alone. The trick is to memorize one formula — <strong>part / whole × 100</strong> — and re-derive everything else from it.</p>
      <h2>The five percentage problems</h2>
      <ol>
        <li><strong>X% of Y</strong>: Y × X/100.</li>
        <li><strong>X is what % of Y</strong>: X/Y × 100.</li>
        <li><strong>Percent increase</strong>: (new − old)/old × 100.</li>
        <li><strong>Percent decrease</strong>: same formula; result is negative.</li>
        <li><strong>Discount price</strong>: original × (1 − discount/100).</li>
      </ol>
      <h2>Reverse percentages</h2>
      <p>If something costs $90 after a 25% discount, the original price is 90 / 0.75 = $120. Always divide by (1 − rate), not multiply by (1 + rate).</p>
      <h2>Try it</h2>
      <p>Use our <Link to="/percentage-calculator">Percentage Calculator</Link> — it has all five cases in tabs.</p>
      <h2>Real-life uses</h2>
      <p>Tips, taxes, sales, raises, growth rates, exam scores, mortgage rates — once you see the pattern, percentages are everywhere.</p>
    </>
  ),
  "profit-and-loss-formula-guide": () => (
    <>
      <p>Pricing a product wrong is one of the fastest ways to kill a small business. This guide explains profit, loss, margin and markup so you never accidentally undercharge again.</p>
      <h2>The basic formulas</h2>
      <p><code>Profit = Selling Price − Cost Price</code>. Express it as a % of cost (markup) or % of selling price (margin).</p>
      <h2>Margin vs markup</h2>
      <p>A 50% markup is a 33.3% margin. A 100% markup is a 50% margin. Always confirm which one your customer or vendor is quoting.</p>
      <h2>Hidden costs</h2>
      <p>Don’t forget shipping, payment processing, returns, packaging and marketing. Add them to your cost price for an honest profit number.</p>
      <h2>Try it</h2>
      <p>Open the <Link to="/profit-loss-calculator">Profit & Loss Calculator</Link> to model your pricing in seconds.</p>
    </>
  ),
  "currency-exchange-explained": () => (
    <>
      <p>Why does the rate your bank offers differ from what you see on Google? The short answer is the spread. Here’s how forex pricing actually works.</p>
      <h2>Mid-market rate</h2>
      <p>The mid-market rate is the midpoint between the wholesale buy and sell prices. It’s the cleanest number — and the one you should benchmark against.</p>
      <h2>How banks make money</h2>
      <p>Banks add a margin (usually 1–4%) on top of the mid-market rate. They may also charge fixed wire fees, plus the receiving bank often takes a cut.</p>
      <h2>Smart conversion tips</h2>
      <ul>
        <li>For large transfers, compare a multi-currency app to your bank.</li>
        <li>Avoid airport currency exchanges — spreads can exceed 10%.</li>
        <li>Always pay in the local currency when using a card abroad to avoid Dynamic Currency Conversion (DCC) fees.</li>
      </ul>
      <h2>Try it</h2>
      <p>Use our <Link to="/currency-converter">Currency Converter</Link> for the live mid-market rate before any transaction.</p>
    </>
  ),
};
