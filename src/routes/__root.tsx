import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieConsent } from "@/components/site/CookieConsent";
import { CommandPalette } from "@/components/site/CommandPalette";
import { JsonLd } from "@/components/site/JsonLd";
import { SITE_URL, absUrl } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The calculator you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:opacity-90"
          >
            Back to CalcHub
          </Link>
        </div>
      </div>
    </div>
  );
}

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CalcHub — Free Online Calculators for Everything" },
      {
        name: "description",
        content:
          "Free online calculators: GPA, age, percentage, profit & loss, currency converter and more. Fast, accurate, mobile-friendly.",
      },
      { name: "author", content: "CalcHub" },
      { name: "theme-color", content: "#e27828" },
      { name: "format-detection", content: "telephone=no" },
      { property: "og:site_name", content: "CalcHub" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: absUrl("/og-image.png") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: absUrl("/og-image.png") },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      { rel: "preload", as: "style", href: FONTS_HREF },
      { rel: "stylesheet", href: FONTS_HREF, media: "print" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  // Tiny inline script promotes the print stylesheet to all media after load,
  // so fonts don't block first paint. Falls back via <noscript>.
  const promoteFonts =
    "document.querySelectorAll('link[rel=stylesheet][media=print]').forEach(function(l){l.media='all';});";
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before hydration so the correct theme applies on first paint (no flash).
            suppressHydrationWarning above is required because this script intentionally
            makes the client's className differ from the server-rendered markup. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
        <noscript>
          <link rel="stylesheet" href={FONTS_HREF} />
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
        <script dangerouslySetInnerHTML={{ __html: promoteFonts }} />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CalcHub",
    url: SITE_URL,
    logo: absUrl("/favicon.svg"),
    sameAs: [],
    description:
      "Free online calculators for students, professionals and everyday math.",
  };
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CalcHub",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <CommandPalette />
      <JsonLd data={[orgLd, siteLd]} />
    </div>
  );
}
