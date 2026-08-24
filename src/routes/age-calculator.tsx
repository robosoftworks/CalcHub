import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";

export const Route = createFileRoute("/age-calculator")({
  head: () => ({
    meta: [
      { title: "Age Calculator — Find Your Exact Age in Years, Months & Days" },
      { name: "description", content: "Free age calculator. Enter your date of birth to find your exact age in years, months, days, hours and total days lived." },
      { property: "og:title", content: "Age Calculator — Years, Months & Days" },
      { property: "og:description", content: "Find your exact age, days lived and time until your next birthday." },
    ],
  }),
  component: AgePage,
});

function diff(from: Date, to: Date) {
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
  return {
    years: y, months: m, days: d,
    totalDays: Math.floor(ms / 86400000),
    totalHours: Math.floor(ms / 3600000),
    totalMinutes: Math.floor(ms / 60000),
  };
}

function AgePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState("2000-01-01");
  const [target, setTarget] = useState(today);

  const result = useMemo(() => {
    const a = new Date(dob);
    const b = new Date(target);
    if (isNaN(a.getTime()) || isNaN(b.getTime()) || a > b) return null;
    return diff(a, b);
  }, [dob, target]);

  const nextBirthday = useMemo(() => {
    if (!dob) return null;
    const a = new Date(dob);
    const b = new Date(target);
    let next = new Date(b.getFullYear(), a.getMonth(), a.getDate());
    if (next < b) next = new Date(b.getFullYear() + 1, a.getMonth(), a.getDate());
    const days = Math.ceil((next.getTime() - b.getTime()) / 86400000);
    return { date: next, days };
  }, [dob, target]);

  return (
    <CalcLayout slug="age-calculator" title="Age Calculator" tagline="Find your exact age in years, months, days — and how long until your next birthday." faqs={faqs} article={<Article />}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date of birth"><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></Field>
        <Field label="Calculate age on"><input type="date" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></Field>
      </div>

      {result ? (
        <>
          <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
            <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Your age</div>
            <div className="mt-1 font-display text-4xl font-bold text-accent md:text-5xl">
              {result.years} <span className="text-lg text-surface-foreground/60">years</span>{" "}
              {result.months} <span className="text-lg text-surface-foreground/60">months</span>{" "}
              {result.days} <span className="text-lg text-surface-foreground/60">days</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <Stat label="Total days" value={result.totalDays.toLocaleString()} />
              <Stat label="Total hours" value={result.totalHours.toLocaleString()} />
              <Stat label="Total minutes" value={result.totalMinutes.toLocaleString()} />
            </div>
            {nextBirthday && (
              <div className="mt-5 rounded-lg bg-white/5 p-4 text-sm">
                🎂 Next birthday: <strong>{nextBirthday.date.toDateString()}</strong> — {nextBirthday.days} days to go.
              </div>
            )}
            <ResultActions
              text={`I am ${result.years} years, ${result.months} months and ${result.days} days old (${result.totalDays.toLocaleString()} days lived).`}
              title="My age"
              onReset={() => { setDob("2000-01-01"); setTarget(today); }}
            />
          </div>
        </>
      ) : (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Please enter a valid date of birth before today.</p>
      )}
    </CalcLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/5 p-3"><div className="text-xs text-surface-foreground/60">{label}</div><div className="mt-1 text-lg font-bold">{value}</div></div>;
}

const faqs = [
  { q: "What do I enter into the Age Calculator?", a: "Two dates: your Date of Birth and a Target date (defaults to today). The result shows your exact age in years, months and days, plus total days, hours and minutes lived." },
  { q: "How are years, months and days computed from my date of birth?", a: "We subtract the calendar parts of your DOB from the target date, borrowing days from the previous month and months from the previous year when needed — the same way you’d count manually." },
  { q: "Does the ‘total days lived’ output include leap days?", a: "Yes. The total days, hours and minutes are derived from the raw millisecond difference between the two dates, so every leap day between your DOB and the target date is automatically counted." },
  { q: "Can I use the Target date field to find my age on a future birthday?", a: "Yes. Set the Target date to any future date (e.g., your next birthday) and the years/months/days output will show how old you’ll be on that day." },
  { q: "Is my date of birth sent to a server?", a: "No. Both the DOB and Target inputs stay in your browser — the calculation runs locally with JavaScript and nothing is logged or stored." },
];

function Article() {
  return (
    <>
      <h2>How an age calculator works</h2>
      <p>
        At first glance, calculating age looks trivial: subtract one year from another. But months have
        different lengths, leap years insert an extra day, and time zones complicate things further. A
        proper age calculator uses real calendar arithmetic to give you an exact result in years, months
        and days — plus useful totals like the number of days you’ve been alive.
      </p>
      <h3>The math behind it</h3>
      <p>
        First we compute the year and month difference between your date of birth and the target date.
        If the target day-of-month is earlier than your birth day-of-month, we “borrow” a month, just like
        long subtraction. The remaining days are calculated using the previous month’s length, which
        respects February’s leap-year rule.
      </p>
      <h3>Common uses</h3>
      <ul>
        <li>Filling out forms that need exact age in years and months.</li>
        <li>Checking eligibility for school admission, voting, retirement or insurance.</li>
        <li>Counting days lived for milestone celebrations (10,000 days alive!).</li>
        <li>Knowing exactly how many days remain until your next birthday.</li>
      </ul>
      <h3>Different age systems around the world</h3>
      <p>
        Most countries use the Western system: you turn N on the Nth anniversary of your birth. South
        Korea historically used a system where you’re born at age 1 and gain a year every January 1 —
        a tradition that was officially retired in 2023. Some Asian astrology systems also count
        differently. Our calculator uses the universal Western convention.
      </p>
      <h3>Why this matters</h3>
      <p>
        Getting your age exactly right matters for legal documents, medical records and even fitness goals
        (where age determines target heart rate). With one click, this tool removes the mental math.
      </p>
    </>
  );
}
