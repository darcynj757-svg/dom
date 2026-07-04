import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/projects", label: "Проекты" },
    { href: "/about", label: "О компании" },
    { href: "/contacts", label: "Контакты" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled ? "bg-background/90 backdrop-blur-md border-border shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">СтройДом</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
              <Phone className="w-4 h-4 text-primary" />
              <span>+7 (800) 123-45-67</span>
            </div>
            <Button asChild className="rounded-full px-6">
              <Link href="/contacts">Оставить заявку</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-md text-base font-medium ${
                location === link.href ? "bg-primary/10 text-primary" : "text-foreground/80"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-4 py-2 pt-4 border-t border-border mt-2">
            <Button asChild className="w-full rounded-full">
              <Link href="/contacts" onClick={() => setMobileMenuOpen(false)}>Оставить заявку</Link>
            </Button>
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
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">СтройДом</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed max-w-xs">
              Строительство надежных деревянных, каркасных и кирпичных домов под ключ. Воплощаем мечты о загородной жизни с 2010 года.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-4 text-white">Навигация</h3>
            <ul className="space-y-3">
              <li><Link href="/projects" className="text-background/70 hover:text-white transition-colors text-sm">Проекты</Link></li>
              <li><Link href="/about" className="text-background/70 hover:text-white transition-colors text-sm">О компании</Link></li>
              <li><Link href="/contacts" className="text-background/70 hover:text-white transition-colors text-sm">Контакты</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-4 text-white">Услуги</h3>
            <ul className="space-y-3">
              <li className="text-background/70 text-sm">Строительство домов</li>
              <li className="text-background/70 text-sm">Строительство бань</li>
              <li className="text-background/70 text-sm">Индивидуальное проектирование</li>
              <li className="text-background/70 text-sm">Отделочные работы</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-4 text-white">Контакты</h3>
            <ul className="space-y-3">
              <li className="text-background/70 text-sm">📞 +7 (800) 123-45-67</li>
              <li className="text-background/70 text-sm">✉️ info@stroydom.ru</li>
              <li className="text-background/70 text-sm">📍 г. Москва, ул. Строителей, д. 15, офис 404</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-background/50 text-sm">
          <p>© {new Date().getFullYear()} СтройДом. Все права защищены.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px] md:pt-[84px]">{children}</main>
      <Footer />
    </div>
  );
}
