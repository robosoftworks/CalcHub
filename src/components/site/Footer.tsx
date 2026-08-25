import { Link } from "@tanstack/react-router";
import { calculators } from "@/lib/calculators";
import { BrandLogo } from "./BrandLogo";

const FOOTER_SLUGS = [
  "loan-calculator",
  "bmi-calculator",
  "gpa-calculator",
  "currency-converter",
  "mortgage-calculator",
  "tip-calculator",
  "percentage-calculator",
  "age-calculator",
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.14em] text-surface-foreground/45">
      {children}
    </h4>
  );
}

export function Footer() {
  const popular = FOOTER_SLUGS.map((slug) => calculators.find((c) => c.slug === slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );

  return (
    <footer className="mt-24 border-t border-border bg-surface text-surface-foreground">
      <div className="container-tight grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <BrandLogo variant="light" className="text-xl" />
          <p className="mt-3 max-w-xs text-sm text-surface-foreground/70">
            Free, fast and accurate online calculators trusted by millions of students and professionals worldwide.
          </p>
        </div>
        <div>
          <FooterHeading>Calculators</FooterHeading>
          <ul className="space-y-2.5 text-sm">
            {popular.map((c) => (
              <li key={c.slug}>
                <Link to={c.path} className="text-surface-foreground/75 transition-smooth hover:text-primary">
                  {c.title}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link to="/sitemap" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                View all calculators
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <FooterHeading>Company</FooterHeading>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="text-surface-foreground/75 transition-smooth hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="text-surface-foreground/75 transition-smooth hover:text-primary">Contact</Link></li>
            <li><Link to="/blog" className="text-surface-foreground/75 transition-smooth hover:text-primary">Blog</Link></li>
          </ul>
        </div>
        <div>
          <FooterHeading>Legal</FooterHeading>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/privacy" className="text-surface-foreground/75 transition-smooth hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-surface-foreground/75 transition-smooth hover:text-primary">Terms & Conditions</Link></li>
            <li><Link to="/sitemap" className="text-surface-foreground/75 transition-smooth hover:text-primary">Sitemap</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-tight flex flex-col items-center justify-between gap-3 py-5 text-xs text-surface-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} CalcHub. All rights reserved. Free calculators, no sign-up.</p>
          <p>
            Powered by{" "}
            <a
              href="https://robosoftworks.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit RoboSoft Works (opens in a new tab)"
              aria-label="Visit RoboSoft Works (opens in a new tab)"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
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
