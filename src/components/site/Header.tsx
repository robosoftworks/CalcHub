import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { CATEGORIES, calculators } from "@/lib/calculators";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

function openSearch() {
  window.dispatchEvent(new Event("calchub:open-search"));
}

export function Header() {
  const [open, setOpen] = useState(false);
  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-tight flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="CalcHub home" className="flex shrink-0 items-center">
          <BrandLogo className="h-8" />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {CATEGORIES.map((cat) => {
              const items = calculators.filter((c) => c.category === cat.name);
              return (
                <NavigationMenuItem key={cat.name}>
                  <NavigationMenuTrigger className="bg-transparent px-3 text-sm font-medium text-foreground/80 data-[state=open]:bg-secondary">
                    <span aria-hidden className="mr-1.5">{cat.emoji}</span>
                    {cat.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[340px] gap-1 p-3 sm:w-[420px] sm:grid-cols-2">
                      {items.map((c) => (
                        <NavigationMenuLink key={c.slug} asChild>
                          <Link
                            to={c.path}
                            className="flex items-start gap-2.5 rounded-md p-2.5 text-sm transition-smooth hover:bg-secondary"
                          >
                            <span aria-hidden className="text-lg leading-none">{c.emoji}</span>
                            <span>
                              <span className="block font-semibold leading-tight">{c.title}</span>
                              <span className="block text-xs text-muted-foreground">{c.short}</span>
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/blog"
                  activeProps={{ className: "bg-accent text-accent-foreground" }}
                  className="inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-smooth hover:bg-secondary hover:text-foreground"
                >
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={openSearch}
            aria-label="Search calculators"
            className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-smooth hover:border-accent hover:text-foreground sm:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search…</span>
            <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
          <button
            onClick={openSearch}
            aria-label="Search calculators"
            className="rounded-md p-2 hover:bg-secondary sm:hidden"
          >
            <Search className="h-5 w-5" />
          </button>

          <ThemeToggle />

          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="rounded-md p-2 hover:bg-secondary md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-tight max-h-[calc(100vh-4rem)] overflow-y-auto py-3">
            {CATEGORIES.map((cat) => {
              const items = calculators.filter((c) => c.category === cat.name);
              return (
                <div key={cat.name} className="mb-3">
                  <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {cat.emoji} {cat.name}
                  </div>
                  <div className="grid gap-1">
                    {items.map((c) => (
                      <Link
                        key={c.slug}
                        to={c.path}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                      >
                        {c.emoji} {c.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
            <Link to="/blog" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
              📝 Blog
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
