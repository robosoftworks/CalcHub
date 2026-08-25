import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "@/components/site/ExternalLink";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | CalcHub" },
      { name: "description", content: "How CalcHub collects, uses and protects your data — including cookies, analytics and advertising." },
    ],
    links: [{ rel: "canonical", href: absUrl("/privacy") }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="container-tight py-12 md:py-16">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2025</p>
      <div className="prose prose-neutral mt-6 max-w-3xl prose-headings:font-display prose-headings:tracking-tight">
        <p>This Privacy Policy explains how CalcHub (“we”, “us”) collects, uses and discloses information when you use our website.</p>
        <h2>Information we collect</h2>
        <p>CalcHub does not require an account. Calculator inputs are processed entirely in your browser and are not transmitted to our servers. We may automatically collect anonymous usage data (pages viewed, browser type, country) via privacy-respecting analytics.</p>
        <h2>Cookies</h2>
        <p>We use a small number of cookies to remember your preferences (e.g. your cookie-consent choice) and to enable third-party services such as advertising and analytics.</p>
        <h2>Advertising</h2>
        <p>CalcHub displays advertisements served by third-party providers including Google AdSense. These providers may use cookies and web beacons to deliver personalised ads based on your browsing activity. You can opt out of personalised advertising via Google’s <ExternalLink href="https://www.google.com/settings/ads" label="Google ad settings" className="text-accent hover:underline">ad settings</ExternalLink>.</p>
        <h2>Third-party services</h2>
        <p>The Currency Converter retrieves live exchange rates from a third-party API. No personal information is sent in those requests.</p>
        <h2>Data retention</h2>
        <p>We do not store calculator inputs or results. Anonymous analytics data may be retained for up to 26 months.</p>
        <h2>Your rights</h2>
        <p>Depending on your location, you may have the right to access, correct or delete personal data we hold about you. Contact <Link to="/contact" className="font-semibold underline-offset-4 hover:underline">our team</Link> to make such a request.</p>
        <h2>Children</h2>
        <p>CalcHub is suitable for general audiences but is not directed at children under 13. We do not knowingly collect personal information from children.</p>
        <h2>Changes</h2>
        <p>We may update this policy occasionally. We will indicate the latest revision date at the top of this page.</p>
        <h2>Contact</h2>
        <p>For privacy questions, please reach out via our <Link to="/contact" className="font-semibold underline-offset-4 hover:underline">contact page</Link>.</p>
      </div>
    </div>
  );
}
