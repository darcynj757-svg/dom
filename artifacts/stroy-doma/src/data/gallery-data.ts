/**
 * ФОТОГАЛЕРЕЯ — реализованные объекты
 *
 * Изображения лежат в public/images/gallery/ и грузятся по требованию,
 * а не включаются в JS-бандл.
 *
 * Чтобы добавить фото к объекту:
 *   1. Положите .webp в public/images/gallery/
 *   2. Добавьте путь вида "/images/gallery/имя-файла.webp" в массив images
 */

const G = "/images/gallery";

export type GalleryCategory = "Дома" | "Бани";

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
    image: `${G}/photo-1.webp`,
    images: [`${G}/photo-1.webp`],
  },
  {
    id: 2,
    title: "Дом из профбруса — вид с воздуха",
    category: "Дома",
    image: `${G}/photo-2.webp`,
    images: [`${G}/photo-2.webp`],
  },
  {
    id: 3,
    title: "Рубленый дом с ухоженным участком",
    category: "Дома",
    image: `${G}/photo-3.webp`,
    images: [`${G}/photo-3.webp`],
  },
  {
    id: 4,
    title: "Дом из профбруса с каменным цоколем",
    category: "Дома",
    image: `${G}/photo-4.webp`,
    images: [`${G}/photo-4.webp`],
  },
  {
    id: 5,
    title: "Дом из профбруса с верандой в лесу",
    category: "Дома",
    image: `${G}/photo-5.webp`,
    images: [`${G}/photo-5.webp`],
  },
  {
    id: 6,
    title: "Дом из профбруса 126 м² — фасад 1",
    category: "Дома",
    image: `${G}/photo-6.webp`,
    images: [`${G}/photo-6.webp`, `${G}/photo-7.webp`],
  },
  {
    id: 8,
    title: "Дом из профбруса 134 м²",
    category: "Дома",
    image: `${G}/photo-8.webp`,
    images: [`${G}/photo-8.webp`],
  },
  {
    id: 11,
    title: "Рубленый дом с ландшафтным садом",
    category: "Дома",
    image: `${G}/photo-11.webp`,
    images: [`${G}/photo-11.webp`],
  },
  {
    id: 13,
    title: "Рубленый дом в берёзовом лесу",
    category: "Дома",
    image: `${G}/photo-13.webp`,
    images: [`${G}/photo-13.webp`],
  },
  {
    id: 14,
    title: "Угол рубленого дома — каменный цоколь",
    category: "Дома",
    image: `${G}/photo-14.webp`,
    images: [`${G}/photo-14.webp`],
  },
  {
    id: 15,
    title: "Рубленый дом с благоустроенной территорией",
    category: "Дома",
    image: `${G}/photo-15.webp`,
    images: [`${G}/photo-15.webp`],
  },
  {
    id: 17,
    title: "Рубленый дом у воды — терраса и дорожка",
    category: "Дома",
    image: `${G}/photo-17.webp`,
    images: [`${G}/photo-17.webp`],
  },
  {
    id: 18,
    title: "Угловая рубка — кедровый кругляк",
    category: "Дома",
    image: `${G}/photo-18.webp`,
    images: [`${G}/photo-18.webp`],
  },
  {
    id: 43,
    title: "Рубленый дом с гаражом у озера",
    category: "Дома",
    image: `${G}/house-log-lake-3.webp`,
    images: [
      `${G}/house-log-lake-3.webp`,
      `${G}/house-log-lake-1.webp`,
      `${G}/house-log-lake-2.webp`,
      `${G}/house-log-lake-4.webp`,
      `${G}/house-log-lake-5.webp`,
      `${G}/house-log-lake-7.webp`,
      `${G}/house-log-lake-8.webp`,
      `${G}/house-log-lake-6.webp`,
    ],
  },
  {
    id: 42,
    title: "Рубленый дом 236 м² в сосновом лесу",
    category: "Дома",
    image: `${G}/house-236-1.webp`,
    images: [`${G}/house-236-1.webp`, `${G}/house-236-2.webp`, `${G}/house-236-info.webp`],
  },
  {
    id: 41,
    title: "Дом из профбруса 100 м² у воды",
    category: "Дома",
    image: `${G}/house-100-1.webp`,
    images: [
      `${G}/house-100-1.webp`,
      `${G}/house-100-2.webp`,
      `${G}/house-100-3.webp`,
      `${G}/house-100-4.webp`,
      `${G}/house-100-5.webp`,
      `${G}/house-100-6.webp`,
      `${G}/house-100-7.webp`,
      `${G}/house-100-8.webp`,
      `${G}/house-100-9.webp`,
      `${G}/house-100-10.webp`,
      `${G}/house-100-11.webp`,
      `${G}/house-100-info.webp`,
    ],
  },
  {
    id: 40,
    title: "Дом из профбруса 180 м² с гаражом",
    category: "Дома",
    image: `${G}/house-180-ext-1.webp`,
    images: [`${G}/house-180-ext-1.webp`, `${G}/house-180-ext-2.webp`, `${G}/house-180-info.webp`],
  },
  {
    id: 44,
    title: "Рубленый дом с ландшафтным садом",
    category: "Дома",
    image: `${G}/house-garden-ext-3.webp`,
    images: [
      `${G}/house-garden-ext-1.webp`,
      `${G}/house-garden-ext-3.webp`,
      `${G}/house-garden-ext-4.webp`,
      `${G}/house-garden-ext-5.webp`,
      `${G}/house-garden-ext-6.webp`,
      `${G}/house-garden-int-1.webp`,
      `${G}/house-garden-int-2.webp`,
      `${G}/house-garden-int-3.webp`,
      `${G}/house-garden-int-4.webp`,
      `${G}/house-garden-int-5.webp`,
    ],
  },

  // ── Бани ─────────────────────────────────────────────────────────────────────
  {
    id: 51,
    title: "Баня из рубленого бревна 40 м² с панорамными окнами",
    category: "Бани",
    image: `${G}/bath-40-1.webp`,
    images: [`${G}/bath-40-1.webp`, `${G}/bath-40-2.webp`, `${G}/bath-40-info.webp`],
  },
  {
    id: 50,
    title: "Баня из рубленого бревна 83 м² — с купелью и террасой",
    category: "Бани",
    image: `${G}/bath-83-5.webp`,
    images: [
      `${G}/bath-83-1.webp`,
      `${G}/bath-83-2.webp`,
      `${G}/bath-83-3.webp`,
      `${G}/bath-83-4.webp`,
      `${G}/bath-83-5.webp`,
      `${G}/bath-83-6.webp`,
      `${G}/bath-83-7.webp`,
      `${G}/bath-83-8.webp`,
      `${G}/bath-83-plan.webp`,
      `${G}/bath-83-info.webp`,
    ],
  },

];

export const GALLERY_CATEGORIES = ["Все", "Дома", "Бани"] as const;
