import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Home, Bath, Layers, CheckSquare } from "lucide-react";

type Material = "profbrus" | "kruglyak";
type ObjectType = "house" | "bath";

const BASE_RATES: Record<ObjectType, Record<Material, [number, number]>> = {
  house: { profbrus: [10_500, 12_500], kruglyak: [11_500, 14_000] },
  bath:  { profbrus: [14_000, 18_000], kruglyak: [15_500, 20_000] },
};
const FLOOR_SURCHARGE = 0.12;
const FOUNDATION_RATE: [number, number] = [4_000, 6_000];
const FINISHING_RATE:  [number, number] = [9_000, 13_000];

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(n / 1000) * 1000);
}

/* ── Pill toggle ──────────────────────────────────────────────────────── */
function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-background border border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* ── Big type card ────────────────────────────────────────────────────── */
function TypeCard({
  active,
  onClick,
  icon: Icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 text-center w-full ${
        active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-background hover:border-primary/30 hover:bg-muted/40"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className={`font-semibold text-sm ${active ? "text-foreground" : "text-foreground/80"}`}>
          {label}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
      </div>
      {active && (
        <motion.div
          layoutId="type-dot"
          className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary"
        />
      )}
    </button>
  );
}

export default function Calculator() {
  const [objType,        setObjType]        = useState<ObjectType>("house");
  const [material,       setMaterial]       = useState<Material>("profbrus");
  const [area,           setArea]           = useState(100);
  const [floors,         setFloors]         = useState(1);
  const [withFoundation, setWithFoundation] = useState(false);
  const [withFinishing,  setWithFinishing]  = useState(false);

  const { min, max } = useMemo(() => {
    const [rMin, rMax] = BASE_RATES[objType][material];
    const floorMult = floors === 2 ? 1 + FLOOR_SURCHARGE : 1;
    let lo = rMin * floorMult * area;
    let hi = rMax * floorMult * area;
    if (withFoundation) { lo += FOUNDATION_RATE[0] * area; hi += FOUNDATION_RATE[1] * area; }
    if (withFinishing)  { lo += FINISHING_RATE[0]  * area; hi += FINISHING_RATE[1]  * area; }
    return { min: lo, max: hi };
  }, [objType, material, area, floors, withFoundation, withFinishing]);

  const minArea = objType === "bath" ? 20 : 50;
  const maxArea = objType === "bath" ? 200 : 350;
  const pct = ((area - minArea) / (maxArea - minArea)) * 100;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
            Онлайн-калькулятор
          </span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-black">
            Рассчитайте стоимость
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm">
            Ориентировочная цена — точный расчёт после консультации со специалистом.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

            {/* ── Form ─────────────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Type */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
                  Что строим
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <TypeCard
                    active={objType === "house"}
                    onClick={() => {
                      setObjType("house");
                      setArea(Math.min(Math.max(area, 50), 350));
                    }}
                    icon={Home}
                    label="Дом"
                    hint="Жилой дом, коттедж"
                  />
                  <TypeCard
                    active={objType === "bath"}
                    onClick={() => {
                      setObjType("bath");
                      setFloors(1);
                      setArea(Math.min(Math.max(area, 20), 200));
                    }}
                    icon={Bath}
                    label="Баня"
                    hint="Баня, гостевой дом"
                  />
                </div>
              </div>

              {/* Material + Floors */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
                  Материал
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Pill active={material === "profbrus"} onClick={() => setMaterial("profbrus")}>
                    Профилированный брус
                  </Pill>
                  <Pill active={material === "kruglyak"} onClick={() => setMaterial("kruglyak")}>
                    Рубленое бревно
                  </Pill>
                </div>

                <AnimatePresence>
                  {objType === "house" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                        Этажность
                      </p>
                      <div className="flex gap-2">
                        {[1, 2].map((f) => (
                          <Pill key={f} active={floors === f} onClick={() => setFloors(f)}>
                            <Layers className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                            {f === 1 ? "1 этаж" : "2 этажа"}
                          </Pill>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Area */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Площадь
                  </p>
                  <span className="font-black text-2xl tabular-nums text-foreground">
                    {area} <span className="text-base font-medium text-muted-foreground">м²</span>
                  </span>
                </div>

                {/* Custom slider track */}
                <div className="relative h-2 rounded-full bg-muted mb-2">
                  <div
                    className="absolute h-full rounded-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                  <input
                    type="range"
                    min={minArea}
                    max={maxArea}
                    step={5}
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  />
                  {/* Thumb */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-primary shadow-md pointer-events-none transition-all"
                    style={{ left: `calc(${pct}% - 10px)` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{minArea} м²</span>
                  <span>{maxArea} м²</span>
                </div>
              </div>

              {/* Extras */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
                  Дополнительно
                </p>
                <div className="space-y-3">
                  {[
                    {
                      id: "foundation",
                      label: "Фундамент",
                      sub: "Свайно-ростверковый",
                      price: `+${fmt(FOUNDATION_RATE[0] * area)}–${fmt(FOUNDATION_RATE[1] * area)} ₽`,
                      checked: withFoundation,
                      toggle: () => setWithFoundation((v) => !v),
                    },
                    {
                      id: "finishing",
                      label: "Отделка под ключ",
                      sub: "Чистовая внутренняя отделка",
                      price: `+${fmt(FINISHING_RATE[0] * area)}–${fmt(FINISHING_RATE[1] * area)} ₽`,
                      checked: withFinishing,
                      toggle: () => setWithFinishing((v) => !v),
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        opt.checked
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-primary/30"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        opt.checked ? "bg-primary text-primary-foreground" : "border border-border"
                      }`}>
                        {opt.checked && <CheckSquare className="w-4 h-4" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={opt.checked}
                        onChange={opt.toggle}
                        className="sr-only"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.sub}</div>
                      </div>
                      <span className={`text-xs font-medium whitespace-nowrap ${opt.checked ? "text-primary" : "text-muted-foreground"}`}>
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Result ───────────────────────────────────────────────── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white text-foreground rounded-2xl overflow-hidden border border-border">
                <div className="p-7">
                  <p className="text-foreground/50 text-xs uppercase tracking-widest font-medium">
                    Ориентировочная стоимость
                  </p>

                  <motion.div
                    key={`${min}-${max}`}
                    initial={{ opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4"
                  >
                    <div className="text-4xl font-black leading-none">
                      от {fmt(min)} ₽
                    </div>
                    <div className="text-foreground/50 text-sm mt-2">
                      до {fmt(max)} ₽
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div className="my-6 border-t border-foreground/10" />

                  {/* Breakdown */}
                  <ul className="space-y-2 text-sm text-foreground/60">
                    <li className="flex justify-between">
                      <span>{objType === "house" ? "Дом" : "Баня"} · {area} м²</span>
                      <span className="text-foreground/40 text-xs self-center">
                        {material === "profbrus" ? "брус" : "бревно"}
                      </span>
                    </li>
                    {objType === "house" && (
                      <li className="flex justify-between">
                        <span>Этажей</span>
                        <span>{floors}</span>
                      </li>
                    )}
                    {withFoundation && (
                      <li className="flex justify-between">
                        <span>Фундамент</span>
                        <span className="text-foreground/40 text-xs self-center">включён</span>
                      </li>
                    )}
                    {withFinishing && (
                      <li className="flex justify-between">
                        <span>Отделка</span>
                        <span className="text-foreground/40 text-xs self-center">включена</span>
                      </li>
                    )}
                  </ul>

                  <p className="mt-5 text-foreground/30 text-xs leading-relaxed">
                    Цены ориентировочные. Точный расчёт — после консультации.
                  </p>
                </div>

                {/* CTA */}
                <div className="px-7 pb-7 space-y-2">
                  <Link
                    href={`/contacts?from=${encodeURIComponent("Калькулятор: " + area + "м²")}#form`}
                    className="flex items-center justify-center gap-2 w-full bg-foreground text-background rounded-full py-3.5 text-sm font-bold hover:bg-foreground/90 transition-colors"
                  >
                    Получить точный расчёт <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:+73822334439"
                    className="flex items-center justify-center gap-2 w-full border border-foreground/15 text-foreground/70 rounded-full py-3 text-sm hover:bg-foreground/5 transition-colors"
                  >
                    +7 (3822) 33-44-39
                  </a>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
