import { ARTICLES_META } from "../data/articles-meta";
import { PROJECTS } from "../data/projects";

export const SEO_SITE = {
  name: "Кедр Томск",
  url: "https://kedr-tomsk.ru",
  phone: "+73822334439",
  email: "mail@kedr-tomsk.ru",
  address: {
    street: "мкр. Черемошники, ул. Профсоюзная, 2/1с12",
    city: "Томск",
    region: "Томская область",
    country: "RU",
  },
  geo: {
    lat: 56.5137,
    lng: 84.9674,
  },
} as const;

export type StaticSeoRoute = {
  path: string;
  title: string;
  description: string;
  h1: string;
  image?: string;
  canonical?: string;
  kind?: "Article" | "WebPage";
};

const BASE_ROUTES: StaticSeoRoute[] = [
  {
    path: "/",
    title: "Деревянные дома и бани под ключ в Томске",
    description:
      "Кедр Томск — строительство деревянных домов из профилированного бруса и рубленого бревна с 2001 года. Более 200 объектов по всей России. Бесплатный проект при заказе.",
    h1: "Дома и бани, которые мы строим",
  },
  {
    path: "/about",
    title: "О компании",
    description:
      "Кедр Томск — строим деревянные дома с 2001 года. Более 200 объектов, собственное производство профилированного бруса в Томске, бригады опытных плотников.",
    h1: "Дома из сибирского кедра — тепло, которое служит веками",
  },
  {
    path: "/services",
    title: "Услуги",
    description:
      "Полный цикл строительства деревянных домов и бань в Томске: проектирование, фундамент, монтаж сруба, отделка под ключ. Кедр Томск с 2001 года.",
    h1: "Все услуги — от фундамента до чистовой отделки",
    canonical: "/services",
  },
  {
    path: "/uslugi",
    title: "Строительство деревянных домов и бань — услуги",
    description:
      "Услуги Кедр Томск: полный цикл строительства деревянных домов и бань в Томске — проектирование, фундамент, монтаж сруба и отделка под ключ.",
    h1: "Все услуги — от фундамента до чистовой отделки",
    canonical: "/services",
  },
  {
    path: "/services/profilirovanny-brus",
    title: "Строительство домов из профилированного бруса в Томске",
    description:
      "Строим дома из профилированного бруса под ключ в Томске и по России. Проектирование, производство, доставка и сборка деревянного дома.",
    h1: "Дома из профилированного бруса",
  },
  {
    path: "/services/rublenye-doma",
    title: "Строительство рубленых домов в Томске",
    description:
      "Строительство рубленых домов из отборного бревна под ключ. Ручная рубка, проектирование, доставка и сборка домов в Томске и по России.",
    h1: "Рубленные дома из бревна",
  },
  {
    path: "/production",
    title: "Производство профилированного бруса в Томске",
    description:
      "Производство профилированного бруса в Томске: кедр, сосна и лиственница, объём до 500 м³ в месяц. Немецкий профиль, финский станок.",
    h1: "Профилированный брус",
    canonical: "/production/profilirovanny-brus",
  },
  {
    path: "/production/profilirovanny-brus",
    title: "Производство профилированного бруса",
    description:
      "Собственное производство профилированного бруса в Томске. Кедр, сосна, лиственница. Объём до 500 м³ в месяц. Немецкий профиль, финский станок.",
    h1: "Профилированный брус",
    canonical: "/production/profilirovanny-brus",
  },
  {
    path: "/production/pilomaterial",
    title: "Пиломатериалы собственного производства в Томске",
    description:
      "Производим обрезной и необрезной пиломатериал, брус и другие материалы для строительства деревянных домов. Собственное производство в Томске.",
    h1: "Пиломатериал",
  },
  {
    path: "/production/stolyarnye-izdeliya",
    title: "Столярные изделия из дерева в Томске",
    description:
      "Изготавливаем деревянные окна, двери, лестницы и мебель на заказ в Томске. Столярное производство из натуральной древесины.",
    h1: "Столярные изделия",
  },
  {
    path: "/projects",
    title: "Проекты домов и бань",
    description:
      "Каталог проектов деревянных домов и бань от Кедр Томск. Профилированный брус, рубленое бревно. Площадь от 30 до 350 м². Бесплатный проект при заказе.",
    h1: "Проекты деревянных домов и бань",
    image: "/images/projects-hero.jpg",
  },
  {
    path: "/articles",
    title: "Статьи и публикации",
    description:
      "Полезные статьи о строительстве деревянных домов и бань от специалистов Кедр Томск: выбор материала, технологии, советы по эксплуатации.",
    h1: "Статьи и публикации",
  },
  {
    path: "/gallery",
    title: "Галерея",
    description:
      "Фото и видео деревянных домов, бань и беседок, построенных компанией Кедр Томск в Томске и по всей России.",
    h1: "Наши работы",
  },
  {
    path: "/contacts",
    title: "Контакты",
    description:
      "Свяжитесь с Кедр Томск: +7 (3822) 33-44-39, г. Томск, мкр. Черемошники. Оставьте заявку на строительство деревянного дома.",
    h1: "Свяжитесь с нами",
  },
  {
    path: "/terms",
    title: "Условия строительства и оплаты",
    description:
      "Условия проектирования, строительства, оплаты и гарантийного обслуживания деревянных домов и бань компании «Кедр Томск».",
    h1: "Условия использования сайта",
  },
];

const PROJECT_ROUTES: StaticSeoRoute[] = PROJECTS.map((project) => ({
  path: `/projects/${project.id}`,
  title: `${project.title} — ${project.area} м²`,
  description: `${project.title}: ${project.area} м², ${project.floors} эт., ${project.material}. ${project.description.slice(0, 120)}`,
  h1: project.title,
  image: project.imageUrl,
}));

const ARTICLE_ROUTES: StaticSeoRoute[] = ARTICLES_META.map((article) => ({
  path: `/articles/${article.slug}`,
  title: article.title,
  description: article.excerpt || article.title,
  h1: article.title,
  image: article.image,
  kind: "Article",
}));

export const STATIC_SEO_ROUTES: StaticSeoRoute[] = [
  ...BASE_ROUTES,
  ...PROJECT_ROUTES,
  ...ARTICLE_ROUTES,
];