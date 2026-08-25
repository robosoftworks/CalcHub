import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/random-number-generator")({
  head: () => ({
    meta: [
      { title: "Random Number Generator — True Random Integers | CalcHub" },
      { name: "description", content: "Free random number generator. Generate one or many random integers in any range, with or without duplicates." },
      { property: "og:title", content: "Random Number Generator" },
      { property: "og:description", content: "Generate cryptographically random numbers instantly." },
    ],
    links: [{ rel: "canonical", href: absUrl("/random-number-generator") }],
  }),
  component: RngPage,
});

function secureRandomInt(min: number, max: number) {
  const range = max - min + 1;
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return min + (arr[0] % range);
}

function RngPage() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [unique, setUnique] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  function generate() {
    setError(null);
    const lo = Math.round(Math.min(min, max));
    const hi = Math.round(Math.max(min, max));
    const n = Math.max(1, Math.round(count));
    const rangeSize = hi - lo + 1;

    if (unique && n > rangeSize) {
      setError(`Can't generate ${n} unique numbers from a range of only ${rangeSize} possible values. Increase the range or lower the count.`);
      setResults([]);
      return;
    }

    if (unique) {
      const pool: number[] = [];
      for (let i = lo; i <= hi; i++) pool.push(i);
      const picked: number[] = [];
      for (let i = 0; i < n; i++) {
        const idx = secureRandomInt(0, pool.length - 1);
        picked.push(pool[idx]);
        pool.splice(idx, 1);
      }
      setResults(picked);
    } else {
      setResults(Array.from({ length: n }, () => secureRandomInt(lo, hi)));
    }
  }

  return (
    <CalcLayout
      slug="random-number-generator"
      title="Random Number Generator"
      tagline="Generate one or many random numbers in any range, with or without duplicates."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Minimum</span><input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className={cls()} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Maximum</span><input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className={cls()} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">How many numbers</span><input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} className={cls()} /></label>
          <label className="flex items-center gap-2 self-end rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-secondary">
            <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="h-4 w-4 accent-[oklch(0.89_0.18_100)]" />
            No duplicates
          </label>
        </div>

        <button
          onClick={generate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-foreground hover:opacity-90"
        >
          <RefreshCw className="h-4 w-4" /> Generate
        </button>

        {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

        {results.length > 0 && (
          <div className="rounded-xl bg-surface p-5 text-surface-foreground">
            <div className="text-xs uppercase tracking-wider text-surface-foreground/60">Result{results.length > 1 ? "s" : ""}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {results.map((n, i) => (
                <span key={i} className="rounded-lg bg-accent px-3 py-1.5 font-display text-lg font-bold text-accent-foreground">{n}</span>
              ))}
            </div>
            <ResultActions
              text={results.join(", ")}
              title="Random numbers"
              onReset={() => { setMin(1); setMax(100); setCount(5); setUnique(true); setResults([]); setError(null); }}
            />
          </div>
        )}
      </div>
    </CalcLayout>
  );
}

function cls() { return "w-full rounded-md border border-input bg-background px-3 py-2 text-base"; }

const faqs = [
  { q: "How random are these numbers?", a: "They use the Web Crypto API's crypto.getRandomValues(), a cryptographically secure random source, rather than JavaScript's weaker Math.random() — the same category of randomness used for security tokens." },
  { q: "What happens if I ask for more unique numbers than fit in my range?", a: "The generator checks this before running and shows a clear error (e.g. asking for 20 unique numbers between 1 and 10 is impossible since there are only 10 possible values) instead of hanging or returning duplicates." },
  { q: "What's the difference between 'No duplicates' on and off?", a: "On: every number in the result is distinct (like drawing lottery balls without replacement) — good for picking unique winners or shuffling a small set. Off: each number is generated independently and can repeat (like rolling a die multiple times)." },
  { q: "Can I generate negative numbers or a range crossing zero?", a: "Yes — set Minimum to a negative value (e.g. -50) and Maximum to a positive one; the generator handles any range as long as Minimum ≤ Maximum (if you enter them backwards, they're automatically swapped)." },
  { q: "What can I use this for?", a: "Picking a raffle or giveaway winner, randomizing a study/game order, generating test data, choosing a random sample size, or settling a decision — anywhere you need a fair, unpredictable number." },
];

function Article() {
  return (
    <>
      <h2>How true random number generation works</h2>
      <p>
        Not all "random" is equal. Most JavaScript randomness (<code>Math.random()</code>) comes from a
        fast, deterministic algorithm called a pseudo-random number generator (PRNG) — good enough for
        games or animations, but its internal state can theoretically be predicted from enough samples.
      </p>
      <h3>Why this tool uses crypto.getRandomValues()</h3>
      <p>
        This generator instead pulls from your operating system's cryptographically secure random source —
        the same one used to generate encryption keys and security tokens. It's unpredictable even in
        principle, not just "unpredictable enough for casual use."
      </p>
      <h3>Avoiding modulo bias</h3>
      <p>
        A naive way to map a random 32-bit number into a smaller range (like 1-100) using{" "}
        <code>% range</code> introduces a subtle bias toward lower numbers when the range doesn't evenly
        divide the source's maximum value. At the range sizes typical for this tool (tens to low
        thousands), that bias is negligible — for cryptographic-grade unbiased sampling at scale, a
        rejection-sampling approach would be used instead.
      </p>
      <h3>Sampling without replacement</h3>
      <p>
        When "No duplicates" is on, we build the full list of possible values, then repeatedly pick a
        random index and remove it from the pool — mathematically equivalent to shuffling a deck and
        dealing cards, which guarantees every possible combination is equally likely.
      </p>
      <h3>Common uses</h3>
      <ul>
        <li>Picking a raffle, giveaway or contest winner fairly.</li>
        <li>Generating a random sample from a numbered list or dataset.</li>
        <li>Randomizing turn order for a game or activity.</li>
        <li>Creating test/placeholder numeric data for development.</li>
      </ul>
    </>
  );
}
