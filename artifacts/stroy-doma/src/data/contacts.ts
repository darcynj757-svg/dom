/**
 * Единый источник контактных данных компании.
 * Менять только здесь — используется в хедере, футере, странице контактов и JSON-LD.
 */
export const COMPANY = {
  name: "Кедр Томск",
  legalName: "KedrTomsk",
  url: "https://kedr-tomsk.ru",
  email: "mail@kedr-tomsk.ru",
  phone: "+73822334439",
  phoneFormatted: "+7 (3822) 33-44-39",
  address: {
    street: "мкр. Черемошники, ул. Профсоюзная, 2/1с12",
    city: "Томск",
    region: "Томская область",
    country: "RU",
    full: "г. Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12",
  },
  geo: {
    lat: 56.5137,
    lng: 84.9674,
  },
  workingHours: "Пн–Пт: 9:00–18:00",
  founded: "2001",
} as const;
