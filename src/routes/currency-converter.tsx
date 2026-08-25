import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/currency-converter")({
  head: () => ({
    meta: [
      { title: "Currency Converter — Live Exchange Rates (150+ Currencies)" },
      { name: "description", content: "Free real-time currency converter. USD, EUR, GBP, INR, PKR and 150+ currencies with live exchange rates." },
      { property: "og:title", content: "Currency Converter — Live Rates" },
      { property: "og:description", content: "Convert between 150+ currencies with up-to-date exchange rates." },
    ],
    links: [{ rel: "canonical", href: absUrl("/currency-converter") }],
  }),
  component: CurrencyPage,
});

const POPULAR = ["USD", "EUR", "GBP", "JPY", "INR", "PKR", "AUD", "CAD", "CHF", "CNY", "AED", "SAR", "TRY", "BRL", "ZAR", "SGD", "HKD", "NZD", "SEK", "NOK", "DKK", "MXN", "RUB", "KRW", "IDR", "MYR", "THB", "PHP", "EGP", "BDT"];

function CurrencyPage() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState<number | null>(null);
  const [updated, setUpdated] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const json = await res.json();
      if (json?.rates?.[to]) {
        setRate(json.rates[to]);
        setUpdated(json.time_last_update_utc || new Date().toUTCString());
      } else throw new Error("Rate unavailable");
    } catch {
      setError("Could not fetch live rate. Please try again in a moment.");
      setRate(null);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [from, to]);

  const converted = rate !== null ? (parseFloat(amount) || 0) * rate : null;

  return (
    <CalcLayout slug="currency-converter" title="Currency Converter" tagline="Convert between 150+ world currencies using live exchange rates, updated daily." faqs={faqs} article={<Article />}>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <Field label="From">
          <div className="flex gap-2">
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary">
              {POPULAR.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </Field>
        <button onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap currencies" className="mx-auto mb-1 grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition-smooth hover:bg-primary hover:text-primary-foreground">
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <Field label="To">
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary">
            {POPULAR.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-6 text-surface-foreground">
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : converted === null || loading ? (
          <div className="flex items-center gap-2 text-surface-foreground/70"><RefreshCw className="h-4 w-4 animate-spin" /> Fetching live rate…</div>
        ) : (
          <>
            <div className="text-xs uppercase tracking-wider text-surface-foreground/60">{amount} {from} =</div>
            <div className="mt-1 font-display text-4xl font-bold text-primary md:text-5xl">
              {converted.toLocaleString(undefined, { maximumFractionDigits: 4 })} {to}
            </div>
            <div className="mt-1 text-sm text-surface-foreground/70">1 {from} = {rate?.toFixed(4)} {to} · updated {updated}</div>
            <ResultActions text={`${amount} ${from} = ${converted.toFixed(4)} ${to}`} title="Currency conversion" onReset={() => { setFrom("USD"); setTo("EUR"); setAmount("100"); }} />
          </>
        )}
        <button onClick={load} className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10"><RefreshCw className="h-3.5 w-3.5" /> Refresh rate</button>
      </div>
    </CalcLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>;
}

const faqs = [
  { q: "How do I convert between two currencies?", a: "Pick the source in the From dropdown, the destination in the To dropdown, type a value in the Amount field, and the converted amount appears immediately along with the live rate and last-updated timestamp." },
  { q: "What does the swap (⇄) button do?", a: "It instantly switches the From and To currencies so you can flip the direction of the conversion without retyping anything. The Amount field stays the same." },
  { q: "How fresh is the exchange rate shown?", a: "We pull rates on demand from open.er-api.com (a free aggregator of central-bank rates) and display the upstream ‘time_last_update_utc’ value below the result. Hit Refresh to fetch the latest." },
  { q: "Which currencies appear in the dropdowns?", a: "30+ popular fiat currencies including USD, EUR, GBP, JPY, INR, PKR, AUD, CAD, CHF, CNY, AED, SAR and more — covering the vast majority of cross-border transactions." },
  { q: "Why am I seeing ‘Could not fetch live rate’?", a: "The rate API was briefly unreachable or rate-limited. Click the Refresh button to retry — your From, To and Amount inputs are preserved." },
];

function Article() {
  return (
    <>
      <h2>How a currency converter works</h2>
      <p>
        The number you see quoted here is the <strong>mid-market rate</strong> — the exact midpoint between
        what large banks buy and sell a currency for on the wholesale forex market. It's the "true" rate,
        refreshed constantly as trillions of dollars change hands globally. It is also, almost never, the
        rate you'll actually be charged.
      </p>
      <h3>Why your real rate is different</h3>
      <p>
        Banks, card networks, and money-transfer apps don't give you the mid-market rate — they quote their
        own rate, which bakes in a margin on top. That margin is effectively invisible unless you compare it
        to the real mid-market number, which is exactly what this converter shows you.
      </p>
      <h3>Worked example</h3>
      <p>
        Say you're sending <strong>$3,200</strong> abroad and, for illustration, the mid-market rate on this
        pair is <strong>56.00</strong> units of the destination currency per dollar. At the true rate, your
        transfer is worth <strong>179,200</strong>. But your bank's transfer desk quotes you 54.50 instead —
        a rate that looks close, but isn't. At 54.50, the same $3,200 becomes <strong>174,400</strong> —{" "}
        <strong>4,800 units (roughly $85) quietly gone</strong>, without a single explicit "fee" line item
        anywhere on the receipt.
      </p>
      <h3>Common mistake: comparing fees, not rates</h3>
      <p>
        Most people shopping for the "cheapest" way to send money compare the advertised transfer{" "}
        <em>fee</em> and stop there — a $0-fee transfer with a bad exchange rate is often more expensive
        overall than a $5-fee transfer at a rate close to mid-market. Always calculate what you'd get at the
        mid-market rate first, then compare every option — fee included — against that baseline.
      </p>
      <h3>How to use this converter</h3>
      <ol>
        <li>Pick the source currency and enter the amount.</li>
        <li>Pick the destination currency.</li>
        <li>Read the converted value, the per-unit rate and the timestamp.</li>
        <li>Use the swap button to flip the direction instantly.</li>
      </ol>
      <h3>Using this converter well</h3>
      <ul>
        <li>Check the mid-market rate here <em>before</em> you get a quote from a bank or app, so you have a real number to negotiate against or compare.</li>
        <li>For large transfers — tuition, property, importing inventory — even a 1–2% spread is real money; for splitting a dinner bill abroad, it's noise.</li>
        <li>
          If you're pricing goods or services across borders, the{" "}
          <Link to="/profit-loss-calculator">Profit &amp; Loss Calculator</Link> is useful for folding an
          exchange-rate margin into your cost basis.
        </li>
      </ul>
      <p>
        See also: <Link to="/blog/$slug" params={{ slug: "how-to-calculate-your-car-loan-emi-before-you-sign" }}>How to Calculate Your Car Loan EMI Before You Sign</Link>,
        which covers exchange-rate risk when financing a vehicle priced in a foreign currency, and the{" "}
        <Link to="/loan-calculator">Loan / EMI Calculator</Link>.
      </p>
    </>
  );
}
