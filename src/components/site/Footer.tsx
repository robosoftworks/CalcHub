import { Link } from "@tanstack/react-router";
import { calculators } from "@/lib/calculators";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface text-surface-foreground">
      <div className="container-tight grid gap-10 py-14 md:grid-cols-4">
        <div>
          <BrandLogo variant="light" className="text-xl" />
          <p className="mt-3 text-sm text-surface-foreground/70">
            Free, fast and accurate online calculators trusted by millions of students and professionals worldwide.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Calculators</h4>
          <ul className="space-y-2 text-sm">
            {calculators.map((c) => (
              <li key={c.slug}>
                <Link to={c.path} className="text-surface-foreground/80 hover:text-accent">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-surface-foreground/80 hover:text-accent">About Us</Link></li>
            <li><Link to="/contact" className="text-surface-foreground/80 hover:text-accent">Contact</Link></li>
            <li><Link to="/blog" className="text-surface-foreground/80 hover:text-accent">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="text-surface-foreground/80 hover:text-accent">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-surface-foreground/80 hover:text-accent">Terms & Conditions</Link></li>
            <li><Link to="/sitemap" className="text-surface-foreground/80 hover:text-accent">Sitemap</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-tight flex flex-col items-center justify-between gap-2 py-5 text-xs text-surface-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} CalcHub. All rights reserved.</p>
          <p>
            Powered by{" "}
            <a
              href="https://robosoftworks.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit RoboSoft Works (opens in a new tab)"
              aria-label="Visit RoboSoft Works (opens in a new tab)"
              className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
            >
              RoboSoft Works
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
