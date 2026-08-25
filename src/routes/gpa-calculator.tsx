import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { Plus, Trash2 } from "lucide-react";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/gpa-calculator")({
  head: () => ({
    meta: [
      { title: "GPA Calculator — Free 4.0 & 5.0 Scale GPA Tool | CalcHub" },
      { name: "description", content: "Calculate your GPA instantly. Add subjects, grades and credit hours. Supports 4.0 and 5.0 grading systems." },
      { property: "og:title", content: "GPA Calculator — 4.0 & 5.0 Scale" },
      { property: "og:description", content: "Free GPA calculator for high school and college. Unlimited subjects and credit hours." },
    ],
    links: [{ rel: "canonical", href: absUrl("/gpa-calculator") }],
  }),
  component: GpaPage,
});

type Row = { subject: string; grade: string; credits: string };

const SCALES: Record<string, Record<string, number>> = {
  "4.0": { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0 },
  "5.0": { "A+": 5.0, A: 5.0, "A-": 4.7, "B+": 4.3, B: 4.0, "B-": 3.7, "C+": 3.3, C: 3.0, "C-": 2.7, "D+": 2.3, D: 2.0, F: 0 },
};

function GpaPage() {
  const [scale, setScale] = useState<"4.0" | "5.0">("4.0");
  const [rows, setRows] = useState<Row[]>([
    { subject: "Mathematics", grade: "A", credits: "3" },
    { subject: "English", grade: "B+", credits: "3" },
    { subject: "Science", grade: "A-", credits: "4" },
  ]);

  const grades = SCALES[scale];
  let totalPts = 0, totalCredits = 0;
  rows.forEach((r) => {
    const c = Math.max(0, parseFloat(r.credits) || 0);
    const pt = grades[r.grade] ?? 0;
    totalPts += c * pt;
    totalCredits += c;
  });
  const gpa = totalCredits ? totalPts / totalCredits : 0;

  function update(i: number, k: keyof Row, v: string) {
    setRows((rs) => rs.map((r, j) => (i === j ? { ...r, [k]: v } : r)));
  }
  function addRow() { setRows((r) => [...r, { subject: "", grade: "A", credits: "3" }]); }
  function removeRow(i: number) { setRows((r) => r.filter((_, j) => j !== i)); }

  return (
    <CalcLayout slug="gpa-calculator" title="GPA Calculator" tagline="Add your subjects, grades and credit hours — see your GPA update in real time." faqs={faqs} article={<Article />}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Scale:</span>
          {(["4.0", "5.0"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScale(s)}
              aria-pressed={scale === s}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-smooth ${
                scale === s ? "bg-accent text-accent-foreground" : "border border-border bg-card hover:bg-secondary"
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-semibold">Subject</th>
              <th className="p-3 font-semibold">Grade</th>
              <th className="p-3 font-semibold">Credits</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="p-2"><input value={r.subject} onChange={(e) => update(i, "subject", e.target.value)} placeholder="e.g. Algebra" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></td>
                <td className="p-2">
                  <select value={r.grade} onChange={(e) => update(i, "grade", e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                    {Object.keys(grades).map((g) => <option key={g}>{g}</option>)}
                  </select>
                </td>
                <td className="p-2"><input type="number" min="0" max="10" value={r.credits} onChange={(e) => update(i, "credits", e.target.value)} className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></td>
                <td className="p-2 text-right">
                  <button onClick={() => removeRow(i)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Remove row"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={addRow} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-secondary"><Plus className="h-4 w-4" /> Add subject</button>
        <button onClick={() => setRows([{ subject: "", grade: "A", credits: "3" }])} className="rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-secondary">Reset</button>
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Your GPA</div>
            <div className="mt-1 font-display text-5xl font-bold text-accent">{gpa.toFixed(2)}</div>
            <div className="mt-1 text-sm text-surface-foreground/70">on a {scale} scale · {totalCredits} credits</div>
          </div>
          <div className="text-right text-sm text-surface-foreground/80">
            <div>Quality points: <strong>{totalPts.toFixed(2)}</strong></div>
            <div>Total credits: <strong>{totalCredits}</strong></div>
          </div>
        </div>
        <ResultActions text={`My GPA is ${gpa.toFixed(2)} on a ${scale} scale across ${totalCredits} credits.`} title="My GPA" onReset={() => setRows([{ subject: "", grade: "A", credits: "3" }])} />
      </div>
    </CalcLayout>
  );
}

const faqs = [
  { q: "What goes in the Subject, Grade and Credits fields?", a: "Subject is just a label (e.g. Mathematics). Grade is a letter from A+ down to F selected from the dropdown. Credits is the credit hours / unit weight of that course (e.g. 3 or 4)." },
  { q: "How does switching the Scale toggle (4.0 vs 5.0) change my GPA?", a: "The dropdown remaps each letter grade to a different point value. On 4.0, an A = 4.0 and B = 3.0; on 5.0 (used for honors / AP / Philippine systems), A = 5.0 and B = 4.0. Your GPA output recalculates instantly." },
  { q: "What happens if I add or remove a row?", a: "Click ‘Add subject’ to insert a new blank row, or the trash icon to delete one. The GPA output and total credit hours update on every change — no save button needed." },
  { q: "How exactly is the GPA number computed?", a: "For each row: points = grade-value × credits. The displayed GPA = sum of all points ÷ sum of all credits, so heavier courses (more credits) pull your average more strongly." },
  { q: "Do F grades and 0-credit rows affect my GPA?", a: "An F contributes 0 points but still adds its credits to the denominator, lowering your GPA. A row with 0 (or empty) credits contributes nothing and is effectively ignored." },
];

function Article() {
  return (
    <>
      <h2>What is GPA and why does it matter?</h2>
      <p>
        Your <strong>Grade Point Average (GPA)</strong> is a single number that summarises your academic performance.
        Universities, employers and scholarship boards use it as a quick proxy for how consistently you’ve
        performed across all your courses. A high GPA opens doors — to graduate school, to internships, to
        early-career jobs — but understanding how it’s calculated lets you take control of it.
      </p>
      <h3>The GPA formula</h3>
      <p>
        GPA is a <em>weighted average</em>. Each course contributes grade points equal to its grade value
        multiplied by its credit hours. Add those up, divide by the total credit hours, and you get GPA:
      </p>
      <pre className="rounded-md bg-muted p-3 text-sm">GPA = Σ(grade points × credits) / Σ(credits)</pre>
      <h3>Worked example</h3>
      <p>
        Imagine three courses: Math (A, 3 credits), English (B+, 3 credits) and Science (A-, 4 credits).
        On the 4.0 scale: <code>(4.0×3) + (3.3×3) + (3.7×4) = 12 + 9.9 + 14.8 = 36.7</code>. Total credits =
        10. GPA = 36.7 / 10 = <strong>3.67</strong>.
      </p>
      <h3>4.0 vs 5.0 grading systems</h3>
      <p>
        The most common system in the US is the unweighted 4.0 scale, where an A is worth 4.0 points. The
        5.0 scale is used for weighted GPAs that reward harder courses — for example, an A in an AP class
        might count as 5.0 instead of 4.0. Other countries use entirely different systems (e.g. percentages
        in the UK or 10-point scales in India), but our calculator’s logic is the same: enter your grade
        points and credits, get your weighted average.
      </p>
      <h3>How to improve your GPA</h3>
      <ul>
        <li>Focus on high-credit courses — they move the needle the most.</li>
        <li>Retake low grades if your school’s policy allows replacement.</li>
        <li>Track your GPA every semester so you don’t drift.</li>
        <li>Take advantage of pass/fail options for risky electives where allowed.</li>
      </ul>
      <h3>Common mistakes</h3>
      <p>
        Students often forget to count credit hours correctly, or mix grading scales between semesters.
        Always confirm your school’s official scale, because a small difference in grade-point mapping can
        shift your GPA by a tenth or more.
      </p>
    </>
  );
}
