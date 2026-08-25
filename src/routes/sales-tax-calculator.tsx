import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/sales-tax-calculator")({
  head: () => ({
    meta: [
      { title: "Sales Tax Calculator — Tax Amount & Reverse Tax | CalcHub" },
      { name: "description", content: "Free sales tax calculator. Find the tax amount and total price, or work backward from a total to find the pre-tax price." },
      { property: "og:title", content: "Sales Tax Calculator" },
      { property: "og:description", content: "Calculate sales tax forward or in reverse from a tax-included total." },
    ],
    links: [{ rel: "canonical", href: absUrl("/sales-tax-calculator") }],
  }),
  component: SalesTaxPage,
});

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function SalesTaxPage() {
  const [mode, setMode] = useState<"forward" | "reverse">("forward");
  const [price, setPrice] = useState(100);
  const [total, setTotal] = useState(108);
  const [rate, setRate] = useState(8);

  const result = useMemo(() => {
    const r = Math.max(0, rate) / 100;
    if (mode === "forward") {
      const p = Math.max(0, price);
      const tax = p * r;
      return { preTax: p, tax, total: p + tax };
    }
    const t = Math.max(0, total);
    const preTax = t / (1 + r);
    return { preTax, tax: t - preTax, total: t };
  }, [mode, price, total, rate]);

  return (
    <CalcLayout
      slug="sales-tax-calculator"
      title="Sales Tax Calculator"
      tagline="Calculate sales tax on a purchase, or find the pre-tax price from a tax-included total."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {(["forward", "reverse"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-smooth ${mode === m ? "bg-accent text-accent-foreground" : "border border-border bg-card hover:bg-secondary"}`}
          >
            {m === "forward" ? "Price → total" : "Total → price"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "forward" ? (
          <Field label="Price before tax"><input type="number" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} className={cls()} /></Field>
        ) : (
          <Field label="Total (tax included)"><input type="number" value={total || ""} onChange={(e) => setTotal(Number(e.target.value))} className={cls()} /></Field>
        )}
        <Field label="Sales tax rate (%)"><input type="number" step="0.01" value={rate || ""} onChange={(e) => setRate(Number(e.target.value))} className={cls()} /></Field>
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
        <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Total price</div>
        <div className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">{fmt(result.total)}</div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm">
          <div><div className="text-surface-foreground/60">Pre-tax price</div><div className="text-lg font-semibold">{fmt(result.preTax)}</div></div>
          <div><div className="text-surface-foreground/60">Tax amount</div><div className="text-lg font-semibold">{fmt(result.tax)}</div></div>
        </div>
        <ResultActions
          text={`Pre-tax ${fmt(result.preTax)} + ${rate}% tax (${fmt(result.tax)}) = ${fmt(result.total)}`}
          title="Sales tax"
          onReset={() => { setPrice(100); setTotal(108); setRate(8); }}
        />
      </div>
    </CalcLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>;
}
function cls() { return "w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"; }

const faqs = [
  { q: "What's the difference between the two modes?", a: "'Price → total' takes a pre-tax price and adds tax on top. 'Total → price' does the reverse: given a tax-included total (like a receipt), it works backward to find the original pre-tax price — useful for expense reports or verifying a receipt." },
  { q: "How is the reverse calculation different from just subtracting the tax rate?", a: "You can't simply subtract the tax percentage from the total — e.g. subtracting 8% from a $108 total gives $99.36, which is wrong. The correct formula divides the total by (1 + rate), which gives the exact original $100." },
  { q: "What sales tax rate should I use?", a: "Sales tax varies by country, state/province and sometimes city or county — there's no single 'default' rate. Check your local government or receipt for the exact combined rate that applies to your purchase." },
  { q: "Does this handle tax-exempt items or multiple tax rates?", a: "No — it assumes a single flat rate applied to the full price. Many regions have different rates for groceries, luxury goods or services; calculate those separately if your purchase mixes categories." },
  { q: "Can I use this for VAT instead of US-style sales tax?", a: "Yes — the math is identical. VAT is typically already included in the displayed price, so use 'Total → price' mode to see the VAT-exclusive amount and the VAT itself." },
];

function Article() {
  return (
    <>
      <h2>How sales tax calculations work</h2>
      <p>
        Sales tax is a percentage added to the price of goods or services at the point of sale. The math
        looks trivial for the forward direction, but working backward from a tax-included total trips
        people up more often than you'd expect.
      </p>
      <h3>Forward: price to total</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">tax = price × rate
total = price + tax</pre>
      <p>
        A $100 item with 8% sales tax: tax = $100 × 0.08 = $8, total = $108.
      </p>
      <h3>Reverse: total to price</h3>
      <p>
        Given only the final $108 total, you cannot just subtract 8% of $108 ($8.64) — that overstates the
        tax, because 8% of the total isn't the same as 8% of the pre-tax price. Instead:
      </p>
      <pre className="rounded-md bg-muted p-3 text-sm">price = total ÷ (1 + rate)
tax = total − price</pre>
      <p>
        $108 ÷ 1.08 = $100 exactly, and the tax is $108 − $100 = $8 — matching the forward calculation.
      </p>
      <h3>Why sales tax rates vary so much</h3>
      <p>
        In the US, sales tax is set at the state level and often layered with county and city taxes, so
        combined rates range from 0% (several states have no sales tax) to over 10% in some cities. Many
        countries instead use VAT (Value Added Tax), which is usually already baked into the displayed
        price rather than added at checkout.
      </p>
      <h3>Common uses</h3>
      <ul>
        <li>Budgeting the real cost of a purchase before checkout.</li>
        <li>Reconciling a business expense receipt to find the deductible pre-tax amount.</li>
        <li>Comparing prices across regions with different tax rates.</li>
      </ul>
    </>
  );
}
