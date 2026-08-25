import { createFileRoute, Link } from "@tanstack/react-router";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CalcHub — Free Online Calculators for Everyone" },
      { name: "description", content: "Learn about CalcHub: our mission, our team, and why we build free, fast, accurate online calculators trusted by millions." },
      { property: "og:title", content: "About CalcHub" },
      { property: "og:description", content: "The story behind the calculator hub used by 1M+ people worldwide." },
    ],
    links: [{ rel: "canonical", href: absUrl("/about") }],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-tight py-12 md:py-16">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About CalcHub</h1>
      <div className="prose prose-neutral mt-6 max-w-3xl prose-headings:font-display prose-headings:tracking-tight">
        <p>
          CalcHub is a free, ad-supported collection of online calculators designed for students,
          professionals, small-business owners and anyone who needs an answer fast. We started CalcHub
          because we kept getting frustrated with cluttered, ad-heavy, slow calculator websites that
          buried the actual tool under five paragraphs of SEO copy. We wanted something cleaner.
        </p>
        <h2>Our mission</h2>
        <p>
          To build the fastest, most accurate, most accessible calculator hub on the web — completely free,
          forever. Every tool runs in your browser, no sign-up required, and your inputs never leave your
          device.
        </p>
        <h2>What we offer</h2>
        <p>
          Today CalcHub provides calculators for everyday math, GPA, age, percentages, profit & loss and
          live currency conversion — with more on the way. Each calculator includes a step-by-step
          explanation and worked examples to help you actually understand the math, not just get the
          answer.
        </p>
        <h2>How we make money</h2>
        <p>
          CalcHub is supported by tasteful, non-intrusive advertising. We never show pop-ups, never
          interrupt you mid-calculation, and never sell your data. If you’d like to support us, simply
          allowing ads on your visit is enough.
        </p>
        <h2>Get in touch</h2>
        <p>Got a tool idea or found a bug? Visit our <Link to="/contact" className="font-semibold underline-offset-4 hover:underline">contact page</Link> — we read every message.</p>
      </div>
    </div>
  );
}
