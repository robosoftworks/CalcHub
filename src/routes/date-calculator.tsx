import { createFileRoute } from "@tanstack/react-router";
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
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-smooth ${mode === m ? "bg-accent text-accent-foreground" : "border border-border bg-card hover:bg-secondary"}`}
          >
            {m === "diff" ? "Days between two dates" : "Countdown to a date"}
          </button>
        ))}
      </div>

      {mode === "diff" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="From date"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></Field>
            <Field label="To date"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></Field>
          </div>
          {diffResult ? (
            <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
              <div className="text-xs uppercase tracking-wider text-surface-foreground/60">
                {diffResult.swapped ? "To date is before From date — showing absolute difference" : "Difference"}
              </div>
              <div className="mt-1 font-display text-4xl font-bold text-accent md:text-5xl">
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
          <Field label="Target date"><input type="date" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></Field>
          {countdownResult ? (
            <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
              <div className="text-xs uppercase tracking-wider text-surface-foreground/60">{countdownResult.isPast ? "That date was" : "Time remaining"}</div>
              <div className="mt-1 font-display text-4xl font-bold text-accent md:text-5xl">
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
        Counting the days between two dates sounds simple, but calendars are irregular: months have
        different lengths, and leap years add an extra day every four years (with exceptions). A reliable
        date calculator has to account for both.
      </p>
      <h3>Years, months and days breakdown</h3>
      <p>
        We first find the year and month difference, then check whether the target day-of-month is earlier
        than the start day-of-month. If so, we "borrow" a month and use that previous month's actual length
        to compute the remaining days — the same process you'd use doing long subtraction by hand.
      </p>
      <h3>Total days and weeks</h3>
      <p>
        For a single "how many days total" number, we skip calendar arithmetic entirely and just divide the
        raw millisecond difference between the two timestamps by 86,400,000 (the number of milliseconds in
        a day). This is naturally leap-year-safe since it doesn't depend on calendar rules at all.
      </p>
      <h3>Common uses</h3>
      <ul>
        <li>Counting down to a wedding, exam, launch date or holiday.</li>
        <li>Working out contract, notice period or project timelines.</li>
        <li>Calculating how many days you've been at a job or in a relationship.</li>
        <li>Checking whether a deadline falls within a certain number of business days (manually exclude weekends from the total).</li>
      </ul>
      <h3>A note on time zones</h3>
      <p>
        This calculator works entirely with calendar dates (no time-of-day), so results are the same
        regardless of your time zone — there's no ambiguity about "which day" something falls on.
      </p>
    </>
  );
}
