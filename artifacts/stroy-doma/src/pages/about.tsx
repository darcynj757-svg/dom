import { motion } from "framer-motion";
import { ShieldCheck, Hammer, Clock, TreePine, Layers, Truck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const TIMELINE = [
  { year: "2001", text: "Основана компания «Кедр-Томск», первые объекты в Томской области." },
  { year: "2005", text: "Запущено собственное производство профилированного бруса." },
  { year: "2010", text: "Установлен финский 4-х сторонний станок — мощность до 500 м³ в месяц." },
  { year: "2015", text: "Начали строить по всей России, включая западные регионы." },
  { year: "2022", text: "Более 200 построенных объектов — дома, коттеджи, бани, беседки." },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Надёжность",
    text: "Работаем по договору с фиксированной сметой и гарантией на конструктив.",
  },
  {
    icon: Hammer,
    title: "Мастерство",
    text: "Собственная бригада опытных плотников со средним стажем от 10 лет.",
  },
  {
    icon: Clock,
    title: "Сроки",
    text: "Строим дом под ключ в оптимальные сроки. Чёткий график — без задержек.",
  },
  {
    icon: TreePine,
    title: "Качество материалов",
    text: "Кедр, сосна и лиственница с северных участков тайги Томской области.",
  },
];

const EQUIPMENT = [
  { icon: Layers, label: "Ленточная пилорама" },
  { icon: Hammer, label: "Финский 4-х сторонний станок" },
  { icon: Truck, label: "Грузовой автотранспорт с манипуляторами" },
  { icon: ShieldCheck, label: "Два башенных крана" },
];

const STATS = [
  { value: "25+", label: "лет на рынке" },
  { value: "200+", label: "объектов построено" },
  { value: "500", label: "м³ бруса в месяц" },
  { value: "3", label: "породы сибирского дерева" },
];

export default function About() {
  return (
    <div>
      {/* Hero with video background */}
      <section className="relative min-h-[70vh] flex items-end border-b border-border overflow-hidden">
        {/* Video background */}
        <video
          src="/videos/kedr-house-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium">
              О компании
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium text-white">
              Строим деревянные дома с 2001 года
            </h1>
            <p className="mt-6 text-white/75 leading-relaxed text-lg">
              Наша компания ведёт деятельность в секторе строительства деревянных
              домов и малоэтажной застройки в г. Томске и Томской области с 2001
              года. За это время накоплен большой опыт в постройке домов, а также
              в проектировании и монтаже деревянных объектов — от домов и
              коттеджей до бань и беседок.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 bg-muted/40 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="font-serif text-4xl font-semibold text-primary">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className="py-20 md:py-28 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-10"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Процесс строительства
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium">
              Как мы строим дома из кругляка
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Рубленые дома из сибирского кедра и сосны — наш главный профиль.
              Посмотрите, как мы возводим сруб ручной рубки от заготовки бревна до готового объекта.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border"
            style={{ aspectRatio: "16/9" }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/x6RkIS8cZQQ?rel=0&modestbranding=1&color=white"
              title="Строительство рубленого дома из бревна ручной рубки"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-6 justify-center"
          >
            {[
              "Ручная рубка",
              "Кедр и сосна",
              "Сибирский лес",
              "Строительство под ключ",
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About text */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">
                Качество — главная цель
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Компания «Кедр-Томск» получает качественный пиломатериал с
                  северных участков тайги Томской области, что гарантирует
                  качество используемой нами древесины.
                </p>
                <p>
                  Кедр, сосна и лиственница — при строительстве домов мы
                  выбираем эти породы древесины за их выдающиеся качества и как
                  прошедшие проверку временем.
                </p>
                <p>
                  Основной вид деятельности — строительство домов и производство
                  профилированного бруса. Наши мастера строят по всей Сибири и
                  России. Накопленные знания в области строительства деревянных
                  сооружений — залог качества и успешного претворения в жизнь
                  самых смелых замыслов наших заказчиков.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">
                Производственные мощности
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                <p>
                  Собственное производство в черте г. Томска и наличие ж/д
                  подъездных путей обеспечивают оперативное выполнение заказов и
                  возможность отгрузки пиломатериала в любую точку России.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EQUIPMENT.map((eq) => (
                  <div
                    key={eq.label}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
                  >
                    <eq.icon className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-sm font-medium">{eq.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-12">
            Наши принципы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-6 p-8 rounded-2xl border border-border bg-card"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <v.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium mb-2">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-12">
            История компании
          </h2>
          <div className="relative border-l-2 border-border pl-8 space-y-10">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[2.65rem] top-0.5 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                <div className="font-serif text-2xl font-semibold text-primary mb-1">
                  {item.year}
                </div>
                <p className="text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #B69D72 0%, transparent 60%), radial-gradient(circle at 70% 50%, #B69D72 0%, transparent 60%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 md:px-6 text-center relative z-10"
        >
          <h2 className="font-display font-black text-white max-w-2xl mx-auto" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Готовы построить дом вашей мечты?
          </h2>
          <p className="mt-4 text-background/60 max-w-lg mx-auto">
            Оставьте заявку — мы свяжемся с вами, проконсультируем и подберём проект под ваш бюджет.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-10 py-6 text-base font-bold bg-white text-foreground hover:bg-white/90">
            <Link href="/contacts">Оставить заявку</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
