export interface Project {
  id: number;
  title: string;
  area: number;
  floors: number;
  material: string;
  category: "house" | "bath";
  description: string;
  features: string[];
  featured?: boolean;
  imageUrl: string;
  gallery: string[];
  price?: string;
  bedrooms?: number;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Проект Д68",
    area: 68,
    floors: 1,
    material: "Профилированный брус",
    category: "house",
    description: "Одноэтажный дом площадью 68 м² из профилированного бруса. Компактное и функциональное жильё для небольшой семьи.",
    features: ["Кедр/Сосна/Лиственница", "Бесплатный проект при заказе строительства", "Гарантия на конструктив", "Строительство под ключ"],
    featured: true,
    imageUrl: "https://picsum.photos/seed/house68/800/600",
    gallery: [
      "https://picsum.photos/seed/house68a/800/600",
      "https://picsum.photos/seed/house68b/800/600",
    ],
    price: "от 748 000 ₽",
    bedrooms: 2,
  },
  {
    id: 2,
    title: "Проект Д89",
    area: 89,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description: "Двухэтажный дом площадью 89 м² из профилированного бруса. Просторная планировка с зонированием по этажам.",
    features: ["Кедр/Сосна/Лиственница", "Бесплатный проект при заказе строительства", "Два полноценных этажа", "Строительство под ключ"],
    featured: true,
    imageUrl: "https://picsum.photos/seed/house89/800/600",
    gallery: [
      "https://picsum.photos/seed/house89a/800/600",
      "https://picsum.photos/seed/house89b/800/600",
    ],
    price: "от 979 000 ₽",
    bedrooms: 3,
  },
  {
    id: 3,
    title: "Проект Д126",
    area: 126,
    floors: 2,
    material: "Профилированный брус / Рубленное бревно",
    category: "house",
    description: "Двухэтажный дом площадью 126 м². Просторный, удобный и уютный дом для большой семьи.",
    features: ["Материал стен на выбор", "Бесплатный проект при заказе", "Большая гостиная", "Строительство под ключ"],
    featured: false,
    imageUrl: "https://picsum.photos/seed/house126/800/600",
    gallery: ["https://picsum.photos/seed/house126a/800/600"],
    price: "от 1 386 000 ₽",
    bedrooms: 3,
  },
  {
    id: 4,
    title: "Проект Д123",
    area: 123,
    floors: 2,
    material: "Профилированный брус / Рубленное бревно",
    category: "house",
    description: "Двухэтажный дом площадью 123 м² с удобной планировкой и просторными комнатами.",
    features: ["Два варианта материала", "Бесплатный проект при заказе", "Гарантия на конструктив"],
    imageUrl: "https://picsum.photos/seed/house123/800/600",
    gallery: ["https://picsum.photos/seed/house123a/800/600"],
    price: "от 1 353 000 ₽",
    bedrooms: 4,
  },
  {
    id: 5,
    title: "Проект Д159",
    area: 159,
    floors: 2,
    material: "Профилированный брус / Рубленное бревно",
    category: "house",
    description: "Двухэтажный дом площадью 159 м². Площадь 1-го этажа — 79 м², 2-го — 80 м². Просторный семейный дом.",
    features: ["Площадь 1-го этажа: 79 м²", "Площадь 2-го этажа: 80 м²", "Бесплатный проект при заказе"],
    featured: true,
    imageUrl: "https://picsum.photos/seed/house159/800/600",
    gallery: [
      "https://picsum.photos/seed/house159a/800/600",
      "https://picsum.photos/seed/house159b/800/600",
    ],
    price: "от 1 749 000 ₽",
    bedrooms: 4,
  },
  {
    id: 6,
    title: "Проект Д134",
    area: 134,
    floors: 2,
    material: "Рубленное бревно",
    category: "house",
    description: "Двухэтажный дом площадью 134 м² из рубленного бревна — настоящий сибирский терем.",
    features: ["Рубленное бревно ручной рубки", "Кедр или сосна на выбор", "Бесплатный проект при заказе"],
    imageUrl: "https://picsum.photos/seed/house134/800/600",
    gallery: ["https://picsum.photos/seed/house134a/800/600"],
    price: "от 1 474 000 ₽",
    bedrooms: 3,
  },
  {
    id: 7,
    title: "Проект Д217",
    area: 217,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description: "Двухэтажный дом площадью 217 м² — просторный коттедж для большой семьи с отдельными зонами для отдыха.",
    features: ["Профилированный брус 200×300 мм", "Бесплатный проект при заказе", "Строительство под ключ", "Гарантия на конструктив"],
    featured: true,
    imageUrl: "https://picsum.photos/seed/house217/800/600",
    gallery: [
      "https://picsum.photos/seed/house217a/800/600",
      "https://picsum.photos/seed/house217b/800/600",
    ],
    price: "от 2 387 000 ₽",
    bedrooms: 5,
  },
  {
    id: 8,
    title: "Проект Д236",
    area: 236,
    floors: 2,
    material: "Профилированный брус / Рубленное бревно",
    category: "house",
    description: "Двухэтажный дом площадью 236 м² — флагманский проект компании для тех, кто ценит масштаб и комфорт.",
    features: ["Площадь 236 м²", "Материал на выбор", "Бесплатный проект при заказе строительства"],
    imageUrl: "https://picsum.photos/seed/house236/800/600",
    gallery: ["https://picsum.photos/seed/house236a/800/600"],
    price: "от 2 596 000 ₽",
    bedrooms: 5,
  },
];

export function getProjectById(id: number): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
