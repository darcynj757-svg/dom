import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { Calendar, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { ARTICLES } from "@/data/articles-data";
import { useSeo } from "@/hooks/useSeo";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = ARTICLES.find((a) => a.slug === slug);

  useSeo(
    article
      ? {
          title: article.title,
          description: article.excerpt ?? article.title,
        }
      : { title: "Статья не найдена" }
  );

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

  // Build content blocks: interleave headings + paragraphs + inline images
  type Block =
    | { type: "heading"; text: string }
    | { type: "para"; text: string }
    | { type: "image"; src: string; caption: string };

  const blocks: Block[] = [];
  const headings = [...article.headings];
  const paras = [...article.paragraphs];
  // images[0] = hero cover; images[1..] = one per heading section (skip first heading)
  const sectionImgs = article.images.slice(1);

  // First paragraph before any heading
  if (paras.length > 0) blocks.push({ type: "para", text: paras.shift()! });

  let headingIdx = 0;
  while (headings.length > 0) {
    blocks.push({ type: "heading", text: headings.shift()! });
    // 2-3 paragraphs per heading
    const count = Math.min(3, Math.ceil(paras.length / Math.max(1, headings.length + 1)));
    for (let i = 0; i < count && paras.length > 0; i++) {
      blocks.push({ type: "para", text: paras.shift()! });
    }
    // Inline image after section content (skip first heading — covered by hero)
    if (headingIdx > 0 && sectionImgs[headingIdx - 1]) {
      blocks.push({ type: "image", src: sectionImgs[headingIdx - 1], caption: headings[0] ?? "" });
    }
    headingIdx++;
  }
  // Remaining paragraphs
  paras.forEach((p) => blocks.push({ type: "para", text: p }));

  const { sectionRef, y } = useHeroParallax();

  return (
    <div>
      {/* Hero image — flush to top, transparent header overlays it */}
      {article.image && (
        <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="w-full aspect-[3/2] md:aspect-[16/9] overflow-hidden bg-muted relative">
          <motion.div style={{ y }} className="absolute inset-x-0 -top-[15%] h-[130%]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/30" />

          {/* Title block inside hero */}
          <div className="absolute inset-x-0 bottom-0 container mx-auto px-4 md:px-6 pb-10 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors mb-5"
              >
                <ArrowLeft className="w-4 h-4" />
                Все статьи
              </Link>
              <span className="block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider mb-4 w-fit">
                {article.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-white mb-5 drop-shadow-md">
                {article.title}
              </h1>
              <div className="flex items-center gap-5 text-sm text-white/80">
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
          </div>
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
            ) : block.type === "image" ? (
              <div key={i} className="my-8 rounded-xl overflow-hidden aspect-[16/9] bg-muted">
                <img
                  src={block.src}
                  alt={block.caption || article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <p
                key={i}
                className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg"
              >
                {block.text}
              </p>
            )
          )}
        </motion.div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h3 className="font-serif text-2xl font-bold mb-3">Готовы построить свой дом?</h3>
          <p className="text-muted-foreground mb-6">Оставьте заявку — мы подберём проект под ваш участок и бюджет.</p>
          <Link
            href="/contacts#form"
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
            <h2 className="font-serif text-2xl font-bold mb-8">Читайте также</h2>
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
                      <h3 className="mt-1.5 font-serif text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
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
