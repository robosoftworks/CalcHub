import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/loan-calculator")({
  head: () => ({
    meta: [
      { title: "Loan & EMI Calculator — Monthly Payments + Interest | CalcHub" },
      { name: "description", content: "Free loan / EMI calculator. Enter loan amount, interest rate and tenure to see monthly payment, total interest and total cost." },
      { property: "og:title", content: "Loan / EMI Calculator" },
      { property: "og:description", content: "Calculate monthly EMI, total interest and total payment for any loan." },
    ],
    links: [{ rel: "canonical", href: absUrl("/loan-calculator") }],
  }),
  component: LoanPage,
});

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function LoanPage() {
  const [amount, setAmount] = useState(20000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const P = Math.max(0, amount);
    const r = Math.max(0, rate) / 12 / 100;
    const n = Math.max(0, years) * 12;
    if (!P || !n) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    return { emi, totalInterest: totalPayment - P, totalPayment };
  }, [amount, rate, years]);

  return (
    <CalcLayout
      slug="loan-calculator"
      title="Loan / EMI Calculator"
      tagline="Work out your monthly payment, total interest and total cost for any home, car or personal loan."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-xl space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Loan amount</span>
            <input
              type="number" inputMode="decimal" value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Interest (% / year)</span>
            <input
              type="number" step="0.01" inputMode="decimal" value={rate || ""}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Tenure (years)</span>
            <input
              type="number" inputMode="numeric" value={years || ""}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
            />
          </label>
        </div>

        <div className="rounded-xl bg-surface p-5 text-surface-foreground">
          <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Monthly payment (EMI)</div>
          <div className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">{fmt(emi)}</div>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm">
            <div>
              <div className="text-surface-foreground/60">Total interest</div>
              <div className="text-lg font-semibold">{fmt(totalInterest)}</div>
            </div>
            <div>
              <div className="text-surface-foreground/60">Total payment</div>
              <div className="text-lg font-semibold">{fmt(totalPayment)}</div>
            </div>
          </div>
        </div>

        <ResultActions
          text={`Loan ${fmt(amount)} @ ${rate}% for ${years}y → EMI ${fmt(emi)}, total ${fmt(totalPayment)}`}
          title="Loan EMI"
          onReset={() => { setAmount(20000); setRate(7.5); setYears(5); }}
        />
      </div>
    </CalcLayout>
  );
}

const faqs = [
  { q: "What do the Loan amount, Interest and Tenure fields expect?", a: "Loan amount is the principal you’re borrowing in any currency. Interest is the annual rate as a percentage (e.g. 7.5). Tenure is the loan length in whole years (e.g. 5)." },
  { q: "How is the Monthly payment (EMI) output calculated?", a: "We convert the annual % to a monthly rate r = rate ÷ 12 ÷ 100 and total months n = years × 12, then apply EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1). If rate is 0, EMI simplifies to P ÷ n." },
  { q: "What do the Total interest and Total payment outputs mean?", a: "Total payment = EMI × n (the sum of every monthly installment). Total interest = Total payment − Loan amount, i.e. how much extra you pay the lender on top of the principal." },
  { q: "Should I enter the APR or a monthly rate in the Interest field?", a: "Always the annual rate (APR). The calculator divides it by 12 internally — entering an already-monthly rate would understate your EMI by roughly 12×." },
  { q: "Can I model a half-year tenure or extra payments?", a: "The Tenure field is in whole years, so for 6 months use 0.5 — the math handles fractional years. Lump-sum prepayments aren’t modelled; reduce the Loan amount and recalculate to see the impact." },
];

function Article() {
  return (
    <>
      <h2>How the loan / EMI calculator works</h2>
      <p>
        Every EMI (Equated Monthly Installment) is made of two ingredients in a ratio that shifts every
        month: principal (what you actually borrowed) and interest (the lender's fee for the risk). Early in
        a loan you're mostly paying interest; late in a loan you're mostly paying down principal. The EMI
        stays flat — what's inside it changes completely.
      </p>
      <h3>The formula, in plain language</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</pre>
      <p>
        <em>P</em> is the amount you borrow, <em>r</em> is your monthly interest rate (annual rate ÷ 12 ÷
        100), and <em>n</em> is the number of monthly payments. The <code>(1 + r)ⁿ</code> term is doing the
        real work — it compounds the interest forward over every remaining month, which is why a longer
        tenure costs so much more than the sticker rate suggests. With a zero-interest loan, the formula
        collapses to a plain <code>P ÷ n</code> — no compounding, no surprise.
      </p>
      <h3>Worked example</h3>
      <p>
        Finance a <strong>$22,400</strong> used truck at <strong>6.4% APR for 5 years</strong> (60 months).
        Monthly rate = 6.4 ÷ 12 ÷ 100 = 0.005333. EMI ≈ <strong>$437/month</strong>. Over 60 months you'll
        pay $26,234 total — <strong>$3,834 in interest</strong> on top of the truck's price. Stretch the same
        loan to 7 years (84 months) instead, and the EMI drops to about $332/month, but total interest rises
        to roughly <strong>$5,450</strong> — about 42% more, for a "cheaper-looking" monthly number.
      </p>
      <h3>Common mistake: chasing the lowest EMI</h3>
      <p>
        The EMI is the number dealerships lead with because it's the smallest, most reassuring figure on the
        page. But two loans with an identical EMI can have wildly different total costs if their tenures
        differ, and a "lower monthly payment" almost always means a longer tenure — which means more total
        interest, not less. Always compare total interest paid over the full term, not just the monthly
        number, before signing.
      </p>
      <h3>Reducing what you actually pay</h3>
      <ul>
        <li>A shorter tenure raises the EMI but cuts total interest sharply — run both scenarios through the calculator before deciding.</li>
        <li>Occasional lump-sum prepayments reduce principal directly, which shrinks every future interest calculation.</li>
        <li>
          If you're financing a home, the <Link to="/mortgage-calculator">Mortgage Calculator</Link> uses
          the same underlying math with property tax and insurance layered in, and the{" "}
          <Link to="/compound-interest-calculator">Compound Interest Calculator</Link> is worth trying to
          see how much a prepayment could have grown if invested instead.
        </li>
      </ul>
      <p>
        See also: <Link to="/blog/$slug" params={{ slug: "how-to-calculate-your-car-loan-emi-before-you-sign" }}>How to Calculate Your Car Loan EMI Before You Sign</Link>{" "}
        for a full pre-purchase walkthrough, including how exchange rates affect an imported vehicle's real cost.
      </p>
    </>
  );
}
