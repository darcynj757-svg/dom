import { db, projectsTable, type InsertProject } from "@workspace/db";

const projects: InsertProject[] = [
  {
    title: "Скандинавия",
    category: "house",
    material: "Каркас",
    area: 96,
    floors: 1,
    bedrooms: 2,
    price: 3450000,
    description:
      "Одноэтажный каркасный дом в скандинавском стиле с панорамными окнами и открытой планировкой гостиной. Идеален для небольшой семьи, ищущей современный минимализм за городом.",
    features: [
      "Панорамное остекление",
      "Утеплённые стены 200 мм",
      "Терраса в комплекте",
      "Электропроводка под ключ",
    ],
    imageUrl: "images/projects/house-frame-scandinavian.png",
    gallery: [
      "images/projects/house-frame-scandinavian.png",
      "images/projects/house-timber-modern.png",
    ],
    featured: true,
  },
  {
    title: "Северный кедр",
    category: "house",
    material: "Брус",
    area: 148,
    floors: 2,
    bedrooms: 3,
    price: 5620000,
    description:
      "Двухэтажный дом из профилированного бруса с большими окнами и просторной мансардой. Тёплый, экологичный дом для круглогодичного проживания.",
    features: [
      "Профилированный брус 200x200",
      "Мансардный второй этаж",
      "Балкон на 2 этаже",
      "Фундамент в комплекте",
    ],
    imageUrl: "images/projects/house-timber-modern.png",
    gallery: [
      "images/projects/house-timber-modern.png",
      "images/projects/house-frame-scandinavian.png",
    ],
    featured: true,
  },
  {
    title: "Классик Резиденс",
    category: "house",
    material: "Кирпич",
    area: 210,
    floors: 2,
    bedrooms: 4,
    price: 8900000,
    description:
      "Просторный кирпичный особняк классической архитектуры с черепичной кровлей. Рассчитан на большую семью и приём гостей.",
    features: [
      "Кирпичная кладка в 2 слоя",
      "Черепичная кровля",
      "Гараж на 2 машины",
      "Терраса и веранда",
    ],
    imageUrl: "images/projects/house-brick-classic.png",
    gallery: ["images/projects/house-brick-classic.png"],
    featured: false,
  },
  {
    title: "Компакт Плюс",
    category: "house",
    material: "Каркас",
    area: 72,
    floors: 1,
    bedrooms: 1,
    price: 2380000,
    description:
      "Компактный дачный домик для сезонного или постоянного проживания. Быстрое строительство — от фундамента до финальной отделки за 6 недель.",
    features: [
      "Строительство за 6 недель",
      "Готов к подключению коммуникаций",
      "Утепление для всесезонного проживания",
    ],
    imageUrl: "images/projects/house-frame-scandinavian.png",
    gallery: ["images/projects/house-frame-scandinavian.png"],
    featured: false,
  },
  {
    title: "Таёжная",
    category: "bathhouse",
    material: "Оцилиндрованное бревно",
    area: 32,
    floors: 1,
    bedrooms: 1,
    price: 1250000,
    description:
      "Традиционная русская баня из оцилиндрованного бревна с парной, моечной и предбанником. Настоящий деревенский дух в современном исполнении.",
    features: [
      "Парная на 6 человек",
      "Каменная печь в комплекте",
      "Крытая веранда",
      "Естественная вентиляция",
    ],
    imageUrl: "images/projects/bathhouse-log-traditional.png",
    gallery: [
      "images/projects/bathhouse-log-traditional.png",
      "images/projects/bathhouse-lake-rustic.png",
    ],
    featured: true,
  },
  {
    title: "Чёрная жемчужина",
    category: "bathhouse",
    material: "Каркас",
    area: 45,
    floors: 1,
    bedrooms: 1,
    price: 2150000,
    description:
      "Баня в современном минималистичном стиле с чёрным фасадом и панорамным окном в зоне отдыха. Отлично впишется в ландшафт загородного участка.",
    features: [
      "Панорамное окно в зоне отдыха",
      "Открытая терраса",
      "Электрическая печь-каменка",
      "Комната отдыха с камином",
    ],
    imageUrl: "images/projects/bathhouse-modern-black.png",
    gallery: ["images/projects/bathhouse-modern-black.png"],
    featured: true,
  },
  {
    title: "У озера",
    category: "bathhouse",
    material: "Брус",
    area: 28,
    floors: 1,
    bedrooms: 1,
    price: 1090000,
    description:
      "Небольшая уютная баня из бруса на каменном фундаменте — отличное решение для участка у водоёма. Быстрый монтаж, минимальные затраты на обслуживание.",
    features: [
      "Каменный фундамент",
      "Компактная парная",
      "Дровяная печь",
      "Готова за 4 недели",
    ],
    imageUrl: "images/projects/bathhouse-lake-rustic.png",
    gallery: ["images/projects/bathhouse-lake-rustic.png"],
    featured: false,
  },
];

async function main() {
  const existing = await db.select({ id: projectsTable.id }).from(projectsTable).limit(1);
  if (existing.length > 0) {
    console.log("Projects table already has data, skipping seed.");
    return;
  }

  await db.insert(projectsTable).values(projects);
  console.log(`Seeded ${projects.length} projects.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
