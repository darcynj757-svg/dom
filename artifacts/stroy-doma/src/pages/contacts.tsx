import { useState } from "react";
import { motion } from "framer-motion";
import { useCreateContactRequest } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contacts() {
  const { toast } = useToast();
  const mutation = useCreateContactRequest();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(
      { data: { name: form.name, phone: form.phone, message: form.message || null, projectId: null } },
      {
        onSuccess: () => {
          toast({ title: "Заявка отправлена", description: "Мы свяжемся с вами в ближайшее время." });
          setForm({ name: "", phone: "", message: "" });
        },
      },
    );
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
          Расскажите о вашем участке и пожеланиях — мы подберём проект и рассчитаем стоимость.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {[
            { icon: Phone, title: "Телефон", value: "+7 (800) 123-45-67" },
            { icon: Mail, title: "Email", value: "info@stroydom.ru" },
            { icon: MapPin, title: "Адрес", value: "г. Москва, ул. Строителей, д. 15, офис 404" },
            { icon: Clock, title: "Режим работы", value: "Пн–Сб: 9:00–19:00" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card">
              <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">{item.title}</div>
                <div className="font-medium mt-0.5">{item.value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          <h2 className="font-serif text-2xl font-medium mb-6">Оставить заявку</h2>
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
            <Button type="submit" className="w-full rounded-full" size="lg" disabled={mutation.isPending}>
              {mutation.isPending ? "Отправка..." : "Отправить заявку"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
