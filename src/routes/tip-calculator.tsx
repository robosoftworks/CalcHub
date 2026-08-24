import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";

export const Route = createFileRoute("/tip-calculator")({
  head: () => ({
    meta: [
      { title: "Tip Calculator — Bill, Tip & Split | CalcHub" },
      { name: "description", content: "Free tip calculator. Enter the bill, tip percentage and number of people to split — see what each person pays." },
      { property: "og:title", content: "Tip Calculator — Bill & Split" },
      { property: "og:description", content: "Quickly calculate tip, total and per-person share for any bill." },
    ],
  }),
  component: TipPage,
});

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function TipPage() {
  const [bill, setBill] = useState(50);
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState(2);

  const { tipAmount, total, perPerson } = useMemo(() => {
    const tipAmount = (bill * tip) / 100;
    const total = bill + tipAmount;
    const perPerson = people > 0 ? total / people : total;
    return { tipAmount, total, perPerson };
  }, [bill, tip, people]);

  return (
    <CalcLayout
      slug="tip-calculator"
      title="Tip Calculator"
      tagline="Calculate tip, total and per-person split for any bill — perfect for restaurants, cafés and groups."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md space-y-5">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">Bill amount</span>
          <input
            type="number" inputMode="decimal" value={bill || ""}
            onChange={(e) => setBill(Number(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
          />
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Tip percentage</span>
            <span className="text-sm font-bold">{tip}%</span>
          </div>
          <input
            type="range" min={0} max={30} value={tip}
            onChange={(e) => setTip(Number(e.target.value))}
            className="w-full accent-[oklch(0.89_0.18_100)]"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[10, 15, 18, 20, 25].map((p) => (
              <button
                key={p}
                onClick={() => setTip(p)}
                className={`rounded-full border border-border px-3 py-1 text-xs font-semibold transition-smooth ${
                  tip === p ? "bg-accent text-accent-foreground" : "bg-card hover:border-accent"
                }`}
              >{p}%</button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">Split between</span>
          <input
            type="number" inputMode="numeric" min={1} value={people || ""}
            onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
          />
        </label>

        <div className="rounded-xl bg-surface p-5 text-surface-foreground">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-surface-foreground/60">Tip</div>
              <div className="text-xl font-semibold">{fmt(tipAmount)}</div>
            </div>
            <div>
              <div className="text-surface-foreground/60">Total</div>
              <div className="text-xl font-semibold">{fmt(total)}</div>
            </div>
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="text-surface-foreground/60 text-xs uppercase tracking-wider">Each person pays</div>
            <div className="mt-1 text-4xl font-bold tracking-tight">{fmt(perPerson)}</div>
          </div>
        </div>

        <ResultActions
          text={`Bill ${fmt(bill)} + ${tip}% tip = ${fmt(total)}, ${fmt(perPerson)} per person`}
          title="Tip & split"
          onReset={() => { setBill(50); setTip(15); setPeople(2); }}
        />
      </div>
    </CalcLayout>
  );
}

const faqs = [
  { q: "What do the Bill amount, Tip % and Split between fields control?", a: "Bill amount is the pre-tip subtotal from your receipt. Tip % is the gratuity rate (set with the slider or one of the 10/15/18/20/25 quick buttons). Split between is the number of people sharing the bill." },
  { q: "How are the Tip, Total and Each-person outputs calculated?", a: "Tip = Bill × Tip% ÷ 100. Total = Bill + Tip. Each person pays = Total ÷ Split between. All three update instantly as you drag the slider or edit any input." },
  { q: "Should I enter the pre-tax or post-tax amount in the Bill field?", a: "Etiquette guides recommend tipping on the pre-tax subtotal, so enter that for a ‘fair’ tip. Many people just enter the post-tax total for convenience — both work, only the Tip and Total figures shift slightly." },
  { q: "What do the quick-tip buttons (10, 15, 18, 20, 25) do?", a: "They’re shortcuts that snap the Tip slider to common rates. Tap one to set the percentage instantly; the slider value (and the bold % readout above it) updates to match." },
  { q: "Does the Split between field round each person’s share?", a: "The Each-person output is shown to 2 decimal places using your locale’s number format. For an exact even split, ask one person to absorb the rounding cents." },
];

function Article() {
  return (
    <>
      <h2>How the tip calculator works</h2>
      <p>
        The tip calculator multiplies your bill by your chosen tip percentage, adds it to the original amount,
        and then divides the total by the number of people in your group. It’s the fastest way to settle a
        restaurant bill or split a takeaway between friends.
      </p>
      <h3>Tipping etiquette around the world</h3>
      <ul>
        <li><strong>USA & Canada:</strong> 15–20% standard, 10% poor service, 25% exceptional</li>
        <li><strong>UK & Ireland:</strong> 10–12.5% if a service charge isn’t already included</li>
        <li><strong>Western Europe:</strong> Round up the bill or add 5–10%</li>
        <li><strong>Japan & South Korea:</strong> Tipping is not customary and can be considered rude</li>
        <li><strong>Australia & New Zealand:</strong> Optional; 10% is generous</li>
      </ul>
      <h3>How to split a bill fairly</h3>
      <p>
        Even splits are easy — just divide the total by the headcount. For unequal splits (someone ordered the
        steak, someone the salad), tally each person’s items, add the same tip percentage to each subtotal,
        and you’re done.
      </p>
    </>
  );
}
