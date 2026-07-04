import { motion } from "framer-motion";
import { useGetCompanyStats } from "@workspace/api-client-react";
import { ShieldCheck, Hammer, Clock, Award } from "lucide-react";

const timeline = [
  { year: "2010", text: "Основана строительная бригада, первые деревянные дома под Москвой." },
  { year: "2014", text: "Открыто собственное производство каркасных конструкций." },
  { year: "2018", text: "Запущено направление строительства бань «под ключ»." },
  { year: "2023", text: "Более 300 построенных объектов по всей России." },
];

const values = [
  { icon: ShieldCheck, title: "Надёжность", text: "Работаем по договору с фиксированной сметой и гарантией на конструктив." },
  { icon: Hammer, title: "Мастерство", text: "Собственная бригада плотников и каменщиков со средним опытом от 8 лет." },
  { icon: Clock, title: "Сроки", text: "Строим дом под ключ за 2-4 месяца в зависимости от проекта." },
  { icon: Award, title: "Качество материалов", text: "Работаем только с проверенными поставщиками леса, кирпича и утеплителей." },
];

export default function About() {
  const { data: stats } = useGetCompanyStats();

  return (
    <div>
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              О компании
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium">
              Строим дома и бани, в которые хочется возвращаться
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              «СтройДом» — компания полного цикла: от проектирования и фундамента
              до финальной отделки. Мы верим, что загородный дом должен быть построен
              один раз, но качественно — поэтому берём на себя всю ответственность
              за результат.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: stats?.yearsOnMarket, suffix: " лет", label: "на рынке" },
              { value: stats?.projectsBuilt, suffix: "+", label: "объектов построено" },
              { value: stats?.happyClients, suffix: "+", label: "довольных клиентов" },
              { value: stats?.teamSize, suffix: "", label: "мастеров в штате" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="font-serif text-4xl font-semibold text-primary">
                  {s.value ?? 0}
                  {s.suffix}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-12">Наши принципы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-5 p-6 rounded-2xl border border-border bg-card"
              >
                <v.icon className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-lg font-medium mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-14">Наш путь</h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div className="font-serif text-xl font-medium text-primary">{item.year}</div>
                  <p className="mt-1 text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
