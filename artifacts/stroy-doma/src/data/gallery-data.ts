/**
 * ФОТОГАЛЕРЕЯ — источник данных
 *
 * Чтобы добавить новые фотографии:
 *  1. Положите файл в src/assets/gallery/
 *  2. Добавьте import выше (или прямо в массив GALLERY_ITEMS ниже)
 *  3. Добавьте запись в массив с нужной категорией
 *
 * Категории: "Профилированный брус" | "Рубленное бревно" | "Баня"
 */

// ── Загруженные фото реальных объектов ─────────────────────────────────────
import photo1 from "@/assets/gallery/photo-1.png";
import photo2 from "@/assets/gallery/photo-2.png";
import photo3 from "@/assets/gallery/photo-3.png";
import photo4 from "@/assets/gallery/photo-4.png";
import photo5 from "@/assets/gallery/photo-5.png";
import photo6 from "@/assets/gallery/photo-6.png";
import photo7 from "@/assets/gallery/photo-7.png";
import photo8 from "@/assets/gallery/photo-8.png";

// ── Дома из профилированного бруса ─────────────────────────────────────────
import house71Ext1   from "@/assets/houses/house-71-ext-1.png";
import house71Ext2   from "@/assets/houses/house-71-ext-2.png";
import house89Ext1   from "@/assets/houses/house-89-ext-1.png";
import house89Ext2   from "@/assets/houses/house-89-ext-2.png";
import house123Ext   from "@/assets/houses/house-123-ext.png";
import house126Ext1  from "@/assets/houses/house-126-ext-1.png";
import house126Ext2  from "@/assets/houses/house-126-ext-2.png";
import house134Ext   from "@/assets/houses/house-134-ext.png";
import house143Ext1  from "@/assets/houses/house-143-ext-1.png";
import house143Ext2  from "@/assets/houses/house-143-ext-2.png";
import house187Ext1  from "@/assets/houses/house-187-ext-1.png";
import house187Ext2  from "@/assets/houses/house-187-ext-2.png";
import house217Ext   from "@/assets/houses/house-217-ext.png";
import house236Ext   from "@/assets/houses/house-236-ext.png";
import house251Ext1  from "@/assets/houses/house-251-ext-1.png";
import house251Ext2  from "@/assets/houses/house-251-ext-2.png";

// ── Рубленые дома из кругляка и бруса ──────────────────────────────────────
import house68Ext1   from "@/assets/houses/house-68-ext-1.png";
import house68Ext2   from "@/assets/houses/house-68-ext-2.png";
import house159Ext   from "@/assets/houses/house-159-ext.png";

// ── Бани ───────────────────────────────────────────────────────────────────
import bath32Ext1    from "@/assets/baths/bath-32-ext-1.png";
import bath32Ext2    from "@/assets/baths/bath-32-ext-2.png";
import bath35Ext1    from "@/assets/baths/bath-35-ext-1.png";
import bath35Ext2    from "@/assets/baths/bath-35-ext-2.png";
import bath167Ext1   from "@/assets/baths/bath-167-ext-1.png";
import bath167Ext2   from "@/assets/baths/bath-167-ext-2.png";

export type GalleryCategory = "Профилированный брус" | "Рубленное бревно" | "Баня";

export interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  image: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // ── Реальные объекты (фото с площадки) ─────────────────────────────────
  { id: 1,  title: "Двухэтажный рубленый дом из кругляка",          category: "Рубленное бревно",    image: photo1 },
  { id: 2,  title: "Дом из профбруса — вид с воздуха",              category: "Профилированный брус", image: photo2 },
  { id: 3,  title: "Рубленый дом с ухоженным участком",             category: "Рубленное бревно",    image: photo3 },
  { id: 4,  title: "Дом из бруса с каменным цоколем",               category: "Профилированный брус", image: photo4 },
  { id: 5,  title: "Дом из профбруса с верандой в лесу",            category: "Профилированный брус", image: photo5 },
  { id: 6,  title: "Дом из профбруса 126 м² — фасад 1",             category: "Профилированный брус", image: photo6 },
  { id: 7,  title: "Дом из профбруса 126 м² — фасад 2",             category: "Профилированный брус", image: photo7 },
  { id: 8,  title: "Дом из профбруса 134 м² — готовый объект",       category: "Профилированный брус", image: photo8 },

  // ── Профилированный брус ────────────────────────────────────────────────
  { id: 9,  title: "Дом из профбруса 71 м² — вид 1",                category: "Профилированный брус", image: house71Ext1 },
  { id: 10, title: "Дом из профбруса 71 м² — вид 2",                category: "Профилированный брус", image: house71Ext2 },
  { id: 11, title: "Дом из профбруса 89 м² — фасад",                category: "Профилированный брус", image: house89Ext1 },
  { id: 12, title: "Дом из профбруса 89 м² — боковой вид",          category: "Профилированный брус", image: house89Ext2 },
  { id: 13, title: "Дом из профбруса 123 м²",                       category: "Профилированный брус", image: house123Ext },
  { id: 14, title: "Дом из профбруса 126 м² — вид 1",               category: "Профилированный брус", image: house126Ext1 },
  { id: 15, title: "Дом из профбруса 126 м² — вид 2",               category: "Профилированный брус", image: house126Ext2 },
  { id: 16, title: "Дом из профбруса 134 м²",                       category: "Профилированный брус", image: house134Ext },
  { id: 17, title: "Двухэтажный дом из бруса 143 м² — фасад",       category: "Профилированный брус", image: house143Ext1 },
  { id: 18, title: "Двухэтажный дом из бруса 143 м² — угол",        category: "Профилированный брус", image: house143Ext2 },
  { id: 19, title: "Дом с панорамным остеклением 187 м² — вид 1",   category: "Профилированный брус", image: house187Ext1 },
  { id: 20, title: "Дом с панорамным остеклением 187 м² — вид 2",   category: "Профилированный брус", image: house187Ext2 },
  { id: 21, title: "Дом из профбруса 217 м²",                       category: "Профилированный брус", image: house217Ext },
  { id: 22, title: "Дом из профбруса 236 м²",                       category: "Профилированный брус", image: house236Ext },
  { id: 23, title: "Коттедж из профбруса 251 м² — вид 1",           category: "Профилированный брус", image: house251Ext1 },
  { id: 24, title: "Коттедж из профбруса 251 м² — вид 2",           category: "Профилированный брус", image: house251Ext2 },

  // ── Рубленое бревно ─────────────────────────────────────────────────────
  { id: 25, title: "Одноэтажный дом из кругляка 68 м² — фасад",     category: "Рубленное бревно",    image: house68Ext1 },
  { id: 26, title: "Одноэтажный дом из кругляка 68 м² — боковой",   category: "Рубленное бревно",    image: house68Ext2 },
  { id: 27, title: "Двухэтажный дом из бруса 159 м²",               category: "Рубленное бревно",    image: house159Ext },

  // ── Бани ───────────────────────────────────────────────────────────────
  { id: 28, title: "Баня 32 м² — фасад",                            category: "Баня",                image: bath32Ext1 },
  { id: 29, title: "Баня 32 м² — вид сбоку",                        category: "Баня",                image: bath32Ext2 },
  { id: 30, title: "Баня 35 м² — фасад",                            category: "Баня",                image: bath35Ext1 },
  { id: 31, title: "Баня 35 м² — вид сбоку",                        category: "Баня",                image: bath35Ext2 },
  { id: 32, title: "Баня-усадьба 167 м² — фасад",                   category: "Баня",                image: bath167Ext1 },
  { id: 33, title: "Баня-усадьба 167 м² — вид сбоку",               category: "Баня",                image: bath167Ext2 },

  // ── НОВЫЕ ФОТО (добавить сюда) ──────────────────────────────────────────
  // { id: 34, title: "...", category: "...", image: newPhoto },
];

export const GALLERY_CATEGORIES = ["Все", "Профилированный брус", "Рубленное бревно", "Баня"] as const;
