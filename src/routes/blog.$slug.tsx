import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { blogPosts, calculators } from "@/lib/calculators";
import { RelatedCalculators } from "@/components/site/RelatedCalculators";
import { absUrl } from "@/lib/site";

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
      links: [{ rel: "canonical", href: absUrl(`/blog/${post.slug}`) }],
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
          <Link to={calc.path} className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">Open calculator →</Link>
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
  "how-to-calculate-your-car-loan-emi-before-you-sign": () => (
    <>
      <p>Dealership financing is designed to be agreed to quickly, in a room built for it. The single best defense is knowing your real numbers before you sit down — not the monthly payment they'll offer, the one you calculate yourself.</p>
      <h2>Start with the EMI formula, not the dealer's number</h2>
      <p>Every EMI is <code>P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</code>, where P is what you're borrowing, r is your monthly rate, and n is the number of months. You don't need to compute this by hand — that's what the <Link to="/loan-calculator">Loan / EMI Calculator</Link> is for — but you should walk in already knowing roughly what to expect, so a dealer's "great deal" gets compared against your own number, not just their pitch.</p>
      <h2>Worked example: a $28,000 truck</h2>
      <p>At 7.2% APR over 6 years (72 months), the EMI comes out to roughly <strong>$480/month</strong>, with total interest of about <strong>$6,564</strong> over the life of the loan. Ask the dealer for the same loan at 5 years instead: the EMI rises to about $557/month, but total interest drops to roughly $5,430 — <strong>$1,135 cheaper</strong>, for about $77 more a month.</p>
      <h2>The trap: "we can get your payment down to $400"</h2>
      <p>When a monthly number is the only thing being negotiated, the lever being pulled is almost always tenure, not rate. A lower EMI achieved by stretching the loan longer is not a discount — it's more total interest, delivered in smaller monthly doses. Always ask "what's the total I'll pay?" alongside "what's the monthly payment?"</p>
      <h2>If you're financing a vehicle priced in a different currency</h2>
      <p>Importing a vehicle, or financing across a border, adds a second variable: exchange-rate risk on your down payment or any lump-sum transfer. The <Link to="/currency-converter">Currency Converter</Link> shows you the real mid-market rate — check it before wiring a deposit, since banks routinely quote 1–4% worse than the rate you'll see here, and on a large deposit that's real money before your loan has even started.</p>
      <h2>Before you sign</h2>
      <ol>
        <li>Get the price, rate, and tenure as three separate numbers — never accept a single bundled "monthly payment" quote.</li>
        <li>Run it through the <Link to="/loan-calculator">Loan / EMI Calculator</Link> yourself and compare at least two tenures.</li>
        <li>If a deposit crosses currencies, check the mid-market rate on the <Link to="/currency-converter">Currency Converter</Link> first.</li>
        <li>Ask specifically for the total interest paid over the full term — not just the EMI.</li>
      </ol>
    </>
  ),
  "bmi-vs-body-fat-which-number-actually-matters": () => (
    <>
      <p>Two people can have the exact same BMI and completely different health profiles. Here's why that happens, and which number is actually worth paying attention to for your goals.</p>
      <h2>The core problem with BMI</h2>
      <p>BMI is <code>weight ÷ height²</code> — full stop. It has no way to distinguish 20 lbs of muscle from 20 lbs of fat, because it never looks at composition at all, only total mass relative to height. That's not a flaw exactly — BMI was designed in the 1830s as a population-level statistical tool, not an individual diagnostic — but it's routinely used as if it were the latter.</p>
      <h2>A concrete comparison</h2>
      <p>Take two men, both 5'10" (178 cm) and 190 lbs (86 kg). Both get a BMI of <strong>27.2</strong> — solidly in the "Overweight" range on our <Link to="/bmi-calculator">BMI Calculator</Link>. One of them is a recreational runner carrying visible muscle and roughly 14% body fat. The other is largely sedentary at roughly 28% body fat. Identical BMI. Meaningfully different cardiovascular and metabolic risk. BMI cannot see the difference; it was never built to.</p>
      <h2>Where body fat % fills the gap</h2>
      <p>The <Link to="/body-fat-calculator">Body Fat % Calculator</Link> uses the U.S. Navy circumference method — waist, neck, and (for women) hip measurements — to estimate actual composition instead of just mass. It's not lab-grade precise (nothing short of a DEXA scan or hydrostatic weighing really is), but it's a genuinely different signal than BMI, and for most people it's a better proxy for "how much of my weight is fat."</p>
      <h2>So which one should you actually track?</h2>
      <ul>
        <li><strong>BMI</strong> is fastest and fine for a rough population-level check, or tracking a broad trend over months.</li>
        <li><strong>Body fat %</strong> is more informative for anyone strength training, losing weight while preserving muscle, or with an athletic build that skews BMI upward.</li>
        <li>Neither number tells you what to do about your weight — that's where the <Link to="/calorie-calculator">Calorie / TDEE Calculator</Link> comes in, translating your stats into an actual daily calorie target based on your goal and activity level.</li>
      </ul>
      <h2>The practical takeaway</h2>
      <p>Use BMI as a 10-second sanity check, use body fat % if you want a real read on composition, and use TDEE if you're actually trying to change either number. Tracking all three together, and re-checking every few weeks rather than daily, gives a far more honest picture than any single reading.</p>
    </>
  ),
  "stacked-discounts-dont-add-up-the-way-you-think": () => (
    <>
      <p>"Take an extra 20% off already-reduced items" sounds like it should combine with an existing 30% discount to make 50% off. It doesn't — and the actual math costs shoppers real money at checkout every day.</p>
      <h2>Why discounts multiply, not add</h2>
      <p>Each discount applies to whatever price is left after the previous one — not to the original price. Two discounts of 20% and 30% don't combine to 50% off; they combine to <code>1 − (0.80 × 0.70) = 44%</code> off. The gap between "sounds like 50%" and "is actually 44%" is small on a $20 item, but on a $1,200 furniture purchase it's a real $72 difference.</p>
      <h2>Worked example</h2>
      <p>A $340 jacket is marked 25% off, then an in-store coupon takes another 15% off the already-discounted price. First discount: $340 × 0.75 = $255. Second discount applies to $255, not $340: $255 × 0.85 = <strong>$216.75</strong>. The combined discount is <code>(340 − 216.75) / 340 = 36.25%</code> — not the 40% you'd get by naively adding 25% + 15%. Run either step through the <Link to="/discount-calculator">Discount Calculator</Link> to check your own stacked deals before checkout.</p>
      <h2>Now add sales tax — order matters here too</h2>
      <p>Tax is calculated on whatever the final price is after all discounts are applied, not on the original sticker price. Continuing the example: at 7% sales tax, the $216.75 final price becomes $231.92 — tax of $15.17. If a cashier mistakenly calculated tax on the original $340 instead, you'd be overcharged by nearly $9. The <Link to="/sales-tax-calculator">Sales Tax Calculator</Link> can quickly check whether a receipt's tax line matches the discounted subtotal it should be based on.</p>
      <h2>A second common trap: percentage-off vs. dollars-off comparisons</h2>
      <p>"$50 off" and "15% off" aren't directly comparable without doing the math — $50 off a $200 item (25% effective discount) beats 15% off the same item ($30), but $50 off a $600 item (8.3% effective) loses to 15% off ($90). Convert everything to a dollar amount before comparing two differently-formatted deals.</p>
      <h2>The takeaway</h2>
      <p>Multiply successive discount multipliers together (never add the percentages), apply tax last, and always convert "X% off" and "$Y off" into the same units before deciding which deal is actually better. When in doubt, the <Link to="/discount-calculator">Discount Calculator</Link> and <Link to="/sales-tax-calculator">Sales Tax Calculator</Link> take about 10 seconds to settle it definitively.</p>
    </>
  ),
};
