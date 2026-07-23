import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { ARTICLES } from "@/data/articles-data";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif font-medium mb-4">Статья не найдена</h1>
        <Link href="/articles" className="text-primary underline">
          ← Вернуться к статьям
        </Link>
      </div>
    );
  }

  // Related: same category, different article
  const related = ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== article.slug
  ).slice(0, 3);

  // Build content blocks: interleave headings + paragraphs
  const blocks: { type: "heading" | "para"; text: string }[] = [];
  const headings = [...article.headings];
  const paras = [...article.paragraphs];

  // First paragraph before any heading
  if (paras.length > 0) blocks.push({ type: "para", text: paras.shift()! });

  while (headings.length > 0) {
    blocks.push({ type: "heading", text: headings.shift()! });
    // 2-3 paragraphs per heading
    const count = Math.min(3, Math.ceil(paras.length / Math.max(1, headings.length + 1)));
    for (let i = 0; i < count && paras.length > 0; i++) {
      blocks.push({ type: "para", text: paras.shift()! });
    }
  }
  // Remaining paragraphs
  paras.forEach((p) => blocks.push({ type: "para", text: p }));

  return (
    <div>
      {/* Hero image — flush to top, transparent header overlays it */}
      {article.image && (
        <div className="w-full aspect-[3/2] md:aspect-[16/9] overflow-hidden bg-muted relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Breadcrumb — below the hero */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/articles" className="hover:text-foreground transition-colors">Статьи</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        {/* Back link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Все статьи
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            {article.category}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-5 text-sm text-muted-foreground pb-8 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
          </div>
        </motion.div>

        {/* Article body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          {blocks.map((block, i) =>
            block.type === "heading" ? (
              <h2
                key={i}
                className="font-serif text-xl md:text-2xl font-medium mt-10 mb-4 text-foreground"
              >
                {block.text}
              </h2>
            ) : (
              <p
                key={i}
                className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg"
              >
                {block.text}
              </p>
            )
          )}

          {/* Additional images */}
          {article.images.length > 1 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.images.slice(1, 3).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-[4/3] bg-muted">
                  <img src={img} alt={`${article.title} — фото ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h3 className="font-serif text-2xl font-medium mb-3">Готовы построить свой дом?</h3>
          <p className="text-muted-foreground mb-6">Оставьте заявку — мы подберём проект под ваш участок и бюджет.</p>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all duration-200 shadow-md"
          >
            Оставить заявку
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-serif text-2xl font-medium mb-8">Читайте также</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((a) => (
                <Link key={a.slug} href={`/articles/${a.slug}`}>
                  <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer">
                    {a.image && (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <span className="text-xs uppercase tracking-wider text-secondary font-medium">
                        {a.category}
                      </span>
                      <h3 className="mt-1.5 font-serif text-base font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
