import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/date-calculator")({
  head: () => ({
    meta: [
      { title: "Date Calculator — Days Between Dates & Countdown | CalcHub" },
      { name: "description", content: "Free date calculator. Find the exact number of days, weeks and months between two dates, or count down to any future date." },
      { property: "og:title", content: "Date Calculator — Difference & Countdown" },
      { property: "og:description", content: "Find the days between two dates or count down to any event." },
    ],
    links: [{ rel: "canonical", href: absUrl("/date-calculator") }],
  }),
  component: DateCalcPage,
});

function diffParts(from: Date, to: Date) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m -= 1;
    const prev = new Date(to.getFullYear(), to.getMonth(), 0);
    d += prev.getDate();
  }
  if (m < 0) { y -= 1; m += 12; }
  const ms = to.getTime() - from.getTime();
  return { years: y, months: m, days: d, totalDays: Math.floor(ms / 86400000), totalWeeks: Math.floor(ms / (86400000 * 7)) };
}

function DateCalcPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [mode, setMode] = useState<"diff" | "countdown">("diff");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [target, setTarget] = useState(today);

  const diffResult = useMemo(() => {
    const a = new Date(from);
    const b = new Date(to);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    const swap = a > b;
    return { ...diffParts(swap ? b : a, swap ? a : b), swapped: swap };
  }, [from, to]);

  const countdownResult = useMemo(() => {
    const t = new Date(target);
    const now = new Date();
    if (isNaN(t.getTime())) return null;
    const isPast = t < now;
    const parts = diffParts(isPast ? t : now, isPast ? now : t);
    return { ...parts, isPast };
  }, [target]);

  return (
    <CalcLayout
      slug="date-calculator"
      title="Date Calculator"
      tagline="Find the difference between two dates, or count down the days to any future date or event."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {(["diff", "countdown"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-smooth ${mode === m ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-secondary"}`}
          >
            {m === "diff" ? "Days between two dates" : "Countdown to a date"}
          </button>
        ))}
      </div>

      {mode === "diff" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="From date"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" /></Field>
            <Field label="To date"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" /></Field>
          </div>
          {diffResult ? (
            <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
              <div className="text-xs uppercase tracking-wider text-surface-foreground/60">
                {diffResult.swapped ? "To date is before From date — showing absolute difference" : "Difference"}
              </div>
              <div className="mt-1 font-display text-4xl font-bold text-primary md:text-5xl">
                {diffResult.years} <span className="text-lg text-surface-foreground/60">years</span>{" "}
                {diffResult.months} <span className="text-lg text-surface-foreground/60">months</span>{" "}
                {diffResult.days} <span className="text-lg text-surface-foreground/60">days</span>
              </div>
              <div className="mt-3 text-sm text-surface-foreground/70">{diffResult.totalDays.toLocaleString()} total days · {diffResult.totalWeeks.toLocaleString()} weeks</div>
              <ResultActions
                text={`Between ${from} and ${to}: ${diffResult.years}y ${diffResult.months}m ${diffResult.days}d (${diffResult.totalDays} days total)`}
                title="Date difference"
                onReset={() => { setFrom(today); setTo(today); }}
              />
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Please enter two valid dates.</p>
          )}
        </>
      ) : (
        <>
          <Field label="Target date"><input type="date" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" /></Field>
          {countdownResult ? (
            <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
              <div className="text-xs uppercase tracking-wider text-surface-foreground/60">{countdownResult.isPast ? "That date was" : "Time remaining"}</div>
              <div className="mt-1 font-display text-4xl font-bold text-primary md:text-5xl">
                {countdownResult.years} <span className="text-lg text-surface-foreground/60">years</span>{" "}
                {countdownResult.months} <span className="text-lg text-surface-foreground/60">months</span>{" "}
                {countdownResult.days} <span className="text-lg text-surface-foreground/60">days</span>
              </div>
              <div className="mt-3 text-sm text-surface-foreground/70">
                {countdownResult.totalDays.toLocaleString()} days {countdownResult.isPast ? "ago" : "from today"}
              </div>
              <ResultActions
                text={`${countdownResult.isPast ? "It has been" : "Countdown:"} ${countdownResult.years}y ${countdownResult.months}m ${countdownResult.days}d ${countdownResult.isPast ? "since" : "until"} ${target}`}
                title="Countdown"
                onReset={() => setTarget(today)}
              />
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Please enter a valid target date.</p>
          )}
        </>
      )}
    </CalcLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>;
}

const faqs = [
  { q: "What's the difference between the two modes?", a: "'Days between two dates' finds the exact gap between any two dates you pick. 'Countdown to a date' always measures from right now to a single target date — handy for events, deadlines or anniversaries." },
  { q: "What happens if I enter the To date before the From date?", a: "The calculator automatically swaps them and shows the absolute difference, with a note explaining that the order was reversed — it never shows a negative result." },
  { q: "Does the countdown update automatically?", a: "The countdown is calculated from the moment you load or change the target date. Refresh the page to see the count update as time passes." },
  { q: "Are leap years and different month lengths handled correctly?", a: "Yes. The years/months/days breakdown uses real calendar arithmetic, and the total-days figure is derived from the raw millisecond difference, so every leap day is counted automatically." },
  { q: "Can I use this for age instead of a general date range?", a: "You can, but our dedicated Age Calculator adds age-specific extras like your next birthday countdown and total hours/minutes lived — use that instead for birthdate-specific questions." },
];

function Article() {
  return (
    <>
      <h2>How date calculations work</h2>
      <p>
        Counting "days between two dates" sounds like a one-line subtraction, but the moment you need the
        answer broken into years, months and days instead of a single raw number, you run straight into the
        same irregular-calendar problem every date tool has to solve.
      </p>
      <h3>Two different questions, two different methods</h3>
      <p>
        This calculator answers two distinct questions with two distinct methods. For a{" "}
        <strong>calendar breakdown</strong> ("X years, Y months, Z days"), we compute the year and month
        difference first, then borrow a month using long-subtraction logic when the end date's day-of-month
        falls before the start date's — the same approach used in our{" "}
        <Link to="/age-calculator">Age Calculator</Link>. For a <strong>single total</strong> ("how many days
        total"), we skip calendar arithmetic entirely and divide the raw millisecond gap between the two
        timestamps by 86,400,000 (milliseconds in a day) — a method that's naturally leap-year-safe because
        it never has to reason about calendar rules at all.
      </p>
      <h3>Worked example</h3>
      <p>
        Someone resigning from a job on August 25, 2026 with a 4-week notice period needs their last working
        day: that's exactly 28 days later, landing on <strong>September 22, 2026</strong>. Using the
        calendar breakdown, that's "0 years, 0 months, 28 days" — but expressed as weeks, it's a cleaner
        "exactly 4 weeks," which is often the more useful framing for a notice period.
      </p>
      <p>
        For a longer-range example: counting down from August 25, 2026 to a wedding on October 12, 2027
        gives <strong>1 year, 1 month, 17 days</strong> — or, as a single total,{" "}
        <strong>413 days</strong>.
      </p>
      <h3>Common mistake: inclusive vs. exclusive counting</h3>
      <p>
        The most common source of "off by one" confusion isn't the calculator — it's the question being
        asked. "Days between March 1 and March 5" can mean 4 days (the gap) or 5 days (if you're counting
        both the start and end day as full days, e.g. for a hotel stay or rental period). This calculator
        returns the <em>gap</em> (4, in that example) by default; if you need an inclusive count for
        something like a rental agreement, add 1 to the result.
      </p>
      <h3>Common uses</h3>
      <ul>
        <li>Counting down to a wedding, exam, launch date or holiday.</li>
        <li>Working out contract, notice period or project timelines.</li>
        <li>Calculating how many days you've been at a job or in a relationship.</li>
        <li>Checking whether a deadline falls within a certain number of business days (manually exclude weekends from the total).</li>
      </ul>
      <h3>Related tools</h3>
      <p>
        If your date math ultimately needs to become an <em>age</em> in years and months rather than a
        countdown or gap, the <Link to="/age-calculator">Age Calculator</Link> is purpose-built for that.
        For splitting a percentage-based deadline or grace period, the{" "}
        <Link to="/percentage-calculator">Percentage Calculator</Link> can help.
      </p>
      <p>
        See also:{" "}
        <Link to="/blog/$slug" params={{ slug: "age-calculator-explained" }}>Age Calculator Explained (With Real Examples)</Link>{" "}
        for more on the calendar-borrowing logic used here.
      </p>
    </>
  );
}
