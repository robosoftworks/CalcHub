import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/fuel-cost-calculator")({
  head: () => ({
    meta: [
      { title: "Fuel Cost Calculator — Trip & Fill-Up Cost | CalcHub" },
      { name: "description", content: "Free fuel cost calculator. Find the fuel cost of any trip from distance, fuel efficiency and price per gallon or litre." },
      { property: "og:title", content: "Fuel Cost Calculator" },
      { property: "og:description", content: "Calculate the fuel cost of any trip instantly." },
    ],
    links: [{ rel: "canonical", href: absUrl("/fuel-cost-calculator") }],
  }),
  component: FuelCostPage,
});

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

type Unit = "imperial" | "metric";

function FuelCostPage() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [distance, setDistance] = useState(300);
  const [efficiency, setEfficiency] = useState(30); // mpg or L/100km
  const [price, setPrice] = useState(3.5); // per gallon or per liter

  const result = useMemo(() => {
    const d = Math.max(0, distance);
    const e = Math.max(0, efficiency);
    const p = Math.max(0, price);
    if (!d || !e) return { fuelUsed: 0, cost: 0, costPerDistance: 0 };
    const fuelUsed = unit === "imperial" ? d / e : (d / 100) * e;
    const cost = fuelUsed * p;
    return { fuelUsed, cost, costPerDistance: d ? cost / d : 0 };
  }, [unit, distance, efficiency, price]);

  return (
    <CalcLayout
      slug="fuel-cost-calculator"
      title="Fuel Cost Calculator"
      tagline="Calculate the fuel cost of any trip from distance, fuel efficiency and the price per gallon or litre."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md space-y-5">
        <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
          {(["imperial", "metric"] as Unit[]).map((u) => (
            <button key={u} onClick={() => setUnit(u)} aria-pressed={unit === u} className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-smooth ${unit === u ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {u === "imperial" ? "Miles / MPG / Gallon" : "Km / L per 100km / Litre"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Distance ({unit === "imperial" ? "miles" : "km"})</span><input type="number" value={distance || ""} onChange={(e) => setDistance(Number(e.target.value))} className={cls()} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">{unit === "imperial" ? "Efficiency (mpg)" : "Efficiency (L/100km)"}</span><input type="number" value={efficiency || ""} onChange={(e) => setEfficiency(Number(e.target.value))} className={cls()} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Price per {unit === "imperial" ? "gallon" : "litre"}</span><input type="number" step="0.01" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} className={cls()} /></label>
        </div>

        <div className="rounded-xl bg-surface p-5 text-surface-foreground">
          <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Trip fuel cost</div>
          <div className="mt-1 text-4xl font-bold tracking-tight">{fmt(result.cost)}</div>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm">
            <div><div className="text-surface-foreground/60">Fuel used</div><div className="text-lg font-semibold">{fmt(result.fuelUsed)} {unit === "imperial" ? "gal" : "L"}</div></div>
            <div><div className="text-surface-foreground/60">Cost per {unit === "imperial" ? "mile" : "km"}</div><div className="text-lg font-semibold">{fmt(result.costPerDistance)}</div></div>
          </div>
          <ResultActions
            text={`${distance} ${unit === "imperial" ? "mi" : "km"} trip: ${fmt(result.fuelUsed)} ${unit === "imperial" ? "gal" : "L"} = ${fmt(result.cost)}`}
            title="Fuel cost"
            onReset={() => { setUnit("imperial"); setDistance(300); setEfficiency(30); setPrice(3.5); }}
          />
        </div>
      </div>
    </CalcLayout>
  );
}

function cls() { return "w-full rounded-md border border-input bg-background px-3 py-2 text-base"; }

const faqs = [
  { q: "What's the difference between the two unit modes?", a: "Imperial mode uses miles, miles-per-gallon (MPG) and price per gallon — common in the US. Metric mode uses kilometers, litres-per-100km (the standard efficiency figure in most other countries) and price per litre. Switch modes any time; your other inputs stay as-is." },
  { q: "Where do I find my vehicle's fuel efficiency figure?", a: "Check your car's manual, the manufacturer's official spec sheet, or your dashboard's trip computer (many cars show average MPG or L/100km directly). Real-world efficiency is often 10-20% worse than the manufacturer's rated figure, especially in city driving." },
  { q: "Why does metric use 'litres per 100km' instead of 'km per litre'?", a: "L/100km makes cost comparisons linear and intuitive — a car using 6 L/100km costs exactly twice as much fuel over the same distance as one using 3 L/100km, which isn't as visually obvious with a 'km per litre' figure." },
  { q: "How is the fuel used calculated in each mode?", a: "Imperial: fuel used = distance ÷ MPG. Metric: fuel used = (distance ÷ 100) × L/100km. Both give the volume of fuel consumed, which is then multiplied by the price per unit to get total cost." },
  { q: "Does this account for fuel price changes during a long trip?", a: "No — it assumes a single, constant price per gallon/litre for the whole trip. For a long road trip crossing regions with different prices, calculate each leg separately and add the costs." },
];

function Article() {
  return (
    <>
      <h2>How trip fuel cost is calculated</h2>
      <p>
        Fuel cost comes down to three numbers: how far you're driving, how efficiently your vehicle uses
        fuel, and the price per unit of fuel where you're filling up. Multiply them together correctly and
        you get an accurate trip estimate.
      </p>
      <h3>Imperial formula (MPG)</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">fuel used (gallons) = distance (miles) ÷ MPG
cost = fuel used × price per gallon</pre>
      <p>A 300-mile trip at 30 MPG with gas at $3.50/gallon uses 10 gallons, costing $35.</p>
      <h3>Metric formula (L/100km)</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">fuel used (litres) = (distance (km) ÷ 100) × L/100km
cost = fuel used × price per litre</pre>
      <p>A 300km trip at 8 L/100km with fuel at €1.80/L uses 24 litres, costing €43.20.</p>
      <h3>Why cost-per-distance matters</h3>
      <p>
        Comparing two vehicles' total trip cost only tells part of the story — cost per mile or per
        kilometer lets you compare vehicles or trips of different lengths on equal footing, which is useful
        for choosing between a fuel-efficient car and a larger one, or estimating a longer commute's annual
        cost.
      </p>
      <h3>Ways to reduce fuel cost</h3>
      <ul>
        <li>Combine errands into fewer trips — a cold engine uses more fuel per mile for the first few minutes.</li>
        <li>Maintain correct tire pressure — under-inflated tires can reduce efficiency by several percent.</li>
        <li>Reduce highway speed — aerodynamic drag increases sharply above ~65 mph (105 km/h).</li>
        <li>Remove unnecessary roof racks or cargo — they add drag even when empty.</li>
      </ul>
    </>
  );
}
