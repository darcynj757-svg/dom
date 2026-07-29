import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GoogleMap } from "@/components/ui/google-map";
import logoIcon from "@/assets/logo-icon-user.webp";
import FloatingMessenger from "@/components/FloatingMessenger";
import { COMPANY } from "@/data/contacts";

type NavChild = { href: string; label: string };
type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
};

// Prefetch a route's JS chunk on hover so navigation feels instant.
const ROUTE_PREFETCH: Record<string, () => Promise<unknown>> = {
  "/about":                               () => import("@/pages/about"),
  "/uslugi":                              () => import("@/pages/uslugi"),
  "/services/profilirovanny-brus":        () => import("@/pages/services-profbrus"),
  "/services/rublenye-doma":             () => import("@/pages/services-rublenye"),
  "/projects":                            () => import("@/pages/projects"),
  "/production/profilirovanny-brus":      () => import("@/pages/production-profbrus"),
  "/production/pilomaterial":             () => import("@/pages/production-pilomaterial"),
  "/gallery":                             () => import("@/pages/gallery"),
  "/gallery#photo":                       () => import("@/pages/gallery"),
  "/gallery#video":                       () => import("@/pages/gallery"),
  "/articles":                            () => import("@/pages/articles"),
  "/contacts":                            () => import("@/pages/contacts"),
};
function prefetch(href: string) {
  const fn = ROUTE_PREFETCH[href];
  if (fn) fn();
}

const NAV_LINKS: NavItem[] = [
  { href: "/about", label: "О компании" },
  { href: "/uslugi", label: "Услуги" },
  {
    href: "/services",
    label: "Строительство",
    children: [
      { href: "/services/profilirovanny-brus", label: "Дома из профилированного бруса" },
      { href: "/services/rublenye-doma", label: "Рубленные дома" },
    ],
  },
  { href: "/projects", label: "Проекты" },
  {
    href: "/production/profilirovanny-brus",
    label: "Производство",
    children: [
      { href: "/production/profilirovanny-brus", label: "Профилированный брус" },
      { href: "/production/pilomaterial", label: "Пиломатериал" },
    ],
  },
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

  const linkClass = `text-xs xl:text-sm font-semibold transition-colors duration-200 whitespace-nowrap hover:opacity-100 flex items-center gap-0.5 ${
    isHome && !isScrolled
      ? isActive
        ? "text-white"
        : "text-white/90 hover:text-white"
      : isActive
      ? "text-primary"
      : "text-foreground/90 hover:text-foreground"
  }`;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={linkClass}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {item.label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-1 min-w-[220px] z-50">
        <div className="rounded-xl shadow-lg overflow-hidden bg-white border border-border/30">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
              onMouseEnter={() => prefetch(child.href)}
            >
              {child.label}
            </Link>
          ))}
        </div>
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
  const isHome = location === "/" || location === "/about" || location === "/uslugi";
  // Article detail pages have a dark hero → white text; article list has light bg → dark text
  const isArticleDetail = location.startsWith("/articles/");
  const isArticle = location.startsWith("/articles");
  // Construction subpages (/services/…) and production pages have a dark photo hero — treat like home
  const isServicePage = location.startsWith("/services/");
  const isProductionPage = location.startsWith("/production/");
  const isProjectsPage = location === "/projects";
  const isContactsPage = location === "/contacts";
  const isTransparent = isHome || isArticle || isServicePage || isProductionPage || isProjectsPage || isContactsPage;
  // White text only when overlaid on a dark hero image
  const isWhiteText = isHome || isArticleDetail || isServicePage || isProductionPage || isProjectsPage || isContactsPage;

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform-gpu ${navClass}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-1 group flex-shrink-0">
            <div className="w-9 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 -translate-y-1">
              <img
                src={logoIcon}
                alt="Kedr Tomsk"
                className={`w-full h-full object-contain transition-all duration-300 ${
                  isWhiteText && !isScrolled ? "" : "invert"
                }`}
              />
            </div>
            <span
              className={`font-display text-base font-bold tracking-tight ml-1 transition-colors duration-300 ${
                isWhiteText && !isScrolled ? "text-white" : "text-foreground"
              }`}
            >
              Kedr Tomsk
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4 flex-1 justify-center">
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
                  className={`text-xs xl:text-sm font-semibold transition-colors duration-200 whitespace-nowrap hover:opacity-100 ${
                    isWhiteText && !isScrolled
                      ? isActive
                        ? "text-white"
                        : "text-white/90 hover:text-white"
                      : isActive
                      ? "text-primary"
                      : "text-foreground/90 hover:text-foreground"
                  }`}
                  onMouseEnter={() => prefetch(item.href)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <a
              href="tel:+73822334439"
              className={`flex items-center gap-1 text-xs font-semibold transition-colors duration-200 ${
                isWhiteText && !isScrolled
                  ? "text-white/90 hover:text-white"
                  : "text-foreground/90 hover:text-foreground"
              }`}
            >
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-nowrap">+7 (3822) 33-44-39</span>
            </a>
            {isWhiteText && !isScrolled ? (
              <button
                onClick={() => (window.location.href = "/contacts#form")}
                className="bg-white px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-900 hover:bg-white/90 transition-all duration-200 whitespace-nowrap"
              >
                Заявка
              </button>
            ) : (
              <Button asChild className="rounded-full px-4 text-xs h-8" size="sm">
                <Link href="/contacts#form">Заявка</Link>
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background shadow-xl border-b border-border">
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
                  href="/contacts#form"
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
              { href: "/articles", label: "Статьи" },
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
              📍 {COMPANY.address.full}
            </span>
            <a href={`tel:${COMPANY.phone}`} className="text-background/60 hover:text-white transition-colors">
              📞 {COMPANY.phoneFormatted}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="text-background/60 hover:text-white transition-colors">
              ✉️ {COMPANY.email}
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

function MapStrip() {
  const [location] = useLocation();
  if (location === "/contacts") return null;
  return (
    <div className="h-[320px] md:h-[400px] w-full">
      <GoogleMap className="w-full h-full" />
    </div>
  );
}

const JSON_LD_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: COMPANY.name,
  url: COMPANY.url,
  logo: `${COMPANY.url}/logo-icon.png`,
  image: `${COMPANY.url}/opengraph.jpg`,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  foundingDate: COMPANY.founded,
  description:
    "Строительство деревянных домов и бань из профилированного бруса и рубленого бревна. Более 200 объектов с 2001 года.",
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.region,
    addressCountry: COMPANY.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: COMPANY.geo.lat,
    longitude: COMPANY.geo.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON_LD_SCHEMA }}
      />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <MapStrip />
      <Footer />
      <FloatingMessenger />
    </div>
  );
}
