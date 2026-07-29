import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
const maxIcon = "/max-icon.webp";

const MESSENGERS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/73822334439",
    color: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    key: "telegram",
    label: "Telegram",
    href: "https://t.me/+73822334439",
    color: "#229ED9",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#229ED9]">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    key: "max",
    label: "Макс",
    href: "https://max.ru/kedrtomsk",
    color: "#5B5FEF",
    icon: (
      <img src={maxIcon} alt="Макс" className="w-8 h-8 object-contain rounded-sm" />
    ),
  },
];

export default function FloatingMessenger() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Показываем кнопку через 1 секунду после загрузки
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Пузырьки мессенджеров */}
      <AnimatePresence>
        {open &&
          MESSENGERS.map((m, i) => (
            <motion.a
              key={m.key}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              title={m.label}
              initial={{ opacity: 0, y: 16, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.85 }}
              transition={{ duration: 0.22, delay: (MESSENGERS.length - 1 - i) * 0.06 }}
              className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              style={{ boxShadow: `0 4px 20px ${m.color}40` }}
            >
              <span className="flex-shrink-0 scale-150">{m.icon}</span>
            </motion.a>
          ))}
      </AnimatePresence>

      {/* Основная кнопка — liquid glass */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(182,157,114,0.55) 0%, rgba(182,157,114,0.35) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 8px 32px rgba(182,157,114,0.4), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.35)",
        }}
        aria-label="Написать нам"
      >
        {/* Блик сверху */}
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.45) 0%, transparent 70%)" }} />

        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-white drop-shadow-sm relative z-10"
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-white drop-shadow-sm relative z-10"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

      </motion.button>
    </div>
  );
}
