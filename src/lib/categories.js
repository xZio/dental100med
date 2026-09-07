import { Stethoscope, Baby, Crown, Scissors, Zap, AlignJustify, Sparkles, Search, Smile, Layers } from 'lucide-react';

/**
 * Категории прайса: латинский slug под картинку и запасная иконка.
 * Картинка ищется по адресу /images/services/<slug>.webp — пока её нет,
 * рисуем иконку. Клиника добавит файл, и он подхватится сам.
 */
export const CATEGORY_META = {
  'Консультация и диагностика': { slug: 'diagnostics',  icon: Search },
  'Лечение зубов — терапия':    { slug: 'therapy',      icon: Stethoscope },
  'Реставрация':                { slug: 'restoration',  icon: Sparkles },
  'Гигиена и профилактика':     { slug: 'hygiene',      icon: Smile },
  'Детская стоматология':       { slug: 'kids',         icon: Baby },
  'Протезирование — ортопедия': { slug: 'prosthetics',  icon: Crown },
  'Виниры':                     { slug: 'veneers',      icon: Layers },
  'Имплантация':                { slug: 'implantation', icon: Zap },
  'Хирургия':                   { slug: 'surgery',      icon: Scissors },
  'Брекеты и элайнеры':         { slug: 'orthodontics', icon: AlignJustify },
};

export const metaOf = (name) => CATEGORY_META[name] ?? { slug: null, icon: Stethoscope };

/**
 * Услуги, разложенные по категориям В ПОРЯДКЕ ПРАЙСА. Порядок задаёт таблица
 * категорий, а не алфавит: consultation идёт первой, брекеты последними.
 * Категории, которых ещё нет в справочнике, показываем в конце — иначе
 * добавленная в админке услуга просто пропала бы со страницы.
 */
export function groupByCategory(services, categories) {
  if (!services) return [];

  const buckets = new Map();
  for (const service of services) {
    if (!buckets.has(service.category)) buckets.set(service.category, []);
    buckets.get(service.category).push(service);
  }

  const ordered = (categories ?? []).map((c) => c.name).filter((name) => buckets.has(name));
  const rest = [...buckets.keys()].filter((name) => !ordered.includes(name));

  return [...ordered, ...rest].map((name) => ({
    id: name,
    label: name,
    ...metaOf(name),
    services: buckets.get(name),
  }));
}
