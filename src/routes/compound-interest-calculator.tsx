import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/compound-interest-calculator")({
  head: () => ({
    meta: [
      { title: "Compound Interest Calculator — Investment & Savings Growth | CalcHub" },
      { name: "description", content: "Free compound interest calculator. See how your savings or investment grows over time, including regular monthly contributions." },
      { property: "og:title", content: "Compound Interest Calculator" },
      { property: "og:description", content: "Project the growth of your savings or investment with compound interest." },
    ],
    links: [{ rel: "canonical", href: absUrl("/compound-interest-calculator") }],
  }),
  component: CompoundInterestPage,
});

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

const FREQUENCIES: Record<string, number> = { Annually: 1, "Semi-annually": 2, Quarterly: 4, Monthly: 12, Daily: 365 };

function CompoundInterestPage() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState("Monthly");
  const [monthlyContribution, setMonthlyContribution] = useState(200);

  const result = useMemo(() => {
    const P = Math.max(0, principal);
    const r = Math.max(0, rate) / 100;
    const t = Math.max(0, years);
    const n = FREQUENCIES[frequency];
    const growthFromPrincipal = n && t ? P * Math.pow(1 + r / n, n * t) : P;

    const monthlyRate = r / 12;
    const months = t * 12;
    const contribution = Math.max(0, monthlyContribution);
    const growthFromContributions = months
      ? monthlyRate === 0
        ? contribution * months
        : contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      : 0;

    const total = growthFromPrincipal + growthFromContributions;
    const totalContributed = P + contribution * months;
    const totalInterest = total - totalContributed;
    return { total, totalContributed, totalInterest };
  }, [principal, rate, years, frequency, monthlyContribution]);

  return (
    <CalcLayout
      slug="compound-interest-calculator"
      title="Compound Interest Calculator"
      tagline="See how your savings or investment grows over time — including regular monthly contributions."
      faqs={faqs}
      article={<Article />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Starting amount"><input type="number" value={principal || ""} onChange={(e) => setPrincipal(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Monthly contribution"><input type="number" value={monthlyContribution || ""} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Annual interest rate (%)"><input type="number" step="0.01" value={rate || ""} onChange={(e) => setRate(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Time period (years)"><input type="number" value={years || ""} onChange={(e) => setYears(Number(e.target.value))} className={cls()} /></Field>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">Compounding frequency</span>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={cls()}>
            {Object.keys(FREQUENCIES).map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
        <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Future value</div>
        <div className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">{fmt(result.total)}</div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm">
          <div><div className="text-surface-foreground/60">Total contributed</div><div className="text-lg font-semibold">{fmt(result.totalContributed)}</div></div>
          <div><div className="text-surface-foreground/60">Interest earned</div><div className="text-lg font-semibold">{fmt(result.totalInterest)}</div></div>
        </div>
        <ResultActions
          text={`${fmt(principal)} + ${fmt(monthlyContribution)}/mo at ${rate}% for ${years}y = ${fmt(result.total)} (${fmt(result.totalInterest)} interest)`}
          title="Compound interest projection"
          onReset={() => { setPrincipal(10000); setRate(7); setYears(10); setFrequency("Monthly"); setMonthlyContribution(200); }}
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
  { q: "What does the Compounding frequency dropdown change?", a: "It controls how often interest is calculated and added back to your starting amount — annually, semi-annually, quarterly, monthly or daily. More frequent compounding grows your starting amount slightly faster for the same nominal rate." },
  { q: "How is the growth from monthly contributions calculated?", a: "Contributions are modeled as a monthly annuity: each deposit compounds at the monthly rate (annual rate ÷ 12) for however many months remain until the end of the period, then all months are summed using the future-value-of-annuity formula." },
  { q: "What's the difference between 'Total contributed' and 'Interest earned'?", a: "Total contributed is simply your starting amount plus every monthly deposit added up — money that came from you. Interest earned is the future value minus that total — money the compounding itself generated." },
  { q: "Why does a higher compounding frequency only make a small difference?", a: "The gap between annual and daily compounding narrows quickly at realistic rates — for a 7% annual rate, daily vs annual compounding differs by well under 0.5% in the final total. Contribution amount and time period matter far more than compounding frequency." },
  { q: "Is this the same math a bank or brokerage uses?", a: "It's the standard textbook compound-interest and annuity formulas, which match how banks/brokerages compute compounding — but real accounts may have fees, variable rates or different day-count conventions that this simplified model doesn't capture." },
];

function Article() {
  return (
    <>
      <h2>How compound interest works</h2>
      <p>
        Compound interest is interest calculated on both your original principal <em>and</em> the interest
        that's already accumulated — which is why growth accelerates over time rather than staying flat.
        The longer your money compounds, the more dramatic the difference from simple interest becomes.
      </p>
      <h3>The compound interest formula</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">A = P × (1 + r/n)^(n×t)</pre>
      <p>
        Where <em>P</em> is the principal, <em>r</em> is the annual interest rate (as a decimal), <em>n</em>
        {" "}is the number of times interest compounds per year, and <em>t</em> is the number of years.
      </p>
      <h3>Adding regular contributions</h3>
      <p>
        Most real savings plans aren't a single lump sum — you add money regularly. Each monthly
        contribution has less time to compound than the ones before it, so we sum the future value of
        every individual deposit using the future-value-of-annuity formula:
      </p>
      <pre className="rounded-md bg-muted p-3 text-sm">FV = PMT × ((1 + i)ᵐ − 1) / i</pre>
      <p>
        Where <em>PMT</em> is the monthly contribution, <em>i</em> is the monthly rate (annual rate ÷ 12),
        and <em>m</em> is the number of months.
      </p>
      <h3>Worked example</h3>
      <p>
        $10,000 invested at 7% annually, compounded monthly, with $200 added every month for 10 years
        grows to roughly $52,000 — about $28,000 of that from your own $34,000 in contributions plus
        starting balance, and around $18,000 purely from compounding.
      </p>
      <h3>Why starting early matters more than rate</h3>
      <p>
        Because compounding is exponential, time is the single biggest lever. $5,000 invested for 30 years
        at 7% grows to roughly $38,000 — more than the same amount invested for only 15 years at 10%.
        Starting a decade earlier often beats chasing a higher return.
      </p>
      <h3>A note on accuracy</h3>
      <p>
        This tool assumes a constant interest rate and regular contribution amount for the entire period.
        Real investments fluctuate, and tax treatment varies by account type — use this for planning and
        intuition, not as a guaranteed projection.
      </p>
    </>
  );
}
