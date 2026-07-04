import { useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useGetCompanyStats, useListProjects } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, ShieldCheck, Sparkles, Users } from "lucide-react";
import ScrollHouse from "@/components/3d/ScrollHouse";
import { assetUrl } from "@/lib/utils";

function useCountUp(target: number) {
  return target;
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="font-serif text-4xl md:text-5xl font-semibold text-primary">
        {value}
        {suffix}
      </div>
      <div className="mt-2 text-sm md:text-base text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function FeaturedProjectCard({
  project,
  index,
}: {
  project: { id: number; title: string; category: string; material: string; area: number; price: number; imageUrl: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.id}`}>
        <div className="group relative overflow-hidden rounded-2xl bg-card border border-border cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={assetUrl(project.imageUrl)}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="p-6">
            <span className="text-xs uppercase tracking-wider text-secondary font-medium">
              {project.category === "house" ? "Дом" : "Баня"} · {project.material}
            </span>
            <h3 className="mt-2 font-serif text-xl font-medium">{project.title}</h3>
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>{project.area} м²</span>
              <span className="font-medium text-foreground">
                от {project.price.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const { data: stats } = useGetCompanyStats();
  const { data: featured } = useListProjects({ featured: true });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });

  // House assembles over the first 70% of the hero scroll, then holds fully built
  // for the remaining 30% before releasing smoothly into the content below.
  const [houseProgress, setHouseProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHouseProgress(Math.min(Math.max(v / 0.7, 0), 1));
  });

  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const heroSceneOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0.9]);

  return (
    <div>
      <section ref={heroRef} className="relative h-[250vh]">
        <div className="sticky top-[72px] md:top-[84px] h-[calc(100vh-72px)] md:h-[calc(100vh-84px)] overflow-hidden">
          <motion.div style={{ opacity: heroSceneOpacity }} className="absolute inset-0">
            <ScrollHouse progress={houseProgress} />
          </motion.div>
          <motion.div
            style={{ opacity: heroTextOpacity, y: heroTextY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          >
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-secondary font-medium mb-4">
              Строительство домов и бань под ключ
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium max-w-4xl leading-[1.05]">
              Дом строится на ваших глазах —{" "}
              <span className="text-primary">прокрутите вниз</span>
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
              От фундамента до крыши. Мы возводим деревянные, каркасные и кирпичные дома,
              а также бани — надёжно, в срок, с гарантией.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center pointer-events-auto">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/projects">
                  Смотреть проекты <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link href="/contacts">Оставить заявку</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 bg-background py-20 md:py-28 border-t border-border"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <StatCard value={stats?.yearsOnMarket ?? 0} suffix=" лет" label="на рынке" />
            <StatCard value={stats?.projectsBuilt ?? 0} suffix="+" label="построенных объектов" />
            <StatCard value={stats?.happyClients ?? 0} suffix="+" label="довольных клиентов" />
            <StatCard value={stats?.teamSize ?? 0} suffix="" label="мастеров в команде" />
          </div>
        </div>
      </motion.section>

      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-12"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Избранные проекты
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium">
              Дома и бани, которыми мы гордимся
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(featured ?? []).slice(0, 6).map((project, i) => (
              <FeaturedProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/projects">
                Все проекты <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Hammer, title: "Строим под ключ", text: "От проекта и фундамента до финальной отделки — без подрядчиков-посредников." },
              { icon: ShieldCheck, title: "Гарантия качества", text: "Официальный договор, фиксированная смета и гарантия на конструктив до 10 лет." },
              { icon: Users, title: "Своя бригада", text: "Опытные мастера в штате — никаких случайных субподрядчиков на вашем участке." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-6 text-secondary" />
          <h2 className="font-serif text-3xl md:text-5xl font-medium max-w-2xl mx-auto">
            Готовы начать строительство своего дома?
          </h2>
          <p className="mt-4 text-background/70 max-w-lg mx-auto">
            Оставьте заявку — мы свяжемся с вами и поможем подобрать проект под ваш участок и бюджет.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <Link href="/contacts">Оставить заявку</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
