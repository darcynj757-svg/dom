import house68Ext1 from "@/assets/houses/house-68-ext-1.png";
import house68Ext2 from "@/assets/houses/house-68-ext-2.png";
import house68Plan from "@/assets/houses/house-68-plan.png";

import house89Ext1 from "@/assets/houses/house-89-ext-1.png";
import house89Ext2 from "@/assets/houses/house-89-ext-2.png";
import house89Plan from "@/assets/houses/house-89-plan.png";

import house123Ext from "@/assets/houses/house-123-ext.png";
import house123Plan1 from "@/assets/houses/house-123-plan-1.png";
import house123Plan2 from "@/assets/houses/house-123-plan-2.png";

import house126Ext1 from "@/assets/houses/house-126-ext-1.png";
import house126Ext2 from "@/assets/houses/house-126-ext-2.png";
import house126Plan from "@/assets/houses/house-126-plan.png";

import house159Ext from "@/assets/houses/house-159-ext.png";
import house159Plan1 from "@/assets/houses/house-159-plan-1.png";
import house159Plan2 from "@/assets/houses/house-159-plan-2.png";

import house236Ext from "@/assets/houses/house-236-ext.png";
import house236Plan1 from "@/assets/houses/house-236-plan-1.png";
import house236Plan2 from "@/assets/houses/house-236-plan-2.png";

import house134Ext from "@/assets/houses/house-134-ext.png";
import house134Plan from "@/assets/houses/house-134-plan.png";

import house217Ext from "@/assets/houses/house-217-ext.png";
import house217Plan1 from "@/assets/houses/house-217-plan-1.png";
import house217Plan2 from "@/assets/houses/house-217-plan-2.png";

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
  /** Exterior photos/renders shown in the gallery, in addition to imageUrl */
  gallery: string[];
  /** Technical floor-plan drawings, shown separately from exterior photos */
  plans?: string[];
  price?: string;
  bedrooms?: number;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Проект Д68",
    area: 68,
    floors: 1,
    material: "Рубленное бревно (кругляк)",
    category: "house",
    description:
      "Одноэтажный дом площадью 68 м² из рубленного кругляка. Тёплые бревенчатые стены, компактная и функциональная планировка без внутренних лестниц — уютное жильё для небольшой семьи или дачи.",
    features: [
      "Стены из кругляка диаметром 220–260 мм",
      "Один этаж — никаких лестниц, удобно для семей с детьми",
      "Бесплатный проект при заказе строительства",
      "Гарантия на конструктив, строительство под ключ",
    ],
    featured: true,
    imageUrl: house68Ext1,
    gallery: [house68Ext2],
    plans: [house68Plan],
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
    description:
      "Двухэтажный дом площадью 89 м² из профилированного бруса. Компактный «мансардный» силуэт с высокой кровлей и просторной планировкой на два этажа — хороший баланс площади и стоимости.",
    features: [
      "Профилированный брус: кедр, сосна или лиственница на выбор",
      "Два полноценных этажа на компактном пятне застройки",
      "Бесплатный проект при заказе строительства",
      "Строительство под ключ, гарантия на конструктив",
    ],
    featured: true,
    imageUrl: house89Ext1,
    gallery: [house89Ext2],
    plans: [house89Plan],
    price: "от 979 000 ₽",
    bedrooms: 3,
  },
  {
    id: 3,
    title: "Проект Д126",
    area: 126,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description:
      "Двухэтажный дом площадью 126 м² из профилированного бруса с эркером и широкой террасой по периметру. Просторный, светлый дом для большой семьи с местом для отдыха на свежем воздухе.",
    features: [
      "Эркер и терраса по всему периметру первого этажа",
      "Профилированный брус, материал стен на выбор",
      "Бесплатный проект при заказе строительства",
      "Большая гостиная, строительство под ключ",
    ],
    featured: false,
    imageUrl: house126Ext1,
    gallery: [house126Ext2],
    plans: [house126Plan],
    price: "от 1 386 000 ₽",
    bedrooms: 3,
  },
  {
    id: 4,
    title: "Проект Д123",
    area: 123,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description:
      "Двухэтажный дом площадью 123 м². Первый этаж около 56 м² и второй такой же площади — удобное зонирование: гостиная и кухня внизу, спальни наверху.",
    features: [
      "Площадь 1-го этажа ≈ 56 м², 2-го этажа ≈ 57 м²",
      "Профилированный брус, два варианта материала стен",
      "Бесплатный проект при заказе строительства",
      "Гарантия на конструктив",
    ],
    imageUrl: house123Ext,
    gallery: [],
    plans: [house123Plan1, house123Plan2],
    price: "от 1 353 000 ₽",
    bedrooms: 4,
  },
  {
    id: 5,
    title: "Проект Д159",
    area: 159,
    floors: 2,
    material: "Брус",
    category: "house",
    description:
      "Двухэтажный дом площадью 159 м² из бруса. Площадь 1-го этажа — 79 м², 2-го — 80 м². Просторный семейный дом с чётким разделением зон отдыха и приватных комнат.",
    features: [
      "Площадь 1-го этажа: 79 м²",
      "Площадь 2-го этажа: 80 м²",
      "Бесплатный проект при заказе строительства",
      "Строительство под ключ",
    ],
    featured: true,
    imageUrl: house159Ext,
    gallery: [],
    plans: [house159Plan1, house159Plan2],
    price: "от 1 749 000 ₽",
    bedrooms: 4,
  },
  {
    id: 6,
    title: "Проект Д134",
    area: 134,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description:
      "Двухэтажный дом площадью 134 м² из профилированного бруса под четырёхскатной кровлей. Компактная, но продуманная планировка с несколькими спальнями и просторной гостиной.",
    features: [
      "Профилированный брус, четырёхскатная кровля",
      "Несколько спален и просторная гостиная",
      "Бесплатный проект при заказе строительства",
      "Строительство под ключ",
    ],
    imageUrl: house134Ext,
    gallery: [],
    plans: [house134Plan],
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
    description:
      "Двухэтажный дом площадью 217 м² с балконом и аркой на входе. Площадь 1-го этажа ≈ 108 м², 2-го ≈ 109 м² — просторный коттедж для большой семьи с отдельными зонами для отдыха.",
    features: [
      "Площадь 1-го этажа ≈ 108 м², 2-го этажа ≈ 109 м²",
      "Балкон и входная арка",
      "Бесплатный проект при заказе строительства",
      "Строительство под ключ, гарантия на конструктив",
    ],
    featured: true,
    imageUrl: house217Ext,
    gallery: [],
    plans: [house217Plan1, house217Plan2],
    price: "от 2 387 000 ₽",
    bedrooms: 5,
  },
  {
    id: 8,
    title: "Проект Д236",
    area: 236,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description:
      "Двухэтажный дом площадью 236 м² — флагманский проект компании. Площадь 1-го этажа ≈ 118 м², 2-го ≈ 119 м². Масштаб и комфорт для тех, кому нужно много места.",
    features: [
      "Площадь 1-го этажа ≈ 118 м², 2-го этажа ≈ 119 м²",
      "Профилированный брус, материал на выбор",
      "Бесплатный проект при заказе строительства",
    ],
    imageUrl: house236Ext,
    gallery: [],
    plans: [house236Plan1, house236Plan2],
    price: "от 2 596 000 ₽",
    bedrooms: 5,
  },
];

export function getProjectById(id: number): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
