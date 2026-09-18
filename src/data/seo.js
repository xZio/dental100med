import { legal, legalContacts, clinic } from './legal.js';

/**
 * Заголовки и описания страниц для поиска. Один источник и для браузера
 * (useSEO), и для сервера: он подставляет их в HTML до выполнения JS, чтобы
 * робот видел у каждой страницы своё, а не заголовок главной.
 *
 * Ключевые фразы — по Вордстату (сентябрь 2026, все регионы, в месяц):
 * «стоматология подольск» 13 555, «стоматолог подольск» 4 139,
 * «детская стоматология подольск» 2 111, «стоматология подольск врачи» 566.
 */
export const PAGE_SEO = {
  '/': {
    title: 'Стоматология в Подольске — семейная клиника «ДенталстоМед»',
    description: 'Семейная стоматология ДенталстоМед в Подольске: лечение зубов, имплантация, ортодонтия и детская стоматология. Запись онлайн и по телефону.',
  },
  '/services': {
    title: 'Услуги и цены стоматологии в Подольске · ДенталстоМед',
    description: 'Прайс-лист стоматологической клиники ДенталстоМед в Подольске. Терапия, имплантация, ортодонтия, детская стоматология.',
  },
  '/doctors': {
    title: 'Стоматологи в Подольске — врачи клиники · ДенталстоМед',
    description: 'Врачи стоматологии ДенталстоМед в Подольске: терапевты, ортопеды, ортодонт, стоматолог общей практики.',
  },
  '/gallery': {
    title: 'Фото клиники и работ — стоматология в Подольске · ДенталстоМед',
    description: 'Фотографии клиники ДенталстоМед в Подольске и примеры выполненных работ.',
  },
  '/about': {
    title: `О клинике — стоматология в Подольске с ${clinic.foundedYear} года · ДенталстоМед`,
    description: `ДенталстоМед — семейная стоматология в Подольске с ${clinic.foundedYear} года. Команда, принципы, лицензия.`,
  },
  '/contacts': {
    title: 'Запись к стоматологу в Подольске — адрес и телефон · ДенталстоМед',
    description: 'Стоматология ДенталстоМед в Подольске. Адрес: пр. Юных Ленинцев, 82В, ТЦ Максимум. Запись онлайн или по телефону.',
  },
  '/privacy': {
    title: 'Политика конфиденциальности · ДенталстоМед',
    description: `Политика ${legal.shortName} в отношении обработки персональных данных пациентов и посетителей сайта.`,
  },
};

export const NOT_FOUND_SEO = {
  title: 'Страница не найдена · ДенталстоМед',
  description: 'Такой страницы на сайте нет.',
};

/** Разметка организации для поиска (schema.org). Данные — те же, что на сайте. */
export function clinicJsonLd(origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: 'ДенталстоМед',
    legalName: legal.fullName,
    taxID: legal.inn,
    url: `${origin}/`,
    logo: `${origin}/images/logo.png`,
    image: `${origin}/images/og-cover.jpg`,
    telephone: legalContacts.phone,
    email: legalContacts.email,
    foundingDate: String(clinic.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'проспект Юных Ленинцев, д. 82В, помещение 8 (ТЦ «Максимум»)',
      addressLocality: 'Подольск',
      addressRegion: 'Московская область',
      postalCode: '142111',
      addressCountry: 'RU',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 55.484551, longitude: 37.567411 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '17:00' },
    ],
    sameAs: ['https://yandex.ru/maps/org/dentalstomed/159190759541/'],
  };
}
