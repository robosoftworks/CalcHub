import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/unit-converter")({
  head: () => ({
    meta: [
      { title: "Unit Converter — Length, Weight, Volume & Temperature | CalcHub" },
      { name: "description", content: "Free unit converter. Convert length, weight, volume and temperature between metric and imperial units instantly." },
      { property: "og:title", content: "Unit Converter" },
      { property: "og:description", content: "Convert length, weight, volume and temperature units instantly." },
    ],
    links: [{ rel: "canonical", href: absUrl("/unit-converter") }],
  }),
  component: UnitConverterPage,
});

type Category = "Length" | "Weight" | "Volume" | "Temperature";

const UNITS: Record<Exclude<Category, "Temperature">, Record<string, number>> = {
  Length: { Millimeters: 0.001, Centimeters: 0.01, Meters: 1, Kilometers: 1000, Inches: 0.0254, Feet: 0.3048, Yards: 0.9144, Miles: 1609.344 },
  Weight: { Milligrams: 0.000001, Grams: 0.001, Kilograms: 1, "Metric Tons": 1000, Ounces: 0.0283495, Pounds: 0.453592, "Stones": 6.35029 },
  Volume: { Milliliters: 0.001, Liters: 1, "US Gallons": 3.78541, "US Quarts": 0.946353, "US Pints": 0.473176, Cups: 0.24, "Fluid Ounces": 0.0295735 },
};

const TEMP_UNITS = ["Celsius", "Fahrenheit", "Kelvin"];

function toCelsius(v: number, unit: string) {
  if (unit === "Celsius") return v;
  if (unit === "Fahrenheit") return ((v - 32) * 5) / 9;
  return v - 273.15; // Kelvin
}
function fromCelsius(c: number, unit: string) {
  if (unit === "Celsius") return c;
  if (unit === "Fahrenheit") return (c * 9) / 5 + 32;
  return c + 273.15; // Kelvin
}

function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("Length");
  const [from, setFrom] = useState("Meters");
  const [to, setTo] = useState("Feet");
  const [amount, setAmount] = useState("1");

  function selectCategory(c: Category) {
    setCategory(c);
    if (c === "Temperature") { setFrom("Celsius"); setTo("Fahrenheit"); }
    else { const keys = Object.keys(UNITS[c]); setFrom(keys[0]); setTo(keys[1]); }
  }

  const unitOptions = category === "Temperature" ? TEMP_UNITS : Object.keys(UNITS[category]);

  const result = useMemo(() => {
    const n = parseFloat(amount);
    if (isNaN(n)) return null;
    if (category === "Temperature") return fromCelsius(toCelsius(n, from), to);
    const factors = UNITS[category];
    return (n * factors[from]) / factors[to];
  }, [amount, from, to, category]);

  const display = result === null ? "—" : Number(result.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 6 });

  return (
    <CalcLayout
      slug="unit-converter"
      title="Unit Converter"
      tagline="Convert length, weight, volume and temperature between metric and imperial units instantly."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {(["Length", "Weight", "Volume", "Temperature"] as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => selectCategory(c)}
            aria-pressed={category === c}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-smooth ${category === c ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-secondary"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">From</span>
          <div className="flex gap-2">
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary">
              {unitOptions.map((u) => <option key={u}>{u}</option>)}
            </select>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </label>
        <button
          onClick={() => { setFrom(to); setTo(from); }}
          aria-label="Swap units"
          className="mx-auto mb-1 grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition-smooth hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">To</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary">
            {unitOptions.map((u) => <option key={u}>{u}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
        <div className="text-xs uppercase tracking-wider text-surface-foreground/60">{amount || "0"} {from} =</div>
        <div className="mt-1 font-display text-4xl font-bold text-primary md:text-5xl">{display} {to}</div>
        <ResultActions
          text={`${amount} ${from} = ${display} ${to}`}
          title="Unit conversion"
          onReset={() => { setAmount("1"); selectCategory(category); }}
        />
      </div>
    </CalcLayout>
  );
}

const faqs = [
  { q: "Which unit categories does this converter support?", a: "Four categories: Length (mm to miles), Weight (mg to stones), Volume (ml to US gallons) and Temperature (Celsius, Fahrenheit, Kelvin). Switch tabs to change category." },
  { q: "How accurate are the conversions?", a: "All conversion factors use standard internationally-defined ratios (e.g. 1 inch = 2.54cm exactly), and results are shown to 6 decimal places, so they're accurate for everyday, cooking, DIY and travel use." },
  { q: "Why does Temperature work differently from the other categories?", a: "Length, Weight and Volume convert with a simple multiplication factor. Temperature scales have different zero points, so Celsius, Fahrenheit and Kelvin need their own formulas rather than a shared factor." },
  { q: "What does the swap (⇄) button do?", a: "It instantly flips the From and To units so you can reverse the conversion direction without reselecting both dropdowns." },
  { q: "Can I convert negative numbers?", a: "Yes for Temperature (e.g. -40°F to °C). For Length, Weight and Volume, negative amounts aren't physically meaningful, so only positive values return a sensible result." },
];

function Article() {
  return (
    <>
      <h2>How unit conversion works</h2>
      <p>
        Every unit within a category (length, weight or volume) can be expressed as a multiple of one
        shared base unit — meters for length, kilograms for weight, liters for volume. To convert from
        any unit to any other, we convert the input to the base unit first, then convert from the base
        unit to the target.
      </p>
      <h3>The conversion formula</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">result = amount × (factor_from ÷ factor_to)</pre>
      <p>
        For example, converting 5 feet to meters: feet's factor is 0.3048 (meters per foot), meters' factor
        is 1, so <code>5 × (0.3048 / 1) = 1.524 meters</code>.
      </p>
      <h3>Why temperature is different</h3>
      <p>
        Celsius, Fahrenheit and Kelvin don't share a common zero point, so a simple multiplier doesn't
        work. Instead we convert every input to Celsius as an intermediate step, then apply the target
        scale's formula: <code>F = C × 9/5 + 32</code> and <code>K = C + 273.15</code>.
      </p>
      <h3>Common conversions people search for</h3>
      <ul>
        <li>Centimeters to inches — clothing sizes, height</li>
        <li>Kilograms to pounds — body weight, shipping</li>
        <li>Liters to US gallons — fuel, cooking</li>
        <li>Celsius to Fahrenheit — weather, oven temperatures</li>
      </ul>
      <h3>A note on precision</h3>
      <p>
        Results are rounded for display but computed at full floating-point precision internally, so
        chaining conversions (e.g. feet → meters → centimeters) won't introduce compounding rounding
        errors beyond what any calculator would show.
      </p>
    </>
  );
}
