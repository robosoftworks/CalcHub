import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { calculators } from "@/lib/calculators";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link to="/" aria-label="CalcHub home" className="flex items-center">
          <BrandLogo className="h-8" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {calculators.map((c) => (
            <Link
              key={c.slug}
              to={c.path}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-smooth hover:bg-secondary hover:text-foreground"
            >
              {c.title.replace(" Calculator", "").replace(" Converter", "")}
            </Link>
          ))}
          <Link
            to="/blog"
            activeProps={{ className: "bg-accent text-accent-foreground" }}
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-smooth hover:bg-secondary"
          >
            Blog
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden rounded-md p-2 hover:bg-secondary"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-tight grid gap-1 py-3">
            {calculators.map((c) => (
              <Link
                key={c.slug}
                to={c.path}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                {c.emoji} {c.title}
              </Link>
            ))}
            <Link to="/blog" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
              📝 Blog
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
