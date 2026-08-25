import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/mortgage-calculator")({
  head: () => ({
    meta: [
      { title: "Mortgage Calculator — Monthly Home Loan Payment | CalcHub" },
      { name: "description", content: "Free mortgage calculator. Estimate your monthly payment including principal, interest, property tax, home insurance and PMI." },
      { property: "og:title", content: "Mortgage Calculator" },
      { property: "og:description", content: "Estimate your total monthly mortgage payment in seconds." },
    ],
    links: [{ rel: "canonical", href: absUrl("/mortgage-calculator") }],
  }),
  component: MortgagePage,
});

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function MortgagePage() {
  const [price, setPrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.1);
  const [insurance, setInsurance] = useState(1400);
  const [pmiRate, setPmiRate] = useState(0.5);

  const result = useMemo(() => {
    const P = Math.max(0, price) - Math.max(0, Math.min(downPayment, price));
    const r = Math.max(0, rate) / 12 / 100;
    const n = Math.max(0, years) * 12;
    const principalInterest = !P || !n ? 0 : r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const downPct = price > 0 ? (Math.max(0, downPayment) / price) * 100 : 0;
    const monthlyTax = (Math.max(0, price) * Math.max(0, taxRate)) / 100 / 12;
    const monthlyInsurance = Math.max(0, insurance) / 12;
    const monthlyPmi = downPct < 20 ? (P * Math.max(0, pmiRate)) / 100 / 12 : 0;
    const totalMonthly = principalInterest + monthlyTax + monthlyInsurance + monthlyPmi;
    const totalInterest = principalInterest * n - P;
    return { P, principalInterest, monthlyTax, monthlyInsurance, monthlyPmi, totalMonthly, totalInterest, downPct };
  }, [price, downPayment, rate, years, taxRate, insurance, pmiRate]);

  return (
    <CalcLayout
      slug="mortgage-calculator"
      title="Mortgage Calculator"
      tagline="Estimate your total monthly mortgage payment, including taxes, insurance and PMI."
      faqs={faqs}
      article={<Article />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home price"><input type="number" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Down payment"><input type="number" value={downPayment || ""} onChange={(e) => setDownPayment(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Interest rate (% / year)"><input type="number" step="0.01" value={rate || ""} onChange={(e) => setRate(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Loan term (years)"><input type="number" value={years || ""} onChange={(e) => setYears(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Property tax (% / year)"><input type="number" step="0.01" value={taxRate || ""} onChange={(e) => setTaxRate(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Home insurance ($ / year)"><input type="number" value={insurance || ""} onChange={(e) => setInsurance(Number(e.target.value))} className={cls()} /></Field>
      </div>
      {result.downPct < 20 && (
        <div className="mt-4">
          <Field label="PMI rate (% / year, applies since down payment < 20%)"><input type="number" step="0.01" value={pmiRate || ""} onChange={(e) => setPmiRate(Number(e.target.value))} className={cls()} /></Field>
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
        <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Estimated monthly payment</div>
        <div className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">{fmt(result.totalMonthly)}</div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm sm:grid-cols-4">
          <div><div className="text-surface-foreground/60">Principal & interest</div><div className="text-lg font-semibold">{fmt(result.principalInterest)}</div></div>
          <div><div className="text-surface-foreground/60">Property tax</div><div className="text-lg font-semibold">{fmt(result.monthlyTax)}</div></div>
          <div><div className="text-surface-foreground/60">Insurance</div><div className="text-lg font-semibold">{fmt(result.monthlyInsurance)}</div></div>
          <div><div className="text-surface-foreground/60">PMI</div><div className="text-lg font-semibold">{fmt(result.monthlyPmi)}</div></div>
        </div>
        <div className="mt-4 border-t border-white/10 pt-4 text-sm text-surface-foreground/70">
          Loan amount {fmt(result.P)} · Total interest over {years} years: {fmt(result.totalInterest)}
        </div>
        <ResultActions
          text={`Mortgage on ${fmt(price)} home, ${fmt(downPayment)} down: ${fmt(result.totalMonthly)}/month`}
          title="Mortgage estimate"
          onReset={() => { setPrice(350000); setDownPayment(70000); setRate(6.5); setYears(30); setTaxRate(1.1); setInsurance(1400); setPmiRate(0.5); }}
        />
      </div>
    </CalcLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>{children}</label>;
}
function cls() { return "w-full rounded-md border border-input bg-background px-3 py-2 text-base"; }

const faqs = [
  { q: "What's included in the monthly payment total?", a: "Four components, often abbreviated PITI: Principal & Interest (the loan repayment itself), property Taxes, home Insurance, and PMI (Private Mortgage Insurance) if your down payment is under 20%." },
  { q: "Why did a PMI field appear on my calculation?", a: "PMI is only shown and applied when your down payment is less than 20% of the home price — lenders typically require it below that threshold to protect against default risk. Raise your down payment to 20%+ and PMI drops to $0." },
  { q: "How is the Principal & Interest payment calculated?", a: "The same amortization formula used for any loan: EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the loan amount (home price minus down payment), r is the monthly interest rate, and n is the number of monthly payments." },
  { q: "Are property tax and insurance rates the same everywhere?", a: "No — property tax rates vary hugely by state and county (often 0.5%–2.5% of home value per year), and insurance depends on location and coverage. Use your local numbers for an accurate estimate; the defaults are just a reasonable US starting point." },
  { q: "Does this include closing costs or HOA fees?", a: "No — this estimates the recurring monthly payment only. Closing costs (typically 2–5% of the loan) are a one-time expense, and HOA fees vary by property; add those separately to your budget." },
];

function Article() {
  return (
    <>
      <h2>How a mortgage payment is calculated</h2>
      <p>
        Your monthly mortgage payment is usually more than just loan repayment — lenders bundle taxes and
        insurance into what's called an escrow payment, so you pay everything in one monthly bill. This
        calculator breaks down each piece so you understand exactly what you're paying for.
      </p>
      <h3>Principal & Interest (P&amp;I)</h3>
      <p>
        This is the actual loan repayment, calculated with the standard amortization formula:
      </p>
      <pre className="rounded-md bg-muted p-3 text-sm">EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</pre>
      <p>
        Where <em>P</em> is the loan amount (home price minus down payment), <em>r</em> is the monthly
        interest rate (annual rate ÷ 12 ÷ 100), and <em>n</em> is the total number of monthly payments
        (years × 12).
      </p>
      <h3>Property tax and insurance</h3>
      <p>
        Annual property tax and home insurance are simply divided by 12 to get the monthly portion. Many
        lenders collect these monthly and pay the annual bill on your behalf via an escrow account.
      </p>
      <h3>PMI — Private Mortgage Insurance</h3>
      <p>
        If your down payment is under 20% of the home price, lenders usually require PMI to protect
        themselves if you default. It's calculated as a percentage of the loan amount per year, divided by
        12. PMI typically disappears automatically once you've built 20-22% equity.
      </p>
      <h3>Worked example</h3>
      <p>
        A $350,000 home with $70,000 down (20%) at 6.5% for 30 years has a loan amount of $280,000. The
        P&amp;I payment alone is roughly $1,770/month. Add ~$320/month property tax and ~$117/month
        insurance, and the total monthly payment lands around $2,200 — with no PMI since the down payment
        hits the 20% threshold.
      </p>
      <h3>Tips for a lower payment</h3>
      <ul>
        <li>A larger down payment reduces both the loan amount and can eliminate PMI entirely.</li>
        <li>Shopping multiple lenders for rate quotes can meaningfully change the P&amp;I portion.</li>
        <li>A 15-year term has a higher monthly payment but dramatically less total interest than 30 years.</li>
      </ul>
    </>
  );
}
