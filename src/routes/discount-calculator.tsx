import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/discount-calculator")({
  head: () => ({
    meta: [
      { title: "Discount Calculator — Sale Price & Savings | CalcHub" },
      { name: "description", content: "Free discount calculator. Find sale price and savings from a percent off, or calculate the discount % from original and sale prices." },
      { property: "og:title", content: "Discount Calculator — Sale Price" },
      { property: "og:description", content: "Find what you save and what you pay during any sale." },
    ],
    links: [{ rel: "canonical", href: absUrl("/discount-calculator") }],
  }),
  component: DiscountPage,
});

type Mode = "percent" | "reverse";

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function DiscountPage() {
  const [mode, setMode] = useState<Mode>("percent");
  const [original, setOriginal] = useState(100);
  const [percent, setPercent] = useState(20);
  const [sale, setSale] = useState(80);

  const result = useMemo(() => {
    if (mode === "percent") {
      const savings = (original * percent) / 100;
      return { sale: original - savings, savings, percent };
    }
    const savings = original - sale;
    const pct = original > 0 ? (savings / original) * 100 : 0;
    return { sale, savings, percent: pct };
  }, [mode, original, percent, sale]);

  return (
    <CalcLayout
      slug="discount-calculator"
      title="Discount Calculator"
      tagline="Calculate the sale price and your savings — or work out the discount percentage from two prices."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md space-y-5">
        <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
          {(["percent", "reverse"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-smooth ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >{m === "percent" ? "% off → price" : "Two prices → %"}</button>
          ))}
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">Original price</span>
          <input
            type="number" inputMode="decimal" value={original || ""}
            onChange={(e) => setOriginal(Number(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
          />
        </label>

        {mode === "percent" ? (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Discount %</span>
              <span className="text-sm font-bold">{percent}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full primary-[oklch(0.89_0.18_100)]"
            />
          </div>
        ) : (
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Sale price</span>
            <input
              type="number" inputMode="decimal" value={sale || ""}
              onChange={(e) => setSale(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
            />
          </label>
        )}

        <div className="rounded-xl bg-surface p-5 text-surface-foreground">
          <div className="text-xs uppercase tracking-wider text-surface-foreground/60">You pay</div>
          <div className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">{fmt(result.sale)}</div>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm">
            <div>
              <div className="text-surface-foreground/60">{result.savings >= 0 ? "You save" : "Price increase"}</div>
              <div className="text-lg font-semibold">{fmt(Math.abs(result.savings))}</div>
            </div>
            <div>
              <div className="text-surface-foreground/60">{result.percent >= 0 ? "Discount" : "Markup"}</div>
              <div className="text-lg font-semibold">{fmt(Math.abs(result.percent))}%</div>
            </div>
          </div>
        </div>

        <ResultActions
          text={`${fmt(original)} − ${fmt(result.percent)}% = ${fmt(result.sale)} (save ${fmt(result.savings)})`}
          title="Discount"
          onReset={() => { setMode("percent"); setOriginal(100); setPercent(20); setSale(80); }}
        />
      </div>
    </CalcLayout>
  );
}

const faqs = [
  { q: "What’s the difference between Percent mode and Reverse mode?", a: "Percent mode takes Original price + Discount % and outputs the Sale price and Savings. Reverse mode takes Original price + Sale price and outputs the implied Discount %." },
  { q: "How do I find the sale price from a percent off?", a: "Stay on the Percent tab, enter the Original price (e.g. 100) and the Discount % (e.g. 20). The calculator returns Sale = 80 and Savings = 20 using Sale = Original × (1 − %/100)." },
  { q: "How do I find the discount % when I only know the two prices?", a: "Switch to the Reverse tab and enter Original and Sale. The calculator computes Discount % = ((Original − Sale) ÷ Original) × 100 — useful for verifying advertised offers." },
  { q: "Does the Savings output include sales tax or VAT?", a: "No. All three fields (Original, Sale, Savings) are pre-tax. Most jurisdictions calculate tax on the discounted Sale price, so add it on top of the result if needed." },
  { q: "Can I model two stacked discounts in one go?", a: "Not in a single step. Run Percent mode once with the first %, then re-enter the Sale output as the new Original and apply the second %. Stacked 20% + 10% gives 28% total off, not 30%." },
];

function Article() {
  return (
    <>
      <h2>How the discount calculator works</h2>
      <p>
        Whether you’re shopping a Black Friday sale or comparing two coupon codes, the discount calculator
        instantly shows you the sale price, your savings and the effective discount percentage.
      </p>
      <h3>The discount formula</h3>
      <p>
        Sale price = <code>Original × (1 − discount ÷ 100)</code>. For example, 25% off a $80 item is{" "}
        <code>80 × 0.75 = $60</code>, with savings of $20.
      </p>
      <h3>Reverse: finding the % discount</h3>
      <p>
        If you know both the original and sale prices, the percentage off is{" "}
        <code>((Original − Sale) ÷ Original) × 100</code>. A jacket reduced from $120 to $90 is{" "}
        <code>(30 ÷ 120) × 100 = 25%</code> off.
      </p>
      <h3>Stacking coupons correctly</h3>
      <p>
        Two consecutive 10% discounts don’t equal 20% — the second one applies to the already-reduced price.
        Multiply the remainders: <code>0.9 × 0.9 = 0.81</code>, so the total discount is 19%.
      </p>
    </>
  );
}
