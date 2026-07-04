import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Строительство" },
  { href: "/projects", label: "Проекты" },
  { href: "/gallery", label: "Галерея" },
  { href: "/production", label: "Производство" },
  { href: "/articles", label: "Статьи" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On home page: transparent over video, then glass when scrolled.
  // On other pages: always glass-nav.
  const navClass = isHome && !isScrolled
    ? "bg-transparent border-b border-transparent py-5"
    : "glass-nav py-3";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              isHome && !isScrolled
                ? "bg-white/15 border border-white/30 text-white"
                : "bg-primary text-primary-foreground"
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <span className={`font-display text-lg font-bold tracking-tight transition-colors duration-300 ${
              isHome && !isScrolled ? "text-white" : "text-foreground"
            }`}>
              КедрДом
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap hover:opacity-100 ${
                  isHome && !isScrolled
                    ? location === link.href
                      ? "text-white"
                      : "text-white/65 hover:text-white"
                    : location === link.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:+73822334439"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                isHome && !isScrolled ? "text-white/70 hover:text-white" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+7 (3822) 33-44-39</span>
            </a>
            {isHome && !isScrolled ? (
              <button
                onClick={() => window.location.href = "/contacts"}
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-nav shadow-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-border">
              <a href="tel:+73822334439" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" /> +7 (3822) 33-44-39
              </a>
              <Button asChild className="w-full rounded-full mt-2">
                <Link href="/contacts" onClick={() => setMobileMenuOpen(false)}>Оставить заявку</Link>
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
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-white">КедрДом</span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed max-w-xs">
              Строительство деревянных домов под ключ с 2001 года. Кедр, сосна, лиственница. Томск и вся Россия.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-bold mb-4 text-white">Навигация</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/services", label: "Строительство" },
                { href: "/projects", label: "Проекты" },
                { href: "/gallery", label: "Галерея" },
                { href: "/production", label: "Производство" },
                { href: "/articles", label: "Статьи" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-background/60 hover:text-white transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-bold mb-4 text-white">Услуги</h3>
            <ul className="space-y-2.5">
              {["Дома из профилированного бруса", "Рубленные дома", "Строительство бань", "Столярные изделия", "Пиломатериал"].map((s) => (
                <li key={s} className="text-background/60 text-sm">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-bold mb-4 text-white">Контакты</h3>
            <ul className="space-y-2.5">
              <li className="text-background/60 text-sm">📍 634024, г. Томск, ул. Профсоюзная, 2/67, стр. 3</li>
              <li><a href="tel:+73822334439" className="text-background/60 hover:text-white transition-colors text-sm">📞 +7 (3822) 33-44-39</a></li>
              <li><a href="mailto:mail@kedr-tomsk.ru" className="text-background/60 hover:text-white transition-colors text-sm">✉️ mail@kedr-tomsk.ru</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-background/40 text-sm">
          <p>© {new Date().getFullYear()} КедрДом. Все права защищены.</p>
          <Link href="/terms" className="hover:text-white/70 transition-colors">Условия использования</Link>
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
