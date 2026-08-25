import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/salary-calculator")({
  head: () => ({
    meta: [
      { title: "Salary / Take-Home Pay Calculator (US Estimate) | CalcHub" },
      { name: "description", content: "Free salary calculator. Estimate your US take-home pay after federal tax, FICA and a custom state tax rate, with a full breakdown." },
      { property: "og:title", content: "Salary / Take-Home Pay Calculator" },
      { property: "og:description", content: "Estimate your take-home pay after taxes." },
    ],
    links: [{ rel: "canonical", href: absUrl("/salary-calculator") }],
  }),
  component: SalaryPage,
});

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

// 2024 US federal brackets (simplified — single filer and married-filing-jointly only).
const BRACKETS: Record<"single" | "married", { upTo: number; rate: number }[]> = {
  single: [
    { upTo: 11600, rate: 0.1 },
    { upTo: 47150, rate: 0.12 },
    { upTo: 100525, rate: 0.22 },
    { upTo: 191950, rate: 0.24 },
    { upTo: 243725, rate: 0.32 },
    { upTo: 609350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married: [
    { upTo: 23200, rate: 0.1 },
    { upTo: 94300, rate: 0.12 },
    { upTo: 201050, rate: 0.22 },
    { upTo: 383900, rate: 0.24 },
    { upTo: 487450, rate: 0.32 },
    { upTo: 731200, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};
const STANDARD_DEDUCTION = { single: 14600, married: 29200 };
const SS_WAGE_BASE = 168600;

function progressiveTax(taxable: number, brackets: { upTo: number; rate: number }[]) {
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (taxable <= prev) break;
    const slice = Math.min(taxable, b.upTo) - prev;
    tax += slice * b.rate;
    prev = b.upTo;
  }
  return tax;
}

function SalaryPage() {
  const [gross, setGross] = useState(75000);
  const [filing, setFiling] = useState<"single" | "married">("single");
  const [stateTaxRate, setStateTaxRate] = useState(5);
  const [pretaxDeductions, setPretaxDeductions] = useState(0);

  const result = useMemo(() => {
    const g = Math.max(0, gross);
    const pretax = Math.min(g, Math.max(0, pretaxDeductions));
    const afterPretax = g - pretax;
    const taxable = Math.max(0, afterPretax - STANDARD_DEDUCTION[filing]);
    const federalTax = progressiveTax(taxable, BRACKETS[filing]);
    const socialSecurity = Math.min(afterPretax, SS_WAGE_BASE) * 0.062;
    const medicare = afterPretax * 0.0145;
    const stateTax = (afterPretax * Math.max(0, stateTaxRate)) / 100;
    const totalTax = federalTax + socialSecurity + medicare + stateTax;
    const takeHome = afterPretax - totalTax;
    return { federalTax, socialSecurity, medicare, stateTax, totalTax, takeHome, afterPretax };
  }, [gross, filing, stateTaxRate, pretaxDeductions]);

  return (
    <CalcLayout
      slug="salary-calculator"
      title="Salary / Take-Home Pay Calculator"
      tagline="Estimate your US take-home pay after federal tax, FICA and state tax — with a full breakdown."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mb-4 rounded-md border border-accent/30 bg-accent/10 p-3 text-xs text-foreground/80">
        Estimate only — uses simplified 2024 US federal brackets and a flat rate you set for state/local tax. Not tax advice.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gross annual salary"><input type="number" value={gross || ""} onChange={(e) => setGross(Number(e.target.value))} className={cls()} /></Field>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">Filing status</span>
          <select value={filing} onChange={(e) => setFiling(e.target.value as "single" | "married")} className={cls()}>
            <option value="single">Single</option>
            <option value="married">Married filing jointly</option>
          </select>
        </label>
        <Field label="State/local tax rate (%)"><input type="number" step="0.1" value={stateTaxRate || ""} onChange={(e) => setStateTaxRate(Number(e.target.value))} className={cls()} /></Field>
        <Field label="Pre-tax deductions (401k, insurance, /yr)"><input type="number" value={pretaxDeductions || ""} onChange={(e) => setPretaxDeductions(Number(e.target.value))} className={cls()} /></Field>
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
        <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Estimated annual take-home pay</div>
        <div className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">{fmt(result.takeHome)}</div>
        <div className="mt-1 text-sm text-surface-foreground/70">{fmt(result.takeHome / 12)}/month · {fmt(result.takeHome / 26)}/biweekly paycheck</div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm sm:grid-cols-4">
          <div><div className="text-surface-foreground/60">Federal tax</div><div className="text-lg font-semibold">{fmt(result.federalTax)}</div></div>
          <div><div className="text-surface-foreground/60">Social Security</div><div className="text-lg font-semibold">{fmt(result.socialSecurity)}</div></div>
          <div><div className="text-surface-foreground/60">Medicare</div><div className="text-lg font-semibold">{fmt(result.medicare)}</div></div>
          <div><div className="text-surface-foreground/60">State tax</div><div className="text-lg font-semibold">{fmt(result.stateTax)}</div></div>
        </div>
        <ResultActions
          text={`${fmt(gross)}/yr gross → ${fmt(result.takeHome)}/yr take-home (${fmt(result.totalTax)} total tax)`}
          title="Take-home pay estimate"
          onReset={() => { setGross(75000); setFiling("single"); setStateTaxRate(5); setPretaxDeductions(0); }}
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
  { q: "How accurate is this estimate?", a: "It uses real 2024 US federal tax brackets, the standard deduction and FICA (Social Security + Medicare) rates, so the federal portion is reasonably accurate for a simple W-2 filer taking the standard deduction. It won't match a filer who itemizes deductions, has additional income sources, or lives somewhere with local (city/county) taxes on top of state tax." },
  { q: "Why do I need to enter my own state tax rate?", a: "State income tax rules vary enormously — nine US states have no state income tax at all, while others use progressive brackets of their own. Rather than guess, enter your state's approximate effective rate (a quick search for '[your state] effective income tax rate' will get you close)." },
  { q: "What are Social Security and Medicare (FICA)?", a: "Federal payroll taxes: Social Security is 6.2% of wages up to an annual wage base ($168,600 for 2024, above which no more Social Security tax is owed), and Medicare is 1.45% with no cap. Together these are called FICA taxes." },
  { q: "What should I put for pre-tax deductions?", a: "Anything deducted from your paycheck before income tax is calculated — typically 401(k)/retirement contributions and health insurance premiums. These reduce your taxable income (and therefore your federal/state tax) but don't reduce the Social Security/Medicare wage base in this simplified model." },
  { q: "Why is this not exact?", a: "Real payroll accounts for local taxes, itemized deductions, tax credits, additional Medicare surtax above $200k, multiple income sources, and filing statuses (e.g. head of household) this tool doesn't model. Use it for budgeting and offer negotiation, not for filing your actual return." },
];

function Article() {
  return (
    <>
      <h2>How take-home pay is calculated</h2>
      <p>
        Your paycheck goes through several deductions before you see the final number: pre-tax
        contributions, federal income tax, FICA payroll taxes, and state/local tax. This calculator walks
        through each step using the same order a real payroll system does.
      </p>
      <h3>Step 1 — Pre-tax deductions</h3>
      <p>
        401(k) contributions and many insurance premiums are deducted <em>before</em> tax is calculated,
        which lowers your taxable income. This is why maxing out a 401(k) reduces your tax bill, not just
        your take-home pay.
      </p>
      <h3>Step 2 — Federal income tax (progressive brackets)</h3>
      <p>
        The US uses a progressive bracket system: only the income within each bracket is taxed at that
        bracket's rate, not your entire income at your top rate. For a single filer earning $75,000 in
        2024, the first $11,600 is taxed at 10%, the next chunk up to $47,150 at 12%, and so on — your
        "effective" tax rate ends up lower than your top marginal rate.
      </p>
      <pre className="rounded-md bg-muted p-3 text-sm">taxable income = income − standard deduction
tax = Σ (income in each bracket × that bracket's rate)</pre>
      <h3>Step 3 — FICA payroll taxes</h3>
      <p>
        Social Security (6.2%) and Medicare (1.45%) are flat-rate payroll taxes withheld regardless of
        deductions or filing status. Social Security only applies up to an annual wage cap; Medicare has no
        cap (and adds an extra 0.9% above $200,000, which this simplified model doesn't include).
      </p>
      <h3>Step 4 — State and local tax</h3>
      <p>
        This varies too much by location to model precisely, so we apply the flat percentage you provide
        directly to your after-pre-tax-deduction income.
      </p>
      <h3>Worked example</h3>
      <p>
        $75,000 gross, single filer, 5% state tax, no pre-tax deductions: taxable income after the $14,600
        standard deduction is $60,400, giving roughly $8,180 federal tax. Add ~$4,650 Social Security, ~$1,090
        Medicare and ~$3,750 state tax, and take-home lands around $57,300/year — about $4,775/month.
      </p>
    </>
  );
}
