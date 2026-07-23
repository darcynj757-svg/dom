/**
 * ФОТОГАЛЕРЕЯ — реализованные объекты
 *
 * Чтобы добавить новые фотографии:
 *  1. Положите файл в src/assets/gallery/
 *  2. Добавьте import ниже
 *  3. Добавьте запись в массив GALLERY_ITEMS с нужной категорией
 *
 * Категории: "Дома" | "Бани" | "Интерьер"
 */

import photo1 from "@/assets/gallery/photo-1.png";
import photo2 from "@/assets/gallery/photo-2.png";
import photo3 from "@/assets/gallery/photo-3.png";
import photo4 from "@/assets/gallery/photo-4.png";
import photo5 from "@/assets/gallery/photo-5.png";
import photo6 from "@/assets/gallery/photo-6.png";
import photo7 from "@/assets/gallery/photo-7.png";
import photo8 from "@/assets/gallery/photo-8.png";

// ── Сюда добавляйте новые фото ─────────────────────────────────────────────
// import photo9  from "@/assets/gallery/photo-9.png";
// import photo10 from "@/assets/gallery/photo-10.png";

export type GalleryCategory = "Дома" | "Бани" | "Интерьер";

export interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  image: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, title: "Двухэтажный рубленый дом из кругляка",   category: "Дома",  image: photo1 },
  { id: 2, title: "Дом из профбруса — вид с воздуха",       category: "Дома",  image: photo2 },
  { id: 3, title: "Рубленый дом с ухоженным участком",      category: "Дома",  image: photo3 },
  { id: 4, title: "Дом из бруса с каменным цоколем",        category: "Дома",  image: photo4 },
  { id: 5, title: "Дом из профбруса с верандой в лесу",     category: "Дома",  image: photo5 },
  { id: 6, title: "Дом из профбруса 126 м² — фасад 1",      category: "Дома",  image: photo6 },
  { id: 7, title: "Дом из профбруса 126 м² — фасад 2",      category: "Дома",  image: photo7 },
  { id: 8, title: "Дом из профбруса 134 м²",                category: "Дома",  image: photo8 },

  // ── Новые фото (добавить сюда) ─────────────────────────────────────────
  // { id: 9,  title: "...", category: "Дома", image: photo9 },
];

export const GALLERY_CATEGORIES = ["Все", "Дома", "Бани", "Интерьер"] as const;
