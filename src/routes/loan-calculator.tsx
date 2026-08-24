import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";

export const Route = createFileRoute("/loan-calculator")({
  head: () => ({
    meta: [
      { title: "Loan & EMI Calculator — Monthly Payments + Interest | CalcHub" },
      { name: "description", content: "Free loan / EMI calculator. Enter loan amount, interest rate and tenure to see monthly payment, total interest and total cost." },
      { property: "og:title", content: "Loan / EMI Calculator" },
      { property: "og:description", content: "Calculate monthly EMI, total interest and total payment for any loan." },
    ],
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
    const P = amount;
    const r = rate / 12 / 100;
    const n = years * 12;
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
        Whether you’re shopping for a mortgage, financing a car or refinancing a personal loan, the EMI
        calculator tells you exactly what you’ll pay every month — and how much of that is interest.
      </p>
      <h3>The EMI formula</h3>
      <p>
        EMI = <code>P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</code>, where <em>P</em> is the loan amount, <em>r</em>
        is the monthly interest rate (annual rate ÷ 12 ÷ 100), and <em>n</em> is the number of months. With a
        zero-interest loan the formula simplifies to <code>P ÷ n</code>.
      </p>
      <h3>Why the total interest matters</h3>
      <p>
        Two loans with the same EMI can have very different total interest if their tenures differ. Always
        compare both the monthly payment <em>and</em> the total interest paid over the full term before
        choosing a loan.
      </p>
      <h3>Tips to reduce interest</h3>
      <ul>
        <li>Choose a shorter tenure if your budget allows — total interest drops sharply.</li>
        <li>Make occasional principal prepayments — even small ones cut years off your loan.</li>
        <li>Refinance if market rates fall by more than ~1% from your current rate.</li>
      </ul>
    </>
  );
}
