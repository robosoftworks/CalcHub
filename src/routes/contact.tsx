import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CalcHub — Suggest a Calculator or Report an Issue" },
      { name: "description", content: "Get in touch with the CalcHub team. Suggest new calculators, report bugs or partner with us." },
      { property: "og:title", content: "Contact CalcHub" },
      { property: "og:description", content: "Reach the CalcHub team — we read every message." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email.");
    if (msg.trim().length < 10) return setError("Message must be at least 10 characters.");
    setSent(true);
  }

  return (
    <div className="container-tight py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contact us</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Suggest a new calculator, report an issue or just say hi. We aim to reply within 2 business days.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground"><Mail className="h-4 w-4" /></div>
              <div><div className="text-xs text-muted-foreground">Email</div><div className="font-semibold">hello@calchub.example</div></div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground"><MessageCircle className="h-4 w-4" /></div>
              <div><div className="text-xs text-muted-foreground">Support hours</div><div className="font-semibold">Mon–Fri, 9–5 GMT</div></div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl text-accent-foreground">✓</div>
              <h2 className="mt-3 text-xl font-bold">Message sent</h2>
              <p className="mt-1 text-sm text-muted-foreground">Thanks {name} — we’ll be in touch soon.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">Send a message</h2>
              <div className="mt-4 space-y-3">
                <label className="block"><span className="mb-1 block text-sm font-semibold">Name</span><input value={name} maxLength={100} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></label>
                <label className="block"><span className="mb-1 block text-sm font-semibold">Email</span><input type="email" value={email} maxLength={255} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></label>
                <label className="block"><span className="mb-1 block text-sm font-semibold">Message</span><textarea rows={5} value={msg} maxLength={1000} onChange={(e) => setMsg(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent" /></label>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button type="submit" className="w-full rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-foreground hover:opacity-90">Send message</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
