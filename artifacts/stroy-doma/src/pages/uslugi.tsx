import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import Calculator from "@/components/Calculator";
import { useSeo } from "@/hooks/useSeo";
import railwayImg from "@assets/service-railway.webp";
import proektImg from "@assets/service-proekt.webp";
import lesImg from "@assets/service-planirovka.webp";
import rostverk from "@assets/service-fundament_2.webp";
import srubImg from "@assets/740x500-bolshie-brevna-v-stroitelstve-ohotnichih-domikov.9fe_1784913541854.webp";
import dekorImg from "@assets/service-otdelka.webp";
import heroVideo from "@/assets/generated_videos/siberian-logs-construction_2.mp4";

const SERVICES = [
  {
    num: "01",
    title: "Проектирование домов, бань и коттеджей",
    description:
      "Разрабатываем индивидуальные проекты с учётом особенностей участка, климата Сибири и ваших пожеланий. Архитектурный, конструктивный и инженерный разделы.",
    price: "от 400 ₽ / м²",
    individual: false,
    image: proektImg,
  },
  {
    num: "02",
    title: "Планировка участка, дренаж, отсыпка и нивелирование",
    description:
      "Подготовим территорию к строительству: геодезия, выравнивание рельефа, устройство дренажных систем и отсыпка щебнем или песком.",
    price: "Индивидуально",
    individual: true,
    image: lesImg,
  },
  {
    num: "03",
    title: "Монтаж монолитного, свайного или свайно-ростверкового фундамента",
    description:
      "Проектируем и заливаем фундамент под любые грунтовые условия Томской области. Армирование, опалубка, бетонирование — всё под ключ.",
    price: "от 4 000 ₽ / м³",
    individual: false,
    image: rostverk,
  },
  {
    num: "04",
    title: "Монтаж сруба дома или бани на фундаменте под усадку",
    description:
      "Собственное производство пиломатериала из сибирской лиственницы и сосны. Рубка в чашу или в лапу — по выбору заказчика.",
    price: "от 60 000 ₽ / м²",
    individual: false,
    image: srubImg,
  },
  {
    num: "05",
    title: "Внутренняя и внешняя отделка деревянных домов «под ключ»",
    description:
      "Конопатка и шлифовка сруба, устройство кровли, окна, двери, инженерные сети, чистовая отделка — сдаём готовый объект.",
    price: "от 30 000 ₽ / м²",
    individual: false,
    image: dekorImg,
  },
  {
    num: "06",
    title: "Погрузка пиломатериала на железнодорожные вагоны",
    description:
      "Собственные крановое хозяйство и ж/д пути на территории предприятия. Оформляем документы, обеспечиваем надёжную увязку груза.",
    price: "Индивидуально",
    individual: true,
    image: railwayImg,
  },
];

type Service = (typeof SERVICES)[number];

function ServiceRow({ s, i }: { s: Service; i: number }) {
  const isEven = i % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: 0.05 }}
      className="rounded-3xl overflow-hidden border border-border shadow-sm"
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 min-h-[600px] ${
          isEven ? "" : "lg:[direction:rtl]"
        }`}
      >
        {/* Image */}
        <div className="relative overflow-hidden group lg:[direction:ltr] min-h-[280px] lg:min-h-0">
          <img
            src={s.image}
            alt={s.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {/* Number badge */}
          <span className="absolute top-6 left-6 bg-background/85 backdrop-blur-sm text-foreground text-xs font-mono font-bold px-3 py-1.5 rounded-lg z-10">
            {s.num}
          </span>
          {/* Price badge */}
          <span
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm shadow-lg z-10 whitespace-nowrap ${
              s.individual
                ? "bg-amber-500/90 text-white"
                : "bg-background/85 text-foreground"
            }`}
          >
            {s.price}
          </span>
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
        </div>

        {/* Text */}
        <div className="lg:[direction:ltr] flex flex-col justify-center px-8 py-12 md:px-12 lg:px-16 bg-card">
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-5">
            {s.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base mb-8">
            {s.description}
          </p>
          <Link
            href={`/contacts?from=${encodeURIComponent(s.title)}#form`}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group/link self-start border-b border-border hover:border-foreground pb-1"
          >
            Получить расчёт
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Uslugi() {
  useSeo({
    title: "Услуги",
    description: "Полный цикл строительства деревянных домов и бань в Томске: проектирование, фундамент, монтаж сруба, отделка под ключ. Кедр Томск с 2001 года.",
  });
  const isMobile = useIsMobile();
  const { sectionRef, y } = useHeroParallax();
  return (
    <div>
      {/* ── Hero — video ── */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform" style={{ y }}>
          {isMobile ? (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url(/posters/siberian-logs-construction_2.webp)" }}
            />
          ) : (
            <video
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/posters/siberian-logs-construction_2.webp"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 pt-28 md:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium">
              Услуги
            </span>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Все услуги — от фундамента до чистовой отделки
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-2xl text-white leading-relaxed text-base"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            >
              Берём полный цикл на себя: от проекта до передачи ключей — без
              субподрядчиков и скрытых наценок. Собственное производство
              пиломатериала в Томске даёт контроль над качеством и позволяет
              держать честную цену.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 space-y-5">
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.num} s={s} i={i} />
          ))}
        </div>
      </section>

      {/* ── Калькулятор ── */}
      <Calculator />

      {/* ── CTA ── */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-background mb-3">
                Готовы обсудить ваш проект?
              </h2>
              <p className="text-background/60 max-w-lg">
                Оставьте заявку — мы свяжемся с вами и подберём оптимальное
                решение под ваш участок и бюджет.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="tel:+73822334439"
                className="inline-flex items-center gap-2 border border-background/30 text-background hover:bg-background/10 transition-colors rounded-full px-7 py-3 text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                +7 (3822) 33-44-39
              </a>
              <Link
                href="/contacts?from=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8#form"
                className="inline-flex items-center justify-center gap-2 bg-background text-foreground hover:bg-background/90 transition-colors rounded-full px-7 py-3 text-sm font-medium"
              >
                Оставить заявку <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
