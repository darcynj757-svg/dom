/**
 * ФОТОГАЛЕРЕЯ — реализованные объекты
 *
 * Каждый элемент — один объект (дом, баня, интерьер).
 * `image`  — обложка, отображаемая в сетке.
 * `images` — все фото объекта (первым идёт обложка).
 *            При клике открывается лайтбокс с миниатюрами.
 *
 * Чтобы добавить фото к объекту:
 *   1. Положите файлы в src/assets/gallery/
 *   2. Добавьте import ниже
 *   3. Добавьте src в массив `images` нужного элемента
 */

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

import house180ext1 from "@/assets/gallery/house-180-ext-1.png";
import house180ext2 from "@/assets/gallery/house-180-ext-2.png";
import house180info from "@/assets/gallery/house-180-info.png";

import bath831 from "@/assets/gallery/bath-83-1.png";
import bath832 from "@/assets/gallery/bath-83-2.png";
import bath833 from "@/assets/gallery/bath-83-3.png";
import bath834 from "@/assets/gallery/bath-83-4.png";
import bath835 from "@/assets/gallery/bath-83-5.png";
import bath836 from "@/assets/gallery/bath-83-6.png";
import bath837 from "@/assets/gallery/bath-83-7.png";
import bath838 from "@/assets/gallery/bath-83-8.png";
import bath83plan from "@/assets/gallery/bath-83-plan.png";
import bath83info from "@/assets/gallery/bath-83-info.png";

// ── Сюда добавляйте следующие фото ──────────────────────────────────────────
// import photo20 from "@/assets/gallery/photo-20.png";

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
    images: [photo1],
  },
  {
    id: 2,
    title: "Дом из профбруса — вид с воздуха",
    category: "Дома",
    image: photo2,
    images: [photo2],
  },
  {
    id: 3,
    title: "Рубленый дом с ухоженным участком",
    category: "Дома",
    image: photo3,
    images: [photo3],
  },
  {
    id: 4,
    title: "Дом из профбруса с каменным цоколем",
    category: "Дома",
    image: photo4,
    images: [photo4],
  },
  {
    id: 5,
    title: "Дом из профбруса с верандой в лесу",
    category: "Дома",
    image: photo5,
    images: [photo5],
  },
  {
    id: 6,
    title: "Дом из профбруса 126 м² — фасад 1",
    category: "Дома",
    image: photo6,
    images: [photo6, photo7],
  },
  {
    id: 8,
    title: "Дом из профбруса 134 м²",
    category: "Дома",
    image: photo8,
    images: [photo8],
  },
  {
    id: 11,
    title: "Рубленый дом с ландшафтным садом",
    category: "Дома",
    image: photo11,
    images: [photo11],
  },
  {
    id: 13,
    title: "Рубленый дом в берёзовом лесу",
    category: "Дома",
    image: photo13,
    images: [photo13],
  },
  {
    id: 14,
    title: "Угол рубленого дома — каменный цоколь",
    category: "Дома",
    image: photo14,
    images: [photo14],
  },
  {
    id: 15,
    title: "Рубленый дом с благоустроенной территорией",
    category: "Дома",
    image: photo15,
    images: [photo15],
  },
  {
    id: 17,
    title: "Рубленый дом у воды — терраса и дорожка",
    category: "Дома",
    image: photo17,
    images: [photo17],
  },
  {
    id: 18,
    title: "Угловая рубка — кедровый кругляк",
    category: "Дома",
    image: photo18,
    images: [photo18],
  },
  {
    id: 40,
    title: "Дом из профбруса 180 м² с гаражом",
    category: "Дома",
    image: house180ext1,
    images: [house180ext1, house180ext2, house180info],
  },

  // ── Бани ─────────────────────────────────────────────────────────────────────
  {
    id: 50,
    title: "Баня из рубленого бревна 83 м² — с купелью и террасой",
    category: "Бани",
    image: bath831,
    images: [bath831, bath832, bath833, bath834, bath835, bath836, bath837, bath838, bath83plan, bath83info],
  },

  // ── Интерьер ─────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: "Гостиная с мягкой мебелью — бревенчатые стены",
    category: "Интерьер",
    image: photo9,
    images: [photo9],
  },
  {
    id: 10,
    title: "Зона у камина с телевизором",
    category: "Интерьер",
    image: photo10,
    images: [photo10],
  },
  {
    id: 12,
    title: "Гостиная — массив дерева и кованая люстра",
    category: "Интерьер",
    image: photo12,
    images: [photo12],
  },
  {
    id: 16,
    title: "Столовая — большой деревянный стол",
    category: "Интерьер",
    image: photo16,
    images: [photo16],
  },
  {
    id: 19,
    title: "Зал — открытая планировка, камин и второй свет",
    category: "Интерьер",
    image: photo19,
    images: [photo19],
  },
];

export const GALLERY_CATEGORIES = ["Все", "Дома", "Бани", "Интерьер"] as const;
