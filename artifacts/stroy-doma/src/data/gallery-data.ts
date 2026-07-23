/**
 * ФОТОГАЛЕРЕЯ — реализованные объекты
 *
 * Каждый элемент — один объект (дом, баня, интерьер).
 * `image`  — обложка, отображаемая в сетке.
 * `images` — все фото объекта (первым идёт обложка).
 *            При клике открывается лайтбокс с миниатюрами.
 */

// ── Основные фото галереи ────────────────────────────────────────────────────
import photo1  from "@/assets/gallery/photo-1.png";
import photo2  from "@/assets/gallery/photo-2.png";
import photo3  from "@/assets/gallery/photo-3.png";
import photo4  from "@/assets/gallery/photo-4.png";
import photo5  from "@/assets/gallery/photo-5.png";
import photo6  from "@/assets/gallery/photo-6.png";
import photo7  from "@/assets/gallery/photo-7.png";
import photo8  from "@/assets/gallery/photo-8.png";
import photo9  from "@/assets/gallery/photo-9.png";
import photo10 from "@/assets/gallery/photo-10.png";
import photo11 from "@/assets/gallery/photo-11.png";
import photo12 from "@/assets/gallery/photo-12.png";
import photo13 from "@/assets/gallery/photo-13.png";
import photo14 from "@/assets/gallery/photo-14.png";
import photo15 from "@/assets/gallery/photo-15.png";
import photo16 from "@/assets/gallery/photo-16.png";
import photo17 from "@/assets/gallery/photo-17.png";
import photo18 from "@/assets/gallery/photo-18.png";
import photo19 from "@/assets/gallery/photo-19.png";

// ── Дополнительные фото домов ────────────────────────────────────────────────
import house68ext1   from "@/assets/houses/house-68-ext-1.png";
import house68ext2   from "@/assets/houses/house-68-ext-2.png";
import house68plan   from "@/assets/houses/house-68-plan.png";

import house71ext1   from "@/assets/houses/house-71-ext-1.png";
import house71ext2   from "@/assets/houses/house-71-ext-2.png";
import house71plan   from "@/assets/houses/house-71-plan.png";

import house89ext1   from "@/assets/houses/house-89-ext-1.png";
import house89ext2   from "@/assets/houses/house-89-ext-2.png";
import house89plan   from "@/assets/houses/house-89-plan.png";

import house123ext   from "@/assets/houses/house-123-ext.png";
import house123plan1 from "@/assets/houses/house-123-plan-1.png";
import house123plan2 from "@/assets/houses/house-123-plan-2.png";

import house126ext1  from "@/assets/houses/house-126-ext-1.png";
import house126ext2  from "@/assets/houses/house-126-ext-2.png";
import house126plan  from "@/assets/houses/house-126-plan.png";

import house134ext   from "@/assets/houses/house-134-ext.png";
import house134plan  from "@/assets/houses/house-134-plan.png";

import house143ext1  from "@/assets/houses/house-143-ext-1.png";
import house143ext2  from "@/assets/houses/house-143-ext-2.png";
import house143plan1 from "@/assets/houses/house-143-plan-1.png";
import house143plan2 from "@/assets/houses/house-143-plan-2.png";

import house159ext   from "@/assets/houses/house-159-ext.png";
import house159plan1 from "@/assets/houses/house-159-plan-1.png";
import house159plan2 from "@/assets/houses/house-159-plan-2.png";

import house187ext1  from "@/assets/houses/house-187-ext-1.png";
import house187ext2  from "@/assets/houses/house-187-ext-2.png";
import house187plan1 from "@/assets/houses/house-187-plan-1.png";
import house187plan2 from "@/assets/houses/house-187-plan-2.png";

import house217ext   from "@/assets/houses/house-217-ext.png";
import house217plan1 from "@/assets/houses/house-217-plan-1.png";
import house217plan2 from "@/assets/houses/house-217-plan-2.png";

import house236ext   from "@/assets/houses/house-236-ext.png";
import house236plan1 from "@/assets/houses/house-236-plan-1.png";
import house236plan2 from "@/assets/houses/house-236-plan-2.png";

import house251ext1  from "@/assets/houses/house-251-ext-1.png";
import house251ext2  from "@/assets/houses/house-251-ext-2.png";
import house251plan1 from "@/assets/houses/house-251-plan-1.png";
import house251plan2 from "@/assets/houses/house-251-plan-2.png";

// ── Дополнительные фото бань ─────────────────────────────────────────────────
import bath32ext1  from "@/assets/baths/bath-32-ext-1.png";
import bath32ext2  from "@/assets/baths/bath-32-ext-2.png";
import bath32plan  from "@/assets/baths/bath-32-plan.png";

import bath35ext1  from "@/assets/baths/bath-35-ext-1.png";
import bath35ext2  from "@/assets/baths/bath-35-ext-2.png";
import bath35plan  from "@/assets/baths/bath-35-plan.png";

import bath167ext1 from "@/assets/baths/bath-167-ext-1.png";
import bath167ext2 from "@/assets/baths/bath-167-ext-2.png";
import bath167plan from "@/assets/baths/bath-167-plan.png";

export type GalleryCategory = "Дома" | "Бани" | "Интерьер";

export interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  /** Обложка в сетке */
  image: string;
  /** Все фото объекта (включая обложку первым). Если больше одного — в лайтбоксе появится стрип миниатюр. */
  images: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // ── Дома ────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Двухэтажный рубленый дом из кругляка",
    category: "Дома",
    image: photo1,
    images: [photo1, house68ext1, house68ext2, house68plan],
  },
  {
    id: 2,
    title: "Дом из профбруса — вид с воздуха",
    category: "Дома",
    image: photo2,
    images: [photo2, house71ext1, house71ext2, house71plan],
  },
  {
    id: 3,
    title: "Рубленый дом с ухоженным участком",
    category: "Дома",
    image: photo3,
    images: [photo3, house89ext1, house89ext2, house89plan],
  },
  {
    id: 4,
    title: "Дом из профбруса с каменным цоколем",
    category: "Дома",
    image: photo4,
    images: [photo4, house123ext, house123plan1, house123plan2],
  },
  {
    id: 5,
    title: "Дом из профбруса с верандой в лесу",
    category: "Дома",
    image: photo5,
    images: [photo5, house143ext1, house143ext2, house143plan1, house143plan2],
  },
  {
    id: 6,
    title: "Дом из профбруса 126 м²",
    category: "Дома",
    image: photo6,
    images: [photo6, photo7, house126ext1, house126ext2, house126plan],
  },
  {
    id: 7,
    title: "Дом из профбруса 134 м²",
    category: "Дома",
    image: photo8,
    images: [photo8, house134ext, house134plan],
  },
  {
    id: 8,
    title: "Рубленый дом с ландшафтным садом",
    category: "Дома",
    image: photo11,
    images: [photo11, house159ext, house159plan1, house159plan2],
  },
  {
    id: 9,
    title: "Рубленый дом в берёзовом лесу",
    category: "Дома",
    image: photo13,
    images: [photo13, house187ext1, house187ext2, house187plan1, house187plan2],
  },
  {
    id: 10,
    title: "Угол рубленого дома — каменный цоколь",
    category: "Дома",
    image: photo14,
    images: [photo14, house217ext, house217plan1, house217plan2],
  },
  {
    id: 11,
    title: "Рубленый дом с благоустроенной территорией",
    category: "Дома",
    image: photo15,
    images: [photo15, house236ext, house236plan1, house236plan2],
  },
  {
    id: 12,
    title: "Рубленый дом у воды — терраса и дорожка",
    category: "Дома",
    image: photo17,
    images: [photo17, house251ext1, house251ext2, house251plan1, house251plan2],
  },
  {
    id: 13,
    title: "Угловая рубка — кедровый кругляк",
    category: "Дома",
    image: photo18,
    images: [photo18],
  },

  // ── Бани ─────────────────────────────────────────────────────────────────────
  {
    id: 20,
    title: "Баня 32 м² из профбруса",
    category: "Бани",
    image: bath32ext1,
    images: [bath32ext1, bath32ext2, bath32plan],
  },
  {
    id: 21,
    title: "Баня 35 м² с террасой",
    category: "Бани",
    image: bath35ext1,
    images: [bath35ext1, bath35ext2, bath35plan],
  },
  {
    id: 22,
    title: "Баня 167 м² — банный комплекс",
    category: "Бани",
    image: bath167ext1,
    images: [bath167ext1, bath167ext2, bath167plan],
  },

  // ── Интерьер ─────────────────────────────────────────────────────────────────
  {
    id: 30,
    title: "Гостиная с мягкой мебелью — бревенчатые стены",
    category: "Интерьер",
    image: photo9,
    images: [photo9],
  },
  {
    id: 31,
    title: "Зона у камина с телевизором",
    category: "Интерьер",
    image: photo10,
    images: [photo10],
  },
  {
    id: 32,
    title: "Гостиная — массив дерева и кованая люстра",
    category: "Интерьер",
    image: photo12,
    images: [photo12],
  },
  {
    id: 33,
    title: "Столовая — большой деревянный стол",
    category: "Интерьер",
    image: photo16,
    images: [photo16],
  },
  {
    id: 34,
    title: "Зал — открытая планировка, камин и второй свет",
    category: "Интерьер",
    image: photo19,
    images: [photo19],
  },
];

export const GALLERY_CATEGORIES = ["Все", "Дома", "Бани", "Интерьер"] as const;
