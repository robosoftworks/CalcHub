import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/password-generator")({
  head: () => ({
    meta: [
      { title: "Password Generator — Strong, Random Passwords | CalcHub" },
      { name: "description", content: "Free password generator. Create cryptographically random, strong passwords with custom length and character sets." },
      { property: "og:title", content: "Password Generator" },
      { property: "og:description", content: "Generate strong, random passwords instantly." },
    ],
    links: [{ rel: "canonical", href: absUrl("/password-generator") }],
  }),
  component: PasswordGeneratorPage,
});

const SETS = {
  lower: "abcdefghijkmnpqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  numbers: "23456789",
  symbols: "!@#$%^&*()-_=+[]{}",
};

function randomInt(max: number) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function generate(length: number, sets: string[]) {
  const pool = sets.join("");
  if (!pool) return "";
  let out = "";
  for (let i = 0; i < length; i++) out += pool[randomInt(pool.length)];
  return out;
}

function strength(length: number, poolSize: number) {
  if (!poolSize) return { label: "None", pct: 0, color: "bg-muted" };
  const bits = length * Math.log2(poolSize);
  if (bits < 40) return { label: "Weak", pct: 25, color: "bg-destructive" };
  if (bits < 60) return { label: "Fair", pct: 50, color: "bg-yellow-500" };
  if (bits < 80) return { label: "Strong", pct: 75, color: "bg-green-500" };
  return { label: "Very strong", pct: 100, color: "bg-green-600" };
}

function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const activeSets = useMemo(() => {
    const sets: string[] = [];
    if (useLower) sets.push(SETS.lower);
    if (useUpper) sets.push(SETS.upper);
    if (useNumbers) sets.push(SETS.numbers);
    if (useSymbols) sets.push(SETS.symbols);
    return sets;
  }, [useLower, useUpper, useNumbers, useSymbols]);

  const poolSize = activeSets.join("").length;

  function regenerate() {
    setPassword(generate(length, activeSets));
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, useLower, useUpper, useNumbers, useSymbols]);

  const s = strength(length, poolSize);

  return (
    <CalcLayout
      slug="password-generator"
      title="Password Generator"
      tagline="Generate cryptographically random, strong passwords with a custom length and character set."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md space-y-5">
        <div className="rounded-xl bg-surface p-5 text-center text-surface-foreground">
          {activeSets.length === 0 ? (
            <p className="text-sm text-destructive-foreground/90 text-red-300">Select at least one character type below.</p>
          ) : (
            <div className="break-all font-mono text-xl font-bold tracking-tight md:text-2xl">{password}</div>
          )}
          <button
            onClick={regenerate}
            disabled={activeSets.length === 0}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10 disabled:opacity-40"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Generate new
          </button>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Strength: {s.label}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={`h-full ${s.color} transition-all`} style={{ width: `${s.pct}%` }} />
          </div>
        </div>

        <label className="block">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Length</span>
            <span className="text-sm font-bold">{length}</span>
          </div>
          <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full primary-[oklch(0.89_0.18_100)]" />
        </label>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Toggle label="Lowercase (a-z)" checked={useLower} onChange={setUseLower} />
          <Toggle label="Uppercase (A-Z)" checked={useUpper} onChange={setUseUpper} />
          <Toggle label="Numbers (0-9)" checked={useNumbers} onChange={setUseNumbers} />
          <Toggle label="Symbols (!@#…)" checked={useSymbols} onChange={setUseSymbols} />
        </div>

        <ResultActions text={password} title="Generated password" onReset={regenerate} />
      </div>
    </CalcLayout>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 hover:bg-secondary">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 primary-[oklch(0.89_0.18_100)]" />
      <span>{label}</span>
    </label>
  );
}

const faqs = [
  { q: "How random are these passwords, really?", a: "Fully random — the generator uses the Web Crypto API's crypto.getRandomValues(), the same cryptographically secure random source used for encryption keys, not the weaker Math.random() many web tools rely on." },
  { q: "Why are similar-looking characters like 'l', '1', 'I' and 'O', '0' excluded?", a: "To avoid passwords that are hard to read or retype accurately, especially on devices where characters look nearly identical. This slightly reduces the character pool but improves usability without meaningfully weakening security at typical lengths." },
  { q: "What does the strength meter measure?", a: "It estimates entropy in bits: length × log2(character pool size). Below ~40 bits is Weak, 40-60 is Fair, 60-80 is Strong, and 80+ is Very strong — roughly aligned with how long a brute-force attack would take." },
  { q: "Is my password sent anywhere or stored?", a: "No. Generation happens entirely in your browser using local randomness — nothing is transmitted to a server or logged anywhere." },
  { q: "What length and character mix should I use?", a: "For most accounts, 16+ characters with all four character types gives well over 90 bits of entropy — effectively uncrackable by brute force with current technology. Use a password manager so you never need to remember it." },
];

function Article() {
  return (
    <>
      <h2>What makes a password actually strong</h2>
      <p>
        Password strength comes down to one number: entropy, measured in bits. Entropy answers "how many
        guesses would an attacker need, on average, to find this password?" Length and character variety
        both increase entropy, but length matters more than most people expect.
      </p>
      <h3>Why length beats complexity</h3>
      <p>
        A 20-character lowercase-only password has more entropy than an 8-character password mixing all
        four character types. Every additional character multiplies the number of possible passwords, while
        adding a character type only multiplies by a small constant factor.
      </p>
      <h3>The entropy formula</h3>
      <pre className="rounded-md bg-muted p-3 text-sm">entropy (bits) = length × log2(pool size)</pre>
      <p>
        A 16-character password using all four sets (roughly 90 possible characters after excluding
        ambiguous ones) has about 16 × log2(90) ≈ <strong>101 bits</strong> of entropy — far beyond what
        any realistic brute-force attack can crack.
      </p>
      <h3>Why we use crypto.getRandomValues()</h3>
      <p>
        JavaScript's default <code>Math.random()</code> is a fast, predictable pseudo-random generator not
        designed for security — with enough output samples, its internal state can sometimes be
        reconstructed. <code>crypto.getRandomValues()</code> draws from the operating system's
        cryptographically secure random number generator, the same source used to generate TLS session
        keys, making it appropriate for anything security-sensitive.
      </p>
      <h3>Best practices beyond generation</h3>
      <ul>
        <li>Use a unique password for every account — reused passwords are the #1 cause of account takeovers after a data breach elsewhere.</li>
        <li>Store generated passwords in a password manager rather than memorizing or reusing patterns.</li>
        <li>Enable two-factor authentication wherever available, even with a strong password.</li>
      </ul>
    </>
  );
}
