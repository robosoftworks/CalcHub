import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { ArrowLeftRight, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/currency-converter")({
  head: () => ({
    meta: [
      { title: "Currency Converter — Live Exchange Rates (150+ Currencies)" },
      { name: "description", content: "Free real-time currency converter. USD, EUR, GBP, INR, PKR and 150+ currencies with live exchange rates." },
      { property: "og:title", content: "Currency Converter — Live Rates" },
      { property: "og:description", content: "Convert between 150+ currencies with up-to-date exchange rates." },
    ],
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
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent">
              {POPULAR.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </Field>
        <button onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap currencies" className="mx-auto mb-1 grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition-smooth hover:bg-accent hover:text-accent-foreground">
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <Field label="To">
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent">
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
            <div className="mt-1 font-display text-4xl font-bold text-accent md:text-5xl">
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
        Every minute, trillions of dollars worth of currency change hands in the global foreign-exchange
        market. The price of converting one currency to another — the exchange rate — is set by supply,
        demand, central-bank policy and a hundred other factors. A currency converter takes the latest
        published “mid-market” rate and applies it to your amount.
      </p>
      <h3>Mid-market rates vs the rate you’ll actually get</h3>
      <p>
        The mid-market rate is the midpoint between the buy and sell prices in the wholesale forex market.
        It’s the “true” exchange rate you see on Google, Reuters or Bloomberg. Banks, card networks and
        money-transfer apps add a margin on top — usually 0.5%–4% — and that’s how they make money.
      </p>
      <h3>How to use this converter</h3>
      <ol>
        <li>Pick the source currency and enter the amount.</li>
        <li>Pick the destination currency.</li>
        <li>Read the converted value, the per-unit rate and the timestamp.</li>
        <li>Use the swap button to flip the direction instantly.</li>
      </ol>
      <h3>When to convert</h3>
      <p>
        Exchange rates fluctuate constantly. For small everyday amounts the difference is negligible, but
        for large transfers (paying tuition abroad, buying property, importing inventory), even a 1%
        difference can be hundreds or thousands of dollars. Many travellers and freelancers use online
        services that get closer to the mid-market rate than traditional banks.
      </p>
      <h3>Hidden fees to watch for</h3>
      <ul>
        <li><strong>Spread</strong>: the markup over the mid-market rate. Often invisible.</li>
        <li><strong>Wire fees</strong>: a fixed amount per international transfer.</li>
        <li><strong>Receiving-bank fees</strong>: charged on the destination side.</li>
        <li><strong>ATM fees</strong>: both your bank and the foreign ATM operator can charge.</li>
      </ul>
      <h3>A note on accuracy</h3>
      <p>
        This tool is great for quotes, planning and rough estimates. For trade settlements or accounting,
        always confirm the rate at the moment of the actual transaction with your bank or processor.
      </p>
    </>
  );
}
