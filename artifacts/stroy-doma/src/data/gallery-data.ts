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

// ── Сюда добавляйте следующие фото ────────────────────────────────────────
// import photo20 from "@/assets/gallery/photo-20.png";

export type GalleryCategory = "Дома" | "Бани" | "Интерьер";

export interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  image: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // ── Дома снаружи ────────────────────────────────────────────────────────
  { id: 1,  title: "Двухэтажный рубленый дом из кругляка",          category: "Дома",      image: photo1  },
  { id: 2,  title: "Дом из профбруса — вид с воздуха",              category: "Дома",      image: photo2  },
  { id: 3,  title: "Рубленый дом с ухоженным участком",             category: "Дома",      image: photo3  },
  { id: 4,  title: "Дом из бруса с каменным цоколем",               category: "Дома",      image: photo4  },
  { id: 5,  title: "Дом из профбруса с верандой в лесу",            category: "Дома",      image: photo5  },
  { id: 6,  title: "Дом из профбруса 126 м² — фасад 1",             category: "Дома",      image: photo6  },
  { id: 7,  title: "Дом из профбруса 126 м² — фасад 2",             category: "Дома",      image: photo7  },
  { id: 8,  title: "Дом из профбруса 134 м²",                       category: "Дома",      image: photo8  },
  { id: 11, title: "Рубленый дом с ландшафтным садом",              category: "Дома",      image: photo11 },
  { id: 13, title: "Рубленый дом в берёзовом лесу",                 category: "Дома",      image: photo13 },
  { id: 14, title: "Угол рубленого дома — каменный цоколь",         category: "Дома",      image: photo14 },
  { id: 15, title: "Рубленый дом с благоустроенной территорией",    category: "Дома",      image: photo15 },
  { id: 17, title: "Рубленый дом у воды — терраса и дорожка",       category: "Дома",      image: photo17 },
  { id: 18, title: "Угловая рубка — кедровый кругляк",              category: "Дома",      image: photo18 },

  // ── Интерьер ────────────────────────────────────────────────────────────
  { id: 9,  title: "Гостиная с мягкой мебелью — бревенчатые стены",  category: "Интерьер", image: photo9  },
  { id: 10, title: "Зона у камина с телевизором",                    category: "Интерьер", image: photo10 },
  { id: 12, title: "Гостиная — массив дерева и люстра из кованого железа", category: "Интерьер", image: photo12 },
  { id: 16, title: "Столовая — большой деревянный стол",             category: "Интерьер", image: photo16 },
  { id: 19, title: "Зал — открытая планировка, камин и второй свет", category: "Интерьер", image: photo19 },

  // ── Новые фото (добавить сюда) ─────────────────────────────────────────
  // { id: 20, title: "...", category: "Дома", image: photo20 },
];

export const GALLERY_CATEGORIES = ["Все", "Дома", "Бани", "Интерьер"] as const;
