import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";

export const Route = createFileRoute("/bmi-calculator")({
  head: () => ({
    meta: [
      { title: "BMI Calculator — Body Mass Index (Metric & Imperial) | CalcHub" },
      { name: "description", content: "Free BMI calculator. Enter your height and weight in metric or imperial units to see your Body Mass Index and healthy weight range." },
      { property: "og:title", content: "BMI Calculator — Body Mass Index" },
      { property: "og:description", content: "Calculate your BMI and check your healthy weight range instantly." },
    ],
    links: [{ rel: "canonical", href: "https://calchub.app/bmi-calculator" }],
  }),
  component: BmiPage,
});

type Unit = "metric" | "imperial";

function classify(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
  if (bmi < 25) return { label: "Normal weight", color: "text-green-600" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-600" };
  return { label: "Obese", color: "text-red-600" };
}

function BmiPage() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(7);
  const [lbs, setLbs] = useState(154);

  const bmi = useMemo(() => {
    if (unit === "metric") {
      if (!height || !weight) return 0;
      const m = height / 100;
      return weight / (m * m);
    }
    const totalIn = feet * 12 + inches;
    if (!totalIn || !lbs) return 0;
    return (lbs / (totalIn * totalIn)) * 703;
  }, [unit, height, weight, feet, inches, lbs]);

  const cls = bmi ? classify(bmi) : null;
  const display = bmi ? bmi.toFixed(1) : "—";

  return (
    <CalcLayout
      slug="bmi-calculator"
      title="BMI Calculator"
      tagline="Find your Body Mass Index in seconds. Switch between metric and imperial units."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md space-y-5">
        <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
          {(["metric", "imperial"] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-smooth ${
                unit === u ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >{u}</button>
          ))}
        </div>

        {unit === "metric" ? (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Height (cm)</span>
              <input
                type="number" inputMode="decimal" value={height || ""}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Weight (kg)</span>
              <input
                type="number" inputMode="decimal" value={weight || ""}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Feet</span>
              <input
                type="number" inputMode="numeric" value={feet || ""}
                onChange={(e) => setFeet(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Inches</span>
              <input
                type="number" inputMode="numeric" value={inches || ""}
                onChange={(e) => setInches(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">Weight (lbs)</span>
              <input
                type="number" inputMode="decimal" value={lbs || ""}
                onChange={(e) => setLbs(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
              />
            </label>
          </div>
        )}

        <div className="rounded-xl bg-surface p-5 text-center text-surface-foreground">
          <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Your BMI</div>
          <div className="mt-1 text-5xl font-bold tracking-tight">{display}</div>
          {cls && <div className={`mt-2 text-sm font-semibold ${cls.color}`}>{cls.label}</div>}
        </div>

        <div className="rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground">
          <div className="mb-2 font-semibold text-foreground">BMI categories (WHO)</div>
          <ul className="space-y-1">
            <li>Underweight: &lt; 18.5</li>
            <li>Normal: 18.5 – 24.9</li>
            <li>Overweight: 25 – 29.9</li>
            <li>Obese: ≥ 30</li>
          </ul>
        </div>

        <ResultActions
          text={`My BMI is ${display} (${cls?.label ?? ""})`}
          title="BMI result"
          onReset={() => {
            setUnit("metric"); setHeight(170); setWeight(70);
            setFeet(5); setInches(7); setLbs(154);
          }}
        />
      </div>
    </CalcLayout>
  );
}

const faqs = [
  { q: "Should I use the Metric or Imperial unit toggle?", a: "Pick whichever matches the numbers you know. Metric expects height in centimetres and weight in kilograms; Imperial expects height in feet + inches and weight in pounds. The BMI output is identical either way." },
  { q: "What height and weight values does this BMI Calculator accept?", a: "Any positive number. Metric height is in cm (e.g. 170), weight in kg (e.g. 70). Imperial uses separate Feet and Inches inputs plus a Pounds input (e.g. 5 ft 7 in, 154 lb)." },
  { q: "How does the calculator turn my inputs into a BMI number?", a: "Metric: BMI = kg ÷ (m × m), where m = cm ÷ 100. Imperial: BMI = (lb ÷ in²) × 703, where total inches = feet × 12 + inches. The result is rounded to one decimal." },
  { q: "What do the Underweight / Normal / Overweight / Obese labels mean?", a: "We use WHO cut-offs: under 18.5 is Underweight, 18.5–24.9 is Normal weight, 25–29.9 is Overweight, 30+ is Obese. The label below your BMI updates instantly when you change height or weight." },
  { q: "Why might my BMI result be misleading?", a: "BMI uses only height and weight, so it can’t tell muscle from fat. Athletes, pregnant people, the elderly and children should treat the BMI output as a rough screen and confirm with a clinician." },
];

function Article() {
  return (
    <>
      <h2>How the BMI calculator works</h2>
      <p>
        Body Mass Index is the most widely used screening tool for weight category. Our calculator lets you
        enter your numbers in metric (cm/kg) or imperial (ft/in/lbs) units and instantly classifies the result
        according to World Health Organization guidelines.
      </p>
      <h3>The BMI formula</h3>
      <p>
        In metric units, BMI = <code>weight (kg) ÷ height² (m²)</code>. In imperial units, multiply by 703:
        <code> BMI = (weight in lbs ÷ height² in inches) × 703</code>.
      </p>
      <h3>What your number means</h3>
      <ul>
        <li><strong>Under 18.5</strong> — underweight</li>
        <li><strong>18.5 – 24.9</strong> — normal weight</li>
        <li><strong>25 – 29.9</strong> — overweight</li>
        <li><strong>30 and above</strong> — obese</li>
      </ul>
      <h3>Limitations of BMI</h3>
      <p>
        BMI is a simple screening tool — it doesn’t measure body fat directly and doesn’t account for muscle
        mass, bone density, age or ethnicity. Always combine BMI with other indicators like waist circumference
        and a doctor’s assessment for a complete picture of health.
      </p>
    </>
  );
}
