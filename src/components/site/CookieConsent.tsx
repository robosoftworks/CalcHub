import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem("calchub_cookie_consent")) setShow(true);
    } catch {
      // localStorage may be blocked (private mode, embedded contexts) — fail silent
    }
  }, []);

  function persist(value: "accepted" | "declined") {
    try { localStorage.setItem("calchub_cookie_consent", value); } catch { /* ignore */ }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-border bg-surface p-4 text-surface-foreground shadow-elegant sm:flex sm:items-center sm:justify-between sm:gap-4"
    >
      <p className="text-sm">
        We use cookies to improve your experience and serve relevant ads. By using CalcHub you agree to our{" "}
        <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
      </p>
      <div className="mt-3 flex gap-2 sm:mt-0">
        <button
          onClick={() => persist("declined")}
          className="rounded-md border border-white/20 px-3 py-2 text-xs font-medium hover:bg-white/10"
        >
          Decline
        </button>
        <button
          onClick={() => persist("accepted")}
          className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
