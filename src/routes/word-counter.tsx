import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalcLayout } from "@/components/site/CalcLayout";
import { ResultActions } from "@/components/site/ResultActions";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/word-counter")({
  head: () => ({
    meta: [
      { title: "Word & Character Counter — Reading Time Too | CalcHub" },
      { name: "description", content: "Free word counter and character counter. Count words, characters, sentences, paragraphs and estimated reading time for any text." },
      { property: "og:title", content: "Word & Character Counter" },
      { property: "og:description", content: "Count words, characters and reading time instantly." },
    ],
    links: [{ rel: "canonical", href: absUrl("/word-counter") }],
  }),
  component: WordCounterPage,
});

function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) ?? []).length || (trimmed ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n{2,}|\n/).filter((p) => p.trim().length > 0).length : 0;
    const readingMinutes = words / 200;
    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
  }, [text]);

  function readingTimeLabel(min: number) {
    if (min < 1) return `${Math.max(1, Math.round(min * 60))} sec`;
    return `${Math.ceil(min)} min`;
  }

  return (
    <CalcLayout
      slug="word-counter"
      title="Word & Character Counter"
      tagline="Paste or type any text to count words, characters, sentences, paragraphs and estimated reading time."
      faqs={faqs}
      article={<Article />}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Paste or type your text here…"
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Words" value={stats.words.toLocaleString()} />
        <Stat label="Characters" value={stats.characters.toLocaleString()} />
        <Stat label="Characters (no spaces)" value={stats.charactersNoSpaces.toLocaleString()} />
        <Stat label="Sentences" value={stats.sentences.toLocaleString()} />
        <Stat label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
        <Stat label="Reading time" value={readingTimeLabel(stats.readingMinutes)} />
      </div>

      <ResultActions
        text={`${stats.words} words, ${stats.characters} characters, ~${readingTimeLabel(stats.readingMinutes)} read`}
        title="Text stats"
        onReset={() => setText("")}
      />
    </CalcLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 text-center text-surface-foreground">
      <div className="text-xs text-surface-foreground/60">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

const faqs = [
  { q: "How is the word count calculated?", a: "We trim leading/trailing whitespace, then split the remaining text on any run of whitespace (spaces, tabs, line breaks) and count the resulting pieces — the same approach word processors use." },
  { q: "Why might the sentence count seem off for some text?", a: "Sentences are detected by counting punctuation marks (. ! ?) followed by whitespace or the end of the text. Abbreviations (e.g. 'Dr.', 'U.S.'), decimal numbers and ellipses can occasionally cause over- or under-counting — this is a heuristic, not a full grammar parser." },
  { q: "How is reading time estimated?", a: "We use the common average of 200 words per minute for silent adult reading. Your actual pace will vary with content difficulty and reading speed, but 200 wpm is a widely-used industry baseline (used by Medium and similar platforms)." },
  { q: "What counts as a paragraph?", a: "Any block of text separated from the next by one or more blank lines (or a single line break, whichever you use) counts as one paragraph — empty lines themselves aren't counted." },
  { q: "Is my text sent anywhere?", a: "No — counting happens entirely in your browser as you type. Nothing is uploaded, logged or stored." },
];

function Article() {
  return (
    <>
      <h2>Why word and character counts matter</h2>
      <p>
        Whether you're hitting a word-count minimum for an essay, staying under a character limit for a
        tweet or meta description, or estimating how long a blog post takes to read, a fast and accurate
        text counter saves the tedium of counting by hand.
      </p>
      <h3>Common length limits worth knowing</h3>
      <ul>
        <li><strong>SEO meta description:</strong> ~150-160 characters before Google truncates it.</li>
        <li><strong>Twitter/X post:</strong> 280 characters.</li>
        <li><strong>SMS message:</strong> 160 characters per segment.</li>
        <li><strong>College application essay:</strong> often 500-650 words.</li>
      </ul>
      <h3>How reading time is estimated</h3>
      <p>
        We divide your word count by 200 (average adult silent reading speed in words per minute) to get
        minutes, then round up. For very short text, the estimate switches to seconds so it doesn't
        misleadingly round to "1 min" for a single sentence.
      </p>
      <h3>Characters with and without spaces</h3>
      <p>
        Some character limits (like certain form fields or database columns) count every character
        including spaces, while others effectively only care about the "content" characters. We show both
        so you can check against whichever limit applies to you.
      </p>
      <h3>Tips for hitting a word count</h3>
      <p>
        If you're short, add supporting examples or expand on a claim rather than padding with filler
        words. If you're over, look for repeated ideas, redundant adjectives, and sentences that restate a
        point already made — cutting those usually tightens the writing too.
      </p>
    </>
  );
}
