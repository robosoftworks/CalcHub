import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";

export const Route = createFileRoute("/profit-loss-calculator")({
  head: () => ({
    meta: [
      { title: "Profit & Loss Calculator — Margin & Markup | CalcHub" },
      { name: "description", content: "Free profit and loss calculator. Enter cost and selling price to find profit, loss, margin and markup percentages instantly." },
      { property: "og:title", content: "Profit & Loss Calculator" },
      { property: "og:description", content: "Calculate profit, loss, margin and markup with one click." },
    ],
  }),
  component: PnlPage,
});

function PnlPage() {
  const [cost, setCost] = useState("100");
  const [sell, setSell] = useState("130");

  const c = parseFloat(cost) || 0;
  const s = parseFloat(sell) || 0;
  const diff = s - c;
  const pct = c ? (diff / c) * 100 : 0;
  const margin = s ? (diff / s) * 100 : 0;
  const isProfit = diff >= 0;

  return (
    <CalcLayout slug="profit-loss-calculator" title="Profit & Loss Calculator" tagline="Enter cost price and selling price — get profit/loss, margin and markup instantly." faqs={faqs} article={<Article />}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cost price"><input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></Field>
        <Field label="Selling price"><input type="number" value={sell} onChange={(e) => setSell(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></Field>
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
        <div className="text-xs uppercase tracking-wider text-surface-foreground/60">{isProfit ? "Profit" : "Loss"}</div>
        <div className={`mt-1 font-display text-4xl font-bold md:text-5xl ${isProfit ? "text-accent" : "text-destructive"}`}>
          {isProfit ? "+" : ""}{diff.toFixed(2)}
        </div>
        <div className="mt-1 text-sm text-surface-foreground/70">{isProfit ? "Markup" : "Loss"} of {Math.abs(pct).toFixed(2)}% on cost</div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat label="Markup %" value={`${pct.toFixed(2)}%`} />
          <Stat label="Margin %" value={`${margin.toFixed(2)}%`} />
          <Stat label={isProfit ? "Profit" : "Loss"} value={Math.abs(diff).toFixed(2)} />
        </div>
        <ResultActions text={`Cost ${c}, Sell ${s} → ${isProfit ? "Profit" : "Loss"} ${Math.abs(diff).toFixed(2)} (${Math.abs(pct).toFixed(2)}%)`} title="P&L result" onReset={() => { setCost("100"); setSell("130"); }} />
      </div>
    </CalcLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/5 p-3"><div className="text-xs text-surface-foreground/60">{label}</div><div className="mt-1 text-lg font-bold">{value}</div></div>;
}

const faqs = [
  { q: "What do the Cost price and Selling price inputs represent?", a: "Cost price is the all-in amount you paid to acquire and prepare the item (purchase + shipping + packaging + fees). Selling price is the amount the customer pays you. Both are in the same currency." },
  { q: "When does the result switch from Profit to Loss?", a: "If Selling price ≥ Cost price the headline label reads ‘Profit’ in green; if Selling is lower, it flips to ‘Loss’ in red. The number itself is Selling − Cost (shown as an absolute value below)." },
  { q: "How are the Markup % and Margin % outputs calculated?", a: "Markup % = (Selling − Cost) ÷ Cost × 100 — profit on top of cost. Margin % = (Selling − Cost) ÷ Selling × 100 — profit as a share of revenue. A 50% markup is only a 33% margin." },
  { q: "What selling price should I enter to hit a target margin?", a: "Use Selling = Cost ÷ (1 − targetMargin). For 40% margin on a Cost of 30, enter Selling 50; the Margin % output will read 40.00%." },
  { q: "Does the calculator account for taxes, fees or returns?", a: "No — outputs are based purely on the two prices you enter. To get a realistic figure, fold processing fees, shipping and an expected return rate into your Cost price before calculating." },
];

function Article() {
  return (
    <>
      <h2>Profit, loss, margin and markup explained</h2>
      <p>
        Every business — from a side-hustle reselling sneakers to a multinational — lives or dies by one
        number: <strong>profit</strong>. But profit is more than just selling for more than you paid.
        Understanding margin and markup separately helps you price products correctly and avoid
        accidentally losing money on every sale.
      </p>
      <h3>The basic profit/loss formula</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">Profit (or Loss) = Selling Price − Cost Price</pre>
      <p>
        A positive number is profit; a negative number is a loss. To express it as a percentage, divide by
        either the cost price (markup) or the selling price (margin).
      </p>
      <h3>Markup vs margin</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">{`Markup % = (Profit / Cost) × 100
Margin % = (Profit / Selling) × 100`}</pre>
      <p>
        These two often get confused, but they answer different questions. Markup says “how much did I add
        on top of cost?”. Margin says “of every dollar I take in, how much do I keep?”. A 100% markup is a
        50% margin. A 50% markup is a 33% margin.
      </p>
      <h3>Worked example</h3>
      <p>
        You buy a phone case for <strong>$10</strong> and sell it for <strong>$25</strong>. Profit = $15.
        Markup = 15/10 = <strong>150%</strong>. Margin = 15/25 = <strong>60%</strong>.
      </p>
      <h3>Hidden costs that eat profit</h3>
      <ul>
        <li><strong>Payment processing</strong>: 2–4% of every credit card transaction.</li>
        <li><strong>Shipping & packaging</strong>: easily $3–8 per order.</li>
        <li><strong>Returns</strong>: budget for a 5–15% return rate in e-commerce.</li>
        <li><strong>Marketing</strong>: customer acquisition cost (CAC) often dwarfs unit economics.</li>
      </ul>
      <h3>Pricing for target margin</h3>
      <p>
        To hit a specific margin, work backwards: Selling price = Cost / (1 − target margin). Want a 40%
        margin on a $30 product? Selling price = 30 / 0.60 = $50.
      </p>
    </>
  );
}
