import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo-icon-user.png";

type NavChild = { href: string; label: string };
type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
};

const NAV_LINKS: NavItem[] = [
  { href: "/about", label: "О компании" },
  {
    href: "/services",
    label: "Строительство",
    children: [
      { href: "/services#profiled-timber", label: "Дома из профилированного бруса" },
      { href: "/services#log-house", label: "Рубленные дома" },
    ],
  },
  {
    href: "/production",
    label: "Производство",
    children: [
      { href: "/production#profiled-timber", label: "Профилированный брус" },
      { href: "/production#joinery", label: "Столярные изделия" },
      { href: "/production#lumber", label: "Пиломатериал" },
    ],
  },
  { href: "/projects", label: "Проекты" },
  { href: "/articles", label: "Статьи" },
  {
    href: "/gallery",
    label: "Галерея",
    children: [
      { href: "/gallery#photo", label: "Фотогалерея" },
      { href: "/gallery#video", label: "Видеогалерея" },
    ],
  },
  { href: "/contacts", label: "Контакты" },
];

function DesktopDropdown({
  item,
  isHome,
  isScrolled,
  isActive,
}: {
  item: NavItem;
  isHome: boolean;
  isScrolled: boolean;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const linkClass = `text-sm font-medium transition-colors duration-200 whitespace-nowrap hover:opacity-100 flex items-center gap-0.5 ${
    isHome && !isScrolled
      ? isActive
        ? "text-white"
        : "text-white/65 hover:text-white"
      : isActive
      ? "text-primary"
      : "text-foreground/70 hover:text-foreground"
  }`;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link href={item.href} className={linkClass}>
        {item.label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>

      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[220px] rounded-xl shadow-lg overflow-hidden z-50 bg-white border border-border/30">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass =
    isHome && !isScrolled
      ? "bg-transparent border-b border-transparent py-5"
      : "glass-nav py-3";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClass}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-start gap-1 group flex-shrink-0">
            <div className="w-11 h-9 -mr-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src={logoIcon}
                alt="Kedr Tomsk"
                className={`w-full h-full object-contain transition-all duration-300 ${
                  isHome && !isScrolled ? "" : "invert"
                }`}
              />
            </div>
            <span
              className={`font-display text-sm font-bold tracking-tight mt-2 ml-2 transition-colors duration-300 ${
                isHome && !isScrolled ? "text-white" : "text-foreground"
              }`}
            >
              Kedr Tomsk
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? location === "/"
                  : location.startsWith(item.href);

              if (item.children) {
                return (
                  <DesktopDropdown
                    key={item.href}
                    item={item}
                    isHome={isHome}
                    isScrolled={isScrolled}
                    isActive={isActive}
                  />
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap hover:opacity-100 ${
                    isHome && !isScrolled
                      ? isActive
                        ? "text-white"
                        : "text-white/65 hover:text-white"
                      : isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:+73822334439"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                isHome && !isScrolled
                  ? "text-white/70 hover:text-white"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+7 (3822) 33-44-39</span>
            </a>
            {isHome && !isScrolled ? (
              <button
                onClick={() => (window.location.href = "/contacts")}
                className="glass px-5 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200"
              >
                Заявка
              </button>
            ) : (
              <Button asChild className="rounded-full px-5 text-sm" size="sm">
                <Link href="/contacts">Заявка</Link>
              </Button>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className={`lg:hidden p-2 transition-colors ${
              isHome && !isScrolled ? "text-white" : "text-foreground"
            }`}
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setExpandedMobile(null);
            }}
            aria-label="Меню"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-nav shadow-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {/* Главная always first on mobile */}
            <Link
              href="/"
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                location === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-muted"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Главная
            </Link>

            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? location === "/"
                  : location.startsWith(item.href);
              const isExpanded = expandedMobile === item.href;

              if (item.children) {
                return (
                  <div key={item.href}>
                    <button
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted"
                      }`}
                      onClick={() =>
                        setExpandedMobile(isExpanded ? null : item.href)
                      }
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-4 mt-0.5 flex flex-col gap-0.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 rounded-lg text-sm text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-border">
              <a
                href="tel:+73822334439"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground"
              >
                <Phone className="w-4 h-4" /> +7 (3822) 33-44-39
              </a>
              <Button asChild className="w-full rounded-full mt-2">
                <Link
                  href="/contacts"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Оставить заявку
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 border-t border-border/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src={logoIcon}
                  alt="KedrTomsk"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-white mt-3">
                Kedr Tomsk
              </span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed max-w-xs">
              Строительство деревянных домов под ключ с 2001 года. Кедр, сосна,
              лиственница. Томск и вся Россия.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-bold mb-4 text-white">
              Навигация
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "О компании" },
                { href: "/services", label: "Строительство" },
                { href: "/production", label: "Производство" },
                { href: "/projects", label: "Проекты" },
                { href: "/gallery", label: "Галерея" },
                { href: "/contacts", label: "Контакты" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-background/60 hover:text-white transition-colors text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-bold mb-4 text-white">
              Услуги
            </h3>
            <ul className="space-y-2.5">
              {[
                "Дома из профилированного бруса",
                "Рубленные дома",
                "Строительство бань",
                "Столярные изделия",
                "Пиломатериал",
              ].map((s) => (
                <li key={s} className="text-background/60 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-bold mb-4 text-white">
              Контакты
            </h3>
            <ul className="space-y-2.5">
              <li className="text-background/60 text-sm">
                📍 634024, г. Томск, ул. Профсоюзная, 2/67, стр. 3
              </li>
              <li>
                <a
                  href="tel:+73822334439"
                  className="text-background/60 hover:text-white transition-colors text-sm"
                >
                  📞 +7 (3822) 33-44-39
                </a>
              </li>
              <li>
                <a
                  href="mailto:mail@kedr-tomsk.ru"
                  className="text-background/60 hover:text-white transition-colors text-sm"
                >
                  ✉️ mail@kedr-tomsk.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-background/40 text-sm">
          <p>© {new Date().getFullYear()} KedrTomsk. Все права защищены.</p>
          <Link
            href="/terms"
            className="hover:text-white/70 transition-colors"
          >
            Условия использования
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
