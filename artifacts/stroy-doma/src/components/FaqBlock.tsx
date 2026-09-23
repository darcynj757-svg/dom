import type { FaqItem } from "@/data/faq";

/**
 * FAQ accordion on native <details> (works without JS, fully prerendered)
 * + FAQPage JSON-LD for search engines.
 */
export function FaqBlock({
  items,
  title = "Вопросы и ответы",
  className = "",
}: {
  items: FaqItem[];
  title?: string;
  className?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <section id="faq" className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">{title}</h2>
        <div className="divide-y divide-border border-y border-border">
          {items.map((it, i) => (
            <details key={it.q} className="group py-5" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base md:text-lg font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                <h3 className="text-base md:text-lg font-semibold">{it.q}</h3>
                <span
                  aria-hidden="true"
                  className="mt-1 text-2xl leading-none text-primary transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
