import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/calorie-calculator")({
  head: () => ({
    meta: [
      { title: "Calorie Calculator — BMR & TDEE (Mifflin-St Jeor) | CalcHub" },
      { name: "description", content: "Free calorie calculator. Find your Basal Metabolic Rate (BMR) and daily calorie needs (TDEE) using the Mifflin-St Jeor formula." },
      { property: "og:title", content: "Calorie Calculator — BMR & TDEE" },
      { property: "og:description", content: "Calculate your BMR and daily calorie needs instantly." },
    ],
    links: [{ rel: "canonical", href: absUrl("/calorie-calculator") }],
  }),
  component: CaloriePage,
});

type Unit = "metric" | "imperial";
const ACTIVITY: { label: string; factor: number; hint: string }[] = [
  { label: "Sedentary", factor: 1.2, hint: "little or no exercise" },
  { label: "Light", factor: 1.375, hint: "exercise 1-3 days/week" },
  { label: "Moderate", factor: 1.55, hint: "exercise 3-5 days/week" },
  { label: "Active", factor: 1.725, hint: "exercise 6-7 days/week" },
  { label: "Very active", factor: 1.9, hint: "hard exercise & physical job" },
];

function CaloriePage() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(7);
  const [lbs, setLbs] = useState(154);
  const [activity, setActivity] = useState(1.55);

  const result = useMemo(() => {
    const heightCm = unit === "metric" ? height : (feet * 12 + inches) * 2.54;
    const weightKg = unit === "metric" ? weight : lbs * 0.453592;
    if (heightCm <= 0 || weightKg <= 0 || age <= 0) return null;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
    return { bmr, tdee: bmr * activity };
  }, [unit, sex, age, height, weight, feet, inches, lbs, activity]);

  return (
    <CalcLayout
      slug="calorie-calculator"
      title="Calorie Calculator"
      tagline="Find your Basal Metabolic Rate (BMR) and daily calorie needs (TDEE) using the Mifflin-St Jeor formula."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md space-y-5">
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
            {(["metric", "imperial"] as Unit[]).map((u) => (
              <button key={u} onClick={() => setUnit(u)} aria-pressed={unit === u} className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-smooth ${unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{u}</button>
            ))}
          </div>
          <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
            {(["male", "female"] as const).map((s) => (
              <button key={s} onClick={() => setSex(s)} aria-pressed={sex === s} className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-smooth ${sex === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Age (years)</span><input type="number" value={age || ""} onChange={(e) => setAge(Number(e.target.value))} className={cls()} /></label>
          {unit === "metric" ? (
            <>
              <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Height (cm)</span><input type="number" value={height || ""} onChange={(e) => setHeight(Number(e.target.value))} className={cls()} /></label>
              <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Weight (kg)</span><input type="number" value={weight || ""} onChange={(e) => setWeight(Number(e.target.value))} className={cls()} /></label>
            </>
          ) : (
            <>
              <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Height (ft)</span><input type="number" value={feet || ""} onChange={(e) => setFeet(Number(e.target.value))} className={cls()} /></label>
              <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Height (in)</span><input type="number" value={inches || ""} onChange={(e) => setInches(Number(e.target.value))} className={cls()} /></label>
              <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Weight (lbs)</span><input type="number" value={lbs || ""} onChange={(e) => setLbs(Number(e.target.value))} className={cls()} /></label>
            </>
          )}
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold text-muted-foreground">Activity level</span>
          <div className="grid gap-2">
            {ACTIVITY.map((a) => (
              <button
                key={a.label}
                onClick={() => setActivity(a.factor)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-smooth ${activity === a.factor ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
              >
                <span className="font-semibold">{a.label}</span>
                <span className="text-xs opacity-80">{a.hint}</span>
              </button>
            ))}
          </div>
        </div>

        {result ? (
          <div className="rounded-xl bg-surface p-5 text-surface-foreground">
            <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Daily calories to maintain weight (TDEE)</div>
            <div className="mt-1 text-4xl font-bold tracking-tight">{Math.round(result.tdee).toLocaleString()} <span className="text-lg font-normal opacity-70">kcal</span></div>
            <div className="mt-3 border-t border-white/10 pt-3 text-sm text-surface-foreground/80">
              BMR (calories at rest): <strong>{Math.round(result.bmr).toLocaleString()} kcal</strong>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs">
              <div className="rounded-lg bg-white/5 p-3"><div className="text-surface-foreground/60">Lose ~0.5kg/wk</div><div className="mt-1 text-sm font-bold">{Math.round(result.tdee - 500).toLocaleString()} kcal</div></div>
              <div className="rounded-lg bg-white/5 p-3"><div className="text-surface-foreground/60">Gain ~0.5kg/wk</div><div className="mt-1 text-sm font-bold">{Math.round(result.tdee + 500).toLocaleString()} kcal</div></div>
            </div>
            <ResultActions
              text={`BMR ${Math.round(result.bmr)} kcal, TDEE ${Math.round(result.tdee)} kcal/day`}
              title="Calorie needs"
              onReset={() => { setUnit("metric"); setSex("male"); setAge(30); setHeight(170); setWeight(70); setFeet(5); setInches(7); setLbs(154); setActivity(1.55); }}
            />
          </div>
        ) : (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Please enter a valid age, height and weight.</p>
        )}
      </div>
    </CalcLayout>
  );
}

function cls() { return "w-full rounded-md border border-input bg-background px-3 py-2 text-base"; }

const faqs = [
  { q: "What's the difference between BMR and TDEE?", a: "BMR (Basal Metabolic Rate) is the calories your body burns at complete rest just to stay alive — breathing, circulation, cell repair. TDEE (Total Daily Energy Expenditure) adds your activity level on top, giving the calories you actually burn in a normal day." },
  { q: "Which formula does this calculator use?", a: "The Mifflin-St Jeor equation, published in 1990 and considered more accurate than the older Harris-Benedict formula for most people. It only needs weight, height, age and sex." },
  { q: "How do I pick the right activity level?", a: "Be honest, not aspirational — 'Sedentary' means a desk job with little deliberate exercise. Most people overestimate their activity level, which leads to eating more than their TDEE and unexpected weight gain." },
  { q: "What are the -500/+500 numbers under the main result?", a: "A calorie deficit or surplus of about 500 kcal/day roughly corresponds to losing or gaining about 0.5kg (1lb) per week, since one pound of body fat is approximately 3,500 kcal. These are starting points, not guarantees." },
  { q: "Is this accurate for everyone?", a: "BMR formulas are population averages and can be off by 10-15% for individuals with unusual body composition (very muscular or very high body fat), pregnancy, or certain medical conditions. Treat the result as a starting estimate, not a medical prescription." },
];

function Article() {
  return (
    <>
      <h2>How BMR and TDEE are calculated</h2>
      <p>
        Every calorie your body needs falls into one of two buckets: the energy required just to keep you
        alive (BMR), and the extra energy burned through movement and exercise on top of that (activity).
        Understanding both numbers is the foundation of any weight-management plan.
      </p>
      <h3>The Mifflin-St Jeor formula</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">Men:   BMR = 10×weight(kg) + 6.25×height(cm) − 5×age + 5
Women: BMR = 10×weight(kg) + 6.25×height(cm) − 5×age − 161</pre>
      <p>
        This formula was validated against measured metabolic rates and is now the standard used by
        dietitians and the American Dietetic Association, replacing the older Harris-Benedict equation.
      </p>
      <h3>From BMR to TDEE</h3>
      <p>
        BMR alone assumes you spend the entire day resting, which isn't realistic. TDEE multiplies BMR by
        an activity factor ranging from 1.2 (sedentary) to 1.9 (very active physical job plus hard daily
        exercise) to estimate real-world daily calorie burn.
      </p>
      <h3>Worked example</h3>
      <p>
        A 30-year-old man, 170cm, 70kg: BMR = 10×70 + 6.25×170 − 5×30 + 5 = <strong>1,668 kcal</strong>.
        At a "Moderate" activity level (×1.55), his TDEE is roughly <strong>2,585 kcal/day</strong> — the
        number of calories he'd need to eat to maintain his current weight.
      </p>
      <h3>Using TDEE for weight goals</h3>
      <ul>
        <li><strong>Maintain weight:</strong> eat approximately your TDEE.</li>
        <li><strong>Lose weight:</strong> eat 250-750 kcal below TDEE for a gradual, sustainable deficit.</li>
        <li><strong>Gain weight/muscle:</strong> eat 250-500 kcal above TDEE alongside resistance training.</li>
      </ul>
      <h3>Limitations</h3>
      <p>
        These formulas are statistical averages across large populations. Individual metabolism varies with
        muscle mass, genetics, hormones, and other factors that a height/weight/age formula can't capture.
        Use the result as a starting point and adjust based on your actual weight trend over 2-3 weeks.
      </p>
    </>
  );
}
