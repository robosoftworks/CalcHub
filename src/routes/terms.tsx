import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | CalcHub" },
      { name: "description", content: "Terms governing your use of CalcHub’s free online calculators and content." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="container-tight py-12 md:py-16">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2025</p>
      <div className="prose prose-neutral mt-6 max-w-3xl prose-headings:font-display prose-headings:tracking-tight">
        <p>By accessing CalcHub you agree to these Terms & Conditions. If you disagree with any part, please discontinue use of the site.</p>
        <h2>Use of the service</h2>
        <p>CalcHub provides free online calculators and educational content. You may use the site for personal and commercial purposes provided you do not (a) attempt to disrupt the service, (b) scrape content at scale, or (c) re-publish substantial portions of our content without attribution.</p>
        <h2>Accuracy & disclaimers</h2>
        <p>We strive for accurate calculations, but CalcHub is provided “as is” without warranty of any kind. Calculator results should not be considered financial, legal, medical or academic advice. Always confirm important figures with a qualified professional.</p>
        <h2>Intellectual property</h2>
        <p>All content on CalcHub — including text, code and design — is owned by CalcHub or its licensors and protected by applicable copyright laws.</p>
        <h2>Third-party links & ads</h2>
        <p>The site may contain links to third-party websites and display third-party advertisements. We are not responsible for the content or practices of those external services.</p>
        <h2>Limitation of liability</h2>
        <p>To the maximum extent permitted by law, CalcHub shall not be liable for any indirect, incidental or consequential damages arising from your use of the site.</p>
        <h2>Changes to these terms</h2>
        <p>We may update these terms from time to time. Continued use of the site after changes constitutes acceptance.</p>
        <h2>Contact</h2>
        <p>For questions about these Terms, contact us via our <Link to="/contact" className="font-semibold underline-offset-4 hover:underline">contact page</Link>.</p>
      </div>
    </div>
  );
}
