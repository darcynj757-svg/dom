import house68Ext1 from "@/assets/houses/house-68-ext-1.png";
import house68Ext2 from "@/assets/houses/house-68-ext-2.png";
import house68Plan from "@/assets/houses/house-68-plan.png";

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

import house71Ext1 from "@/assets/houses/house-71-ext-1.png";
import house71Ext2 from "@/assets/houses/house-71-ext-2.png";
import house71Plan from "@/assets/houses/house-71-plan.png";

import house143Ext1 from "@/assets/houses/house-143-ext-1.png";
import house143Ext2 from "@/assets/houses/house-143-ext-2.png";
import house143Plan1 from "@/assets/houses/house-143-plan-1.png";
import house143Plan2 from "@/assets/houses/house-143-plan-2.png";

import house187Ext1 from "@/assets/houses/house-187-ext-1.png";
import house187Ext2 from "@/assets/houses/house-187-ext-2.png";
import house187Plan1 from "@/assets/houses/house-187-plan-1.png";
import house187Plan2 from "@/assets/houses/house-187-plan-2.png";

import house251Ext1 from "@/assets/houses/house-251-ext-1.png";
import house251Ext2 from "@/assets/houses/house-251-ext-2.png";
import house251Plan1 from "@/assets/houses/house-251-plan-1.png";
import house251Plan2 from "@/assets/houses/house-251-plan-2.png";

import bath32Ext1 from "@/assets/baths/bath-32-ext-1.png";
import bath32Ext2 from "@/assets/baths/bath-32-ext-2.png";
import bath32Plan from "@/assets/baths/bath-32-plan.png";

import bath35Ext1 from "@/assets/baths/bath-35-ext-1.png";
import bath35Ext2 from "@/assets/baths/bath-35-ext-2.png";
import bath35Plan from "@/assets/baths/bath-35-plan.png";

import bath167Ext1 from "@/assets/baths/bath-167-ext-1.png";
import bath167Ext2 from "@/assets/baths/bath-167-ext-2.png";
import bath167Plan from "@/assets/baths/bath-167-plan.png";

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
    imageUrl: house68Ext2,
    gallery: [house68Ext1],
    plans: [house68Plan],
    price: "от 748 000 ₽",
    bedrooms: 2,
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
  {
    id: 9,
    title: "Проект Д71",
    area: 71,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description:
      "Компактный дом площадью 71 м² из профилированного бруса с мансардным этажом и крытой террасой у входа. Отличный вариант для дачи или небольшой семьи — уютно, но без лишних метров.",
    features: [
      "Профилированный брус, мансардный этаж",
      "Крытая терраса у входа",
      "Бесплатный проект при заказе строительства",
      "Строительство под ключ",
    ],
    featured: true,
    imageUrl: house71Ext1,
    gallery: [house71Ext2],
    plans: [house71Plan],
    price: "от 1 067 000 ₽",
    bedrooms: 2,
  },
  {
    id: 10,
    title: "Проект Д143",
    area: 143,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description:
      "Двухэтажный дом площадью 143 м² из профилированного бруса. Площадь 1-го этажа ≈ 79,5 м², 2-го ≈ 63,4 м² — просторная кухня-гостиная на первом этаже и приватные спальни на втором.",
    features: [
      "Площадь 1-го этажа ≈ 79,5 м², 2-го этажа ≈ 63,4 м²",
      "Просторная кухня-гостиная и терраса",
      "Бесплатный проект при заказе строительства",
      "Строительство под ключ",
    ],
    featured: true,
    imageUrl: house143Ext1,
    gallery: [house143Ext2],
    plans: [house143Plan1, house143Plan2],
    price: "от 1 517 000 ₽",
    bedrooms: 3,
  },
  {
    id: 11,
    title: "Проект Д187",
    area: 187,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description:
      "Двухэтажный дом площадью 187 м² из профилированного бруса с панорамным остеклением и террасой по периметру. Площадь 1-го этажа ≈ 65,8 м², 2-го ≈ 121 м² — просторные спальни и кабинет на втором этаже.",
    features: [
      "Площадь 1-го этажа ≈ 65,8 м², 2-го этажа ≈ 121 м²",
      "Панорамное остекление, терраса по периметру",
      "Бесплатный проект при заказе строительства",
      "Строительство под ключ",
    ],
    featured: true,
    imageUrl: house187Ext1,
    gallery: [house187Ext2],
    plans: [house187Plan1, house187Plan2],
    price: "от 1 981 000 ₽",
    bedrooms: 4,
  },
  {
    id: 12,
    title: "Проект Д251",
    area: 251,
    floors: 2,
    material: "Профилированный брус",
    category: "house",
    description:
      "Двухэтажный дом площадью 251 м² из профилированного бруса — самый просторный проект компании. Большая кухня-гостиная, несколько спален, гардеробные и терраса на 40 м² для отдыха на свежем воздухе.",
    features: [
      "Большая кухня-гостиная и несколько спален",
      "Гардеробные комнаты, терраса ≈ 40 м²",
      "Бесплатный проект при заказе строительства",
      "Строительство под ключ, гарантия на конструктив",
    ],
    featured: true,
    imageUrl: house251Ext1,
    gallery: [house251Ext2],
    plans: [house251Plan1, house251Plan2],
    price: "от 2 659 000 ₽",
    bedrooms: 5,
  },
  {
    id: 13,
    title: "Баня 32 м²",
    area: 32,
    floors: 1,
    material: "Профилированный брус",
    category: "bath",
    description:
      "Компактная баня площадью 32,6 м² с крытой террасой, парной, душевой и просторной комнатой отдыха ≈12,5 м². Отличный вариант для отдыха на участке в любое время года.",
    features: [
      "Парная, душевая, комната отдыха",
      "Крытая терраса ≈ 10 м²",
      "Профилированный брус",
      "Бесплатный проект при заказе строительства",
    ],
    featured: true,
    imageUrl: bath32Ext1,
    gallery: [bath32Ext2],
    plans: [bath32Plan],
    price: "от 649 000 ₽",
  },
  {
    id: 14,
    title: "Баня 35 м²",
    area: 35,
    floors: 1,
    material: "Профилированный брус",
    category: "bath",
    description:
      "Баня площадью 35,9 м² с парной, моечной, кухней и большой террасой ≈19,7 м². Просторная комната отдыха ≈12 м² подойдёт для отдыха всей семьёй.",
    features: [
      "Парная, моечная, кухня, комната отдыха",
      "Большая терраса ≈ 19,7 м²",
      "Профилированный брус",
      "Бесплатный проект при заказе строительства",
    ],
    featured: true,
    imageUrl: bath35Ext1,
    gallery: [bath35Ext2],
    plans: [bath35Plan],
    price: "от 699 000 ₽",
  },
  {
    id: 15,
    title: "Баня 167 м²",
    area: 167,
    floors: 1,
    material: "Профилированный брус",
    category: "bath",
    description:
      "Просторный банный комплекс площадью 167,7 м² с кухней-гостиной, парной, комнатой отдыха, душевой, гардеробом и террасой — полноценный дом для семейного отдыха и приёма гостей.",
    features: [
      "Кухня-гостиная, парная, комната отдыха",
      "Душевая, гардероб, техпомещение",
      "Профилированный брус",
      "Бесплатный проект при заказе строительства",
    ],
    featured: true,
    imageUrl: bath167Ext1,
    gallery: [bath167Ext2],
    plans: [bath167Plan],
    price: "от 1 899 000 ₽",
  },
];

export function getProjectById(id: number): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
