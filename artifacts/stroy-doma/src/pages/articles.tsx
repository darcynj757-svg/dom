import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { ARTICLES, CATEGORIES } from "@/data/articles-data";

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState("Все");

  const filtered =
    activeCategory === "Все"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Полезная информация
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium">
              Статьи и публикации
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Публикации и полезная информация для клиентов от наших
              специалистов, а также от авторитетных изданий в строительной и
              деревообрабатывающей отрасли.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 border-b border-border bg-muted/30 sticky top-[72px] z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (index % 9) * 0.06 }}
              >
                <Link href={`/articles/${article.slug}`}>
                  <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs uppercase tracking-wider text-secondary font-medium">
                        {article.category}
                      </span>
                      <h2 className="mt-2 font-serif text-xl font-medium leading-snug group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
