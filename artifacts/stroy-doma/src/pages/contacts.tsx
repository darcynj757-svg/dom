import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { YandexMap } from "@/components/ui/yandex-map";

export default function Contacts() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [isPending, setIsPending] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    // Simulate submit
    setTimeout(() => {
      setIsPending(false);
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      setForm({ name: "", phone: "", message: "" });
    }, 800);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mb-16"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
          Контакты
        </span>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium">
          Свяжитесь с нами
        </h1>
        <p className="mt-4 text-muted-foreground">
          Мы открыты для общения и консультаций. Воспользуйтесь удобным для вас
          способом связи.
        </p>
      </motion.div>

      {/* Yandex Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mb-12 rounded-2xl overflow-hidden border border-border"
      >
        <YandexMap className="w-full" style={{ height: 420 }} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          {[
            {
              icon: MapPin,
              title: "Адрес",
              value: "634024, Россия, г. Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12",
            },
            {
              icon: Phone,
              title: "Офис",
              value: "+7 (3822) 33-44-39",
            },
            {
              icon: User,
              title: "Директор Серебряков Павел Михайлович",
              value: "+7 (952) 88-00-973",
            },
            {
              icon: Mail,
              title: "Email",
              value: "mail@kedr-tomsk.ru",
            },
            {
              icon: Clock,
              title: "Режим работы",
              value: "Пн–Пт: 9:00–18:00, Сб: 10:00–16:00",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card"
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
          className="rounded-2xl border border-border bg-card p-8"
        >
          <h2 className="font-serif text-2xl font-medium mb-6">
            Оставить заявку
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Ваше имя"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Телефон"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Textarea
              placeholder="Расскажите о вашем проекте (необязательно)"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <Button
              type="submit"
              className="w-full rounded-full"
              size="lg"
              disabled={isPending}
            >
              {isPending ? "Отправка..." : "Отправить заявку"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
