import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, User, Send, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { GoogleMap } from "@/components/ui/google-map";
import { submitForm } from "@/lib/submitForm";
import { useSeo } from "@/hooks/useSeo";
import { COMPANY } from "@/data/contacts";

export default function Contacts() {
  useSeo({
    title: "Контакты",
    description: "Свяжитесь с Кедр Томск: +7 (3822) 33-44-39, г. Томск, мкр. Черемошники. Оставьте заявку на строительство деревянного дома.",
  });
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from) setSource(decodeURIComponent(from));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("pending");
    setErrorMsg("");
    try {
      await submitForm({
        name: form.name,
        phone: form.phone,
        message: form.message,
        subject: source
          ? `Заявка с сайта: ${source}`
          : "Новая заявка с сайта kedr-tomsk.ru",
      });
      setStatus("success");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  const { sectionRef, y } = useHeroParallax();

  return (
    <div className="pb-20 md:pb-28">
      {/* Hero */}
      <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute inset-x-0 -top-[15%] h-[130%]"
        >
          <motion.img
            src="/images/office-hero.webp"
            alt="Офис Кедр Томск"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-10 md:pb-14">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xs uppercase tracking-[0.3em] text-secondary font-medium mb-3"
          >
            Контакты
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="font-serif text-2xl md:text-4xl lg:text-6xl font-black text-white max-w-xl"
          >
            Свяжитесь с нами
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-3 text-white/70 max-w-lg"
          >
            Мы открыты для общения и консультаций. Воспользуйтесь удобным для вас способом связи.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-12 md:pt-16">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          {[
            {
              icon: MapPin,
              title: "Адрес",
              value: `634024, Россия, ${COMPANY.address.full}`,
            },
            {
              icon: Phone,
              title: "Офис",
              value: COMPANY.phoneFormatted,
            },
            {
              icon: User,
              title: "Директор Серебряков Павел Михайлович",
              value: "+7 (952) 88-00-973",
            },
            {
              icon: Mail,
              title: "Email",
              value: COMPANY.email,
            },
            {
              icon: Clock,
              title: "Режим работы",
              value: "Пн–Пт: 9:00–18:00, Сб: 10:00–16:00",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card flex-1"
            >
              <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">{item.title}</div>
                <div className="font-medium mt-0.5">{item.value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div id="form" className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <Send className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                Заявка
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-1">
              Оставить заявку
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Ответим в течение 24 часов
            </p>

            {/* Source badge */}
            {source && (
              <div className="inline-flex items-center gap-1.5 bg-primary/8 border border-primary/20 text-primary rounded-full px-3 py-1.5 text-xs font-medium mb-6">
                <Tag className="w-3 h-3 flex-shrink-0" />
                {source}
              </div>
            )}

            {/* Messenger shortcuts */}
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">
                Написать напрямую
              </p>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://wa.me/73822334439"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 hover:bg-[#25D366]/10 hover:border-[#25D366]/40 transition-all duration-200 py-3 text-sm font-medium group"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-foreground/80 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
                </a>

                <a
                  href="https://t.me/+73822334439"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 hover:bg-[#229ED9]/10 hover:border-[#229ED9]/40 transition-all duration-200 py-3 text-sm font-medium group"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#229ED9]">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-foreground/80 group-hover:text-[#229ED9] transition-colors">Telegram</span>
                </a>

                <a
                  href="https://max.ru/kedrtomsk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 hover:bg-[#5B5FEF]/10 hover:border-[#5B5FEF]/40 transition-all duration-200 py-3 text-sm font-medium group"
                >
                  <img src="/max-icon.webp" alt="Макс" className="w-4 h-4 object-contain rounded-sm" />
                  <span className="text-foreground/80 group-hover:text-[#5B5FEF] transition-colors">Макс</span>
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">или заполните форму</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Успешная отправка */}
            {status === "success" ? (
              <div className="flex flex-col items-center text-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Заявка отправлена!</p>
                  <p className="text-muted-foreground text-sm mt-1">Мы свяжемся с вами в течение 24 часов.</p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-sm text-primary underline underline-offset-2"
                >
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
            /* Form fields */
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                placeholder="Ваше имя"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                placeholder="Телефон"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm resize-none"
                placeholder="Расскажите о вашем проекте (необязательно)"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              {status === "error" && (
                <div className="flex items-center gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg || `Не удалось отправить. Позвоните нам: ${COMPANY.phoneFormatted}`}
                </div>
              )}
              <button
                type="submit"
                disabled={status === "pending"}
                className="w-full bg-foreground text-background rounded-full py-3.5 text-sm font-semibold hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {status === "pending" ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* Yandex Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-12 rounded-2xl overflow-hidden border border-border"
      >
        <GoogleMap className="w-full" style={{ height: 400 }} />
      </motion.div>

      </div>
    </div>
  );
}
