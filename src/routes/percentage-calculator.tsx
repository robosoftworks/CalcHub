import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/percentage-calculator")({
  head: () => ({
    meta: [
      { title: "Percentage Calculator — % of, Increase, Decrease & Discount" },
      { name: "description", content: "Free percentage calculator: find X% of Y, what % X is of Y, percentage increase, decrease and discount price — all in one tool." },
      { property: "og:title", content: "Percentage Calculator" },
      { property: "og:description", content: "All percentage formulas in one fast tool." },
    ],
    links: [{ rel: "canonical", href: absUrl("/percentage-calculator") }],
  }),
  component: PctPage,
});

const TABS = ["X% of Y", "X is what % of Y", "% change", "Discount"] as const;
type Tab = typeof TABS[number];

function PctPage() {
  const [tab, setTab] = useState<Tab>("X% of Y");
  return (
    <CalcLayout slug="percentage-calculator" title="Percentage Calculator" tagline="Solve any percentage problem instantly — % of, % change, % increase/decrease and discount." faqs={faqs} article={<Article />}>
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-2 text-sm font-semibold transition-smooth ${tab === t ? "bg-accent text-accent-foreground" : "border border-border bg-card hover:bg-secondary"}`}>{t}</button>
        ))}
      </div>
      {tab === "X% of Y" && <PercentOf />}
      {tab === "X is what % of Y" && <WhatPercent />}
      {tab === "% change" && <Change />}
      {tab === "Discount" && <Discount />}
    </CalcLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>;
}
function num(v: string) { const n = parseFloat(v); return isFinite(n) ? n : NaN; }
function inputCls() { return "w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"; }
function ResultCard({ children, share, onReset }: { children: React.ReactNode; share: string; onReset?: () => void }) {
  return <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground"><div className="font-display text-3xl font-bold text-accent md:text-4xl">{children}</div><ResultActions text={share} title="Percentage result" onReset={onReset} /></div>;
}

function PercentOf() {
  const [x, setX] = useState("20"); const [y, setY] = useState("250");
  const r = (num(x) / 100) * num(y);
  const ok = !isNaN(r);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="What is X%"><input type="number" value={x} onChange={(e) => setX(e.target.value)} className={inputCls()} /></Field>
        <Field label="of Y?"><input type="number" value={y} onChange={(e) => setY(e.target.value)} className={inputCls()} /></Field>
      </div>
      {ok && <ResultCard share={`${x}% of ${y} = ${r}`} onReset={() => { setX("20"); setY("250"); }}>{x}% of {y} = <span className="text-surface-foreground">{r}</span></ResultCard>}
    </>
  );
}
function WhatPercent() {
  const [x, setX] = useState("50"); const [y, setY] = useState("200");
  const r = (num(x) / num(y)) * 100;
  const ok = !isNaN(r) && isFinite(r);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="X"><input type="number" value={x} onChange={(e) => setX(e.target.value)} className={inputCls()} /></Field>
        <Field label="is what % of Y"><input type="number" value={y} onChange={(e) => setY(e.target.value)} className={inputCls()} /></Field>
      </div>
      {ok ? (
        <ResultCard share={`${x} is ${r.toFixed(2)}% of ${y}`} onReset={() => { setX("50"); setY("200"); }}>{x} is <span className="text-surface-foreground">{r.toFixed(2)}%</span> of {y}</ResultCard>
      ) : (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Y can’t be 0 — enter a non-zero value to divide by.</p>
      )}
    </>
  );
}
function Change() {
  const [a, setA] = useState("80"); const [b, setB] = useState("100");
  const r = ((num(b) - num(a)) / num(a)) * 100;
  const ok = !isNaN(r) && isFinite(r);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Original value"><input type="number" value={a} onChange={(e) => setA(e.target.value)} className={inputCls()} /></Field>
        <Field label="New value"><input type="number" value={b} onChange={(e) => setB(e.target.value)} className={inputCls()} /></Field>
      </div>
      {ok ? (
        <ResultCard share={`Change from ${a} to ${b} = ${r.toFixed(2)}%`} onReset={() => { setA("80"); setB("100"); }}>{r >= 0 ? "↑ Increase" : "↓ Decrease"} of <span className="text-surface-foreground">{Math.abs(r).toFixed(2)}%</span></ResultCard>
      ) : (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Original value can’t be 0 — enter a non-zero starting value.</p>
      )}
    </>
  );
}
function Discount() {
  const [p, setP] = useState("1200"); const [d, setD] = useState("25");
  const saved = num(p) * (num(d) / 100);
  const final = num(p) - saved;
  const ok = !isNaN(final);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Original price"><input type="number" value={p} onChange={(e) => setP(e.target.value)} className={inputCls()} /></Field>
        <Field label="Discount %"><input type="number" value={d} onChange={(e) => setD(e.target.value)} className={inputCls()} /></Field>
      </div>
      {ok && (
        <ResultCard share={`After ${d}% off, you pay ${final.toFixed(2)} (saved ${saved.toFixed(2)})`} onReset={() => { setP("1200"); setD("25"); }}>
          Final price: <span className="text-surface-foreground">{final.toFixed(2)}</span>
          <div className="mt-1 text-base font-medium text-surface-foreground/70">You save {saved.toFixed(2)}</div>
        </ResultCard>
      )}
    </>
  );
}

const faqs = [
  { q: "What does each of the four tabs do?", a: "‘X% of Y’ finds a percentage of a number. ‘X is what % of Y’ tells you what share X is of Y. ‘% change’ computes percent increase or decrease between an old and new value. ‘Discount’ outputs the final price after a percent off." },
  { q: "How do I find X% of Y in this calculator?", a: "Open the ‘X% of Y’ tab, enter the percent in the X field and the base in the Y field. The result equals Y × (X ÷ 100) and updates as you type." },
  { q: "How does the ‘X is what % of Y’ tab work?", a: "Enter the part in X and the whole in Y. The output = (X ÷ Y) × 100. Useful for things like ‘15 out of 60 students’ → 25%." },
  { q: "What do the From / To inputs in the % change tab mean?", a: "From is the original (older) value, To is the new value. The output = ((To − From) ÷ From) × 100. A positive number is an increase, a negative number a decrease." },
  { q: "What does the Discount tab return?", a: "Enter the Original price and the Discount %. The calculator shows both the Savings amount and the Final price = Original × (1 − %/100)." },
];

function Article() {
  return (
    <>
      <h2>The complete guide to percentages</h2>
      <p>
        A percentage is just a fraction with 100 as the denominator. Saying “25%” is the same as saying
        “25 out of 100” or 0.25. Once you internalize that, every percentage problem reduces to
        multiplication and division.
      </p>
      <h3>Five percentage problems you’ll meet in real life</h3>
      <ol>
        <li><strong>X% of Y</strong>: a tip on a restaurant bill, sales tax on a purchase, a commission on a sale.</li>
        <li><strong>X is what % of Y</strong>: how much of your monthly income goes to rent.</li>
        <li><strong>Percent increase</strong>: a salary raise, year-over-year growth.</li>
        <li><strong>Percent decrease</strong>: weight loss, drop in stock price.</li>
        <li><strong>Discount</strong>: sale price after “25% off”.</li>
      </ol>
      <h3>The formulas</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">{`X% of Y           → Y × (X / 100)
X is what % of Y  → (X / Y) × 100
% change          → ((new − old) / old) × 100
Discount price    → original × (1 − discount / 100)`}</pre>
      <h3>Worked examples</h3>
      <p>
        <strong>Tip:</strong> 18% of $54 = 54 × 0.18 = $9.72.<br />
        <strong>Test score:</strong> 42 out of 50 = 42/50 × 100 = 84%.<br />
        <strong>Raise:</strong> from $40,000 to $46,000 = (46000 − 40000)/40000 × 100 = 15%.<br />
        <strong>Sale:</strong> $1,200 with 25% off = 1200 × 0.75 = $900.
      </p>
      <h3>Common percentage mistakes</h3>
      <p>
        Two big ones: confusing percentage <em>points</em> (a 5-point rise from 20% to 25%) with a
        percentage <em>increase</em> (from 20% to 25% is actually a 25% relative increase). The other is
        applying repeated percentages — a 50% increase followed by a 50% decrease does not return you to
        where you started; you end at 75% of the original.
      </p>
    </>
  );
}
