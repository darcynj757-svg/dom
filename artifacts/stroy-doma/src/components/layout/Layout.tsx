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
  const isHome = location === "/" || location === "/about";
  // Article detail pages have a dark hero → white text; article list has light bg → dark text
  const isArticleDetail = location.startsWith("/articles/");
  const isArticle = location.startsWith("/articles");
  const isTransparent = isHome || isArticle;
  // White text only when overlaid on a dark hero image
  const isWhiteText = isHome || isArticleDetail;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass =
    isTransparent && !isScrolled
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
                  isWhiteText && !isScrolled ? "" : "invert"
                }`}
              />
            </div>
            <span
              className={`font-display text-lg font-bold tracking-tight mt-2 ml-2 transition-colors duration-300 ${
                isWhiteText && !isScrolled ? "text-white" : "text-foreground"
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
                    isHome={isWhiteText}
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
                    isWhiteText && !isScrolled
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
                isWhiteText && !isScrolled
                  ? "text-white/70 hover:text-white"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+7 (3822) 33-44-39</span>
            </a>
            {isWhiteText && !isScrolled ? (
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
              isWhiteText && !isScrolled ? "text-white" : "text-foreground"
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
    <footer className="bg-foreground text-background border-t border-border/10">
      {/* Thin black divider */}
      <div className="h-2 bg-black w-full" />

      {/* Full-width map strip */}
      <a
        href="https://yandex.ru/maps/?ll=84.9354%2C56.5267&z=17&pt=84.9354%2C56.5267%2Cpm2rdm&text=%D0%A2%D0%BE%D0%BC%D1%81%D0%BA%2C%20%D0%BC%D0%BA%D1%80.%20%D0%A7%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D1%88%D0%BD%D0%B8%D0%BA%D0%B8%2C%20%D1%83%D0%BB.%20%D0%9F%D1%80%D0%BE%D1%84%D1%81%D0%BE%D1%8E%D0%B7%D0%BD%D0%B0%D1%8F%2C%202%2F1%D1%8112"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-56 md:h-72 relative overflow-hidden group"
        title="Открыть в Яндекс Картах"
      >
        <img
          src="https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=84.9354,56.5267&z=15&l=map&size=650,290&pt=84.9354,56.5267,pm2rdm"
          alt="Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-foreground text-sm font-medium px-4 py-2 rounded-full shadow">
            Открыть в Яндекс Картах ↗
          </span>
        </div>
      </a>

      {/* Compact footer body */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-start gap-8">

          {/* Logo + tagline */}
          <div className="flex items-center gap-3 md:w-48 shrink-0">
            <img src={logoIcon} alt="KedrTomsk" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-display text-sm font-bold text-white block leading-tight">Kedr Tomsk</span>
              <span className="text-background/50 text-xs">с 2001 года</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 md:flex-1">
            {[
              { href: "/about", label: "О компании" },
              { href: "/services", label: "Строительство" },
              { href: "/production", label: "Производство" },
              { href: "/projects", label: "Проекты" },
              { href: "/gallery", label: "Галерея" },
              { href: "/contacts", label: "Контакты" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-background/60 hover:text-white transition-colors text-sm"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contacts */}
          <div className="flex flex-col gap-1 text-sm shrink-0">
            <span className="text-background/60 text-xs">
              📍 Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12
            </span>
            <a href="tel:+73822334439" className="text-background/60 hover:text-white transition-colors">
              📞 +7 (3822) 33-44-39
            </a>
            <a href="mailto:mail@kedr-tomsk.ru" className="text-background/60 hover:text-white transition-colors">
              ✉️ mail@kedr-tomsk.ru
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-background/40 text-xs">
          <p>© {new Date().getFullYear()} KedrTomsk. Все права защищены.</p>
          <Link href="/terms" className="hover:text-white/70 transition-colors">
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
