type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/** Inject a JSON-LD <script> safely. */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify safely escapes strings; close-tag injection is the only risk.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
