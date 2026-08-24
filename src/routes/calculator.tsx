import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Online Calculator — Basic & Scientific | CalcHub" },
      { name: "description", content: "Free online calculator with basic and scientific modes. Add, subtract, multiply, divide, sin, cos, log and more — keyboard friendly." },
      { property: "og:title", content: "Online Calculator — Basic & Scientific" },
      { property: "og:description", content: "Fast, free calculator for everyday math, with full scientific mode and keyboard input." },
    ],
  }),
  component: CalculatorPage,
});

const BTNS = [
  ["AC", "(", ")", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];
const SCI = ["sin", "cos", "tan", "ln", "log", "√", "x²", "π"];

function tokenize(s: string) {
  return s
    .replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-")
    .replace(/π/g, "Math.PI")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/²/g, "**2")
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/log\(/g, "Math.log10(");
}

function safeEval(expr: string): string {
  if (!expr.trim()) return "";
  const tokenized = tokenize(expr);
  // Strict allow-list: digits, basic ops, parens, decimal/comma, whitespace,
  // and the Math.* identifiers our tokenizer can produce (letters + dot + *).
  if (!/^[\d+\-*/().,\sA-Za-z*]+$/.test(tokenized)) return "Error";
  try {
    // eslint-disable-next-line no-new-func
    const r = Function(`"use strict"; return (${tokenized})`)();
    if (typeof r !== "number" || !isFinite(r)) return "Error";
    return String(Math.round(r * 1e10) / 1e10);
  } catch {
    return "Error";
  }
}

function CalculatorPage() {
  const [expr, setExpr] = useState("");
  const [sci, setSci] = useState(false);
  const result = safeEval(expr);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key;
      if (/^[0-9.+\-*/()]$/.test(k)) setExpr((p) => p + k);
      else if (k === "Enter" || k === "=") {
        e.preventDefault();
        setExpr((p) => {
          const r = safeEval(p);
          return r && r !== "Error" ? r : p;
        });
      } else if (k === "Backspace") setExpr((p) => p.slice(0, -1));
      else if (k === "Escape") setExpr("");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function press(b: string) {
    if (b === "AC") return setExpr("");
    if (b === "⌫") return setExpr((p) => p.slice(0, -1));
    if (b === "=") return setExpr(result === "Error" ? "" : result);
    if (b === "x²") return setExpr((p) => p + "²"); // tokenizer maps x² but we keep ² visual
    if (["sin", "cos", "tan", "ln", "log"].includes(b)) return setExpr((p) => p + `${b}(`);
    if (b === "√") return setExpr((p) => p + "√(");
    setExpr((p) => p + b);
  }

  return (
    <CalcLayout
      slug="calculator"
      title="Online Calculator"
      tagline="A clean, fast calculator with full keyboard support and an optional scientific mode."
      faqs={faqs}
      article={<Article />}
    >
      <div className="mx-auto max-w-md">
        <div className="rounded-xl bg-surface p-4 text-right text-surface-foreground">
          <div className="min-h-5 truncate text-sm text-surface-foreground/60">{expr || "0"}</div>
          <div className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{result || "0"}</div>
        </div>

        <button
          onClick={() => setSci(!sci)}
          className="mt-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          {sci ? "Hide" : "Show"} scientific functions
        </button>

        {sci && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {SCI.map((b) => (
              <button
                key={b}
                onClick={() => press(b)}
                className="rounded-lg border border-border bg-secondary px-3 py-3 text-sm font-semibold hover:bg-accent hover:text-accent-foreground"
              >{b}</button>
            ))}
          </div>
        )}

        <div className="mt-3 grid grid-cols-4 gap-2">
          {BTNS.flat().map((b) => {
            const isOp = ["÷", "×", "−", "+"].includes(b);
            const isEq = b === "=";
            const isAc = b === "AC";
            return (
              <button
                key={b}
                onClick={() => press(b)}
                className={`rounded-lg px-3 py-4 text-lg font-semibold transition-smooth active:scale-95 ${
                  isEq ? "bg-accent text-accent-foreground hover:opacity-90" :
                  isAc ? "bg-destructive/10 text-destructive hover:bg-destructive/20" :
                  isOp ? "bg-surface text-surface-foreground hover:opacity-90" :
                  "border border-border bg-card hover:bg-secondary"
                }`}
              >{b}</button>
            );
          })}
        </div>

        <ResultActions text={`${expr || "0"} = ${result || "0"}`} title="Calculator result" onReset={() => setExpr("")} />
      </div>
    </CalcLayout>
  );
}

const faqs = [
  { q: "What do the AC, ⌫ and = buttons do?", a: "AC clears the entire expression, ⌫ deletes the last character you entered, and = evaluates the current expression and shows the result on the display." },
  { q: "How do I use the scientific buttons (sin, cos, tan, ln, log, √, x², π)?", a: "Tap a function and it’s inserted into the display — e.g. tapping sin adds ‘sin(’ so you can type the angle and close the bracket. π inserts the constant 3.14159…, and x² squares the value to its left." },
  { q: "What keyboard shortcuts work in the input?", a: "Digits 0–9, the operators + − * /, parentheses ( ), the decimal point, Enter for =, Backspace for ⌫, and Escape for AC are all mapped to the on-screen buttons." },
  { q: "How are the ÷ and × symbols handled?", a: "Internally the expression converts × to *, ÷ to /, and the unicode minus − to -, then evaluates safely. You’ll see the pretty symbols on screen but the math is standard." },
  { q: "Why does the display show ‘Error’?", a: "It means the current expression is incomplete or invalid — for example unmatched brackets, two operators in a row, or division by zero. Tap ⌫ to fix the last token or AC to start over." },
];

function Article() {
  return (
    <>
      <h2>About the online calculator</h2>
      <p>
        Whether you’re a student double-checking homework, a professional crunching numbers in a meeting,
        or someone splitting a bill, a fast online calculator is the modern equivalent of the trusty
        desk-top device. CalcHub’s basic calculator handles all the standard arithmetic operations —
        addition, subtraction, multiplication and division — and switches into a scientific mode for
        trigonometry, logarithms and roots whenever you need them.
      </p>
      <h3>Standard operations</h3>
      <p>
        The four basic operations are the foundation of every calculation. Use the on-screen buttons or
        type directly on your keyboard. Parentheses let you control the order of operations: <code>2 + 3 × 4</code>
        equals 14, but <code>(2 + 3) × 4</code> equals 20.
      </p>
      <h3>Scientific mode</h3>
      <p>
        Click “Show scientific functions” to access trigonometric functions (sin, cos, tan in radians),
        natural and base-10 logarithms, square root, square and the constant π. These are the same
        building blocks used in physics, engineering and finance.
      </p>
      <h3>Keyboard shortcuts</h3>
      <ul>
        <li><strong>0–9</strong> — enter digits</li>
        <li><strong>+ − × ÷</strong> — operations (use <code>*</code> and <code>/</code> on keyboard)</li>
        <li><strong>Backspace</strong> — delete last character</li>
        <li><strong>Esc</strong> — clear the entire expression</li>
      </ul>
      <h3>Tips for accurate results</h3>
      <p>
        Always wrap negative numbers in parentheses when raising them to powers, and remember that
        trigonometric functions in this calculator use radians. Convert from degrees by multiplying by π/180.
      </p>
      <h3>Why use an online calculator?</h3>
      <p>
        Online tools are faster than installing software, work on any device, and update instantly. CalcHub
        runs entirely in your browser — your data never touches a server, so it’s private by default.
      </p>
    </>
  );
}
