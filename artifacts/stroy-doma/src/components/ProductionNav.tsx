import { Link } from "wouter";
import brusImg from "@assets/f51883c1-98dd-4cb9-89a4-dfc8e2a6c040_1784923816103.webp";
import pilomaterialImg from "@assets/service-pilomaterial.webp";

const ITEMS = [
  {
    id: "profbrus",
    href: "/production/profilirovanny-brus",
    title: "Профилированный брус",
    image: brusImg,
  },
  {
    id: "pilomaterial",
    href: "/production/pilomaterial",
    title: "Пиломатериал",
    image: pilomaterialImg,
  },
];

export function ProductionNav({ current }: { current: string }) {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex overflow-x-auto gap-0">
          {ITEMS.map((item) => {
            const isActive = item.id === current;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-4 flex-shrink-0 border-b-2 transition-all duration-200 ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
