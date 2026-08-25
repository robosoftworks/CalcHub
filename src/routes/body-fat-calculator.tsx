import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/body-fat-calculator")({
  head: () => ({
    meta: [
      { title: "Body Fat Calculator — US Navy Method | CalcHub" },
      { name: "description", content: "Free body fat percentage calculator using the US Navy circumference method. Metric or imperial, no special equipment needed." },
      { property: "og:title", content: "Body Fat % Calculator — Navy Method" },
      { property: "og:description", content: "Estimate your body fat percentage from simple tape measurements." },
    ],
    links: [{ rel: "canonical", href: absUrl("/body-fat-calculator") }],
  }),
  component: BodyFatPage,
});

type Unit = "metric" | "imperial";

function classify(pct: number, sex: "male" | "female") {
  const ranges = sex === "male"
    ? [{ max: 6, label: "Essential fat" }, { max: 14, label: "Athletic" }, { max: 18, label: "Fitness" }, { max: 25, label: "Average" }, { max: 100, label: "Obese" }]
    : [{ max: 14, label: "Essential fat" }, { max: 21, label: "Athletic" }, { max: 25, label: "Fitness" }, { max: 32, label: "Average" }, { max: 100, label: "Obese" }];
  return ranges.find((r) => pct <= r.max)?.label ?? "Average";
}

function toCm(v: number, unit: Unit) {
  return unit === "metric" ? v : v * 2.54;
}

function BodyFatPage() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [height, setHeight] = useState(175);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState(95);

  const result = useMemo(() => {
    const h = toCm(height, unit);
    const n = toCm(neck, unit);
    const w = toCm(waist, unit);
    const hp = toCm(hip, unit);
    if (h <= 0 || n <= 0 || w <= 0 || (sex === "female" && hp <= 0)) return null;

    let pct: number;
    if (sex === "male") {
      if (w - n <= 0) return null;
      pct = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (w + hp - n <= 0) return null;
      pct = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.221 * Math.log10(h)) - 450;
    }
    if (!isFinite(pct) || pct <= 0) return null;
    return pct;
  }, [unit, sex, height, neck, waist, hip]);

  return (
    <CalcLayout
      slug="body-fat-calculator"
      title="Body Fat % Calculator"
      tagline="Estimate your body fat percentage using the U.S. Navy circumference method — just a tape measure needed."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md space-y-5">
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
            {(["metric", "imperial"] as Unit[]).map((u) => (
              <button key={u} onClick={() => setUnit(u)} className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-smooth ${unit === u ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>{u}</button>
            ))}
          </div>
          <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
            {(["male", "female"] as const).map((s) => (
              <button key={s} onClick={() => setSex(s)} className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-smooth ${sex === s ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Height ({unit === "metric" ? "cm" : "in"})</span><input type="number" value={height || ""} onChange={(e) => setHeight(Number(e.target.value))} className={cls()} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Neck ({unit === "metric" ? "cm" : "in"})</span><input type="number" value={neck || ""} onChange={(e) => setNeck(Number(e.target.value))} className={cls()} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Waist ({unit === "metric" ? "cm" : "in"})</span><input type="number" value={waist || ""} onChange={(e) => setWaist(Number(e.target.value))} className={cls()} /></label>
          {sex === "female" && (
            <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Hip ({unit === "metric" ? "cm" : "in"})</span><input type="number" value={hip || ""} onChange={(e) => setHip(Number(e.target.value))} className={cls()} /></label>
          )}
        </div>

        {result !== null ? (
          <div className="rounded-xl bg-surface p-5 text-center text-surface-foreground">
            <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Estimated body fat</div>
            <div className="mt-1 text-5xl font-bold tracking-tight">{result.toFixed(1)}%</div>
            <div className="mt-2 text-sm font-semibold text-accent">{classify(result, sex)}</div>
            <ResultActions
              text={`My estimated body fat is ${result.toFixed(1)}% (${classify(result, sex)})`}
              title="Body fat estimate"
              onReset={() => { setUnit("metric"); setSex("male"); setHeight(175); setNeck(38); setWaist(85); setHip(95); }}
            />
          </div>
        ) : (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Please check your measurements — waist must be larger than neck (and, for the hip-based formula, waist + hip must exceed neck).
          </p>
        )}
      </div>
    </CalcLayout>
  );
}

function cls() { return "w-full rounded-md border border-input bg-background px-3 py-2 text-base"; }

const faqs = [
  { q: "What is the US Navy method?", a: "A body fat estimation formula developed by the US Navy in 1984 (Hodgdon & Beckett) that uses simple circumference measurements — neck, waist, and hip for women — instead of calipers, water displacement or a DEXA scan." },
  { q: "How do I measure neck, waist and hip correctly?", a: "Neck: just below the larynx, tape sloping slightly downward at the front. Waist: at the narrowest point (or at the navel if no clear narrowing), while relaxed, not sucked in. Hip: at the widest point around the buttocks. Keep the tape snug but not compressing the skin." },
  { q: "Why does the formula need a hip measurement for women but not men?", a: "The original Navy research found that for women, hip circumference significantly improves accuracy versus waist and neck alone, while for men waist and neck alone were sufficiently predictive." },
  { q: "How accurate is this compared to a DEXA scan?", a: "The Navy method typically comes within about 3-4% of DEXA scan results for most body types, which is good enough for tracking trends over time, but it can be less accurate for very lean athletes or people with atypical fat distribution." },
  { q: "What do the category labels (Essential fat, Athletic, Fitness, Average, Obese) mean?", a: "They're American Council on Exercise (ACE) body fat categories. Essential fat is the minimum needed for basic physiological function; Athletic and Fitness ranges are typical of regularly-training individuals; Average and Obese reflect typical and above-recommended ranges respectively — thresholds differ between men and women due to natural physiological differences in essential fat." },
];

function Article() {
  return (
    <>
      <h2>How the Navy body fat formula works</h2>
      <p>
        Unlike BMI, which only uses height and weight, the Navy method estimates body fat percentage using
        circumference measurements that correlate with how much fat sits around your midsection versus lean
        mass — making it a meaningfully better proxy for body composition than BMI, without needing
        expensive equipment.
      </p>
      <h3>The formulas</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">{`Men:   %BF = 495 / (1.0324 − 0.19077×log₁₀(waist−neck) + 0.15456×log₁₀(height)) − 450
Women: %BF = 495 / (1.29579 − 0.35004×log₁₀(waist+hip−neck) + 0.22100×log₁₀(height)) − 450`}</pre>
      <p>All circumference and height measurements must be in centimeters for the formula to work correctly — this calculator converts imperial input automatically.</p>
      <h3>Why waist minus neck?</h3>
      <p>
        The difference between waist and neck circumference roughly isolates the fat accumulated around the
        torso from the baseline "frame" size represented by the neck — a rough but effective proxy that the
        original Navy researchers validated against underwater weighing (hydrostatic density testing).
      </p>
      <h3>Body fat categories explained</h3>
      <ul>
        <li><strong>Essential fat</strong> — the minimum fat needed for hormonal and organ function; going below this is unhealthy.</li>
        <li><strong>Athletic / Fitness</strong> — typical ranges for people who train regularly.</li>
        <li><strong>Average</strong> — typical for a generally healthy, moderately active adult.</li>
        <li><strong>Obese</strong> — associated with elevated health risk; consult a doctor for a full assessment.</li>
      </ul>
      <h3>Limitations</h3>
      <p>
        Circumference-based methods are estimates, not diagnoses. They can be less accurate for people with
        unusual body proportions, very high muscle mass, or significant weight recently gained or lost.
        Track the trend over weeks/months rather than obsessing over a single reading.
      </p>
    </>
  );
}
