/**
 * Акции-печати поверх hero. Из админки правятся тексты, ссылка и цвет; место на
 * экране, наклон и размер шрифта берутся отсюда, чтобы клинике не пришлось
 * возиться с вёрсткой и нельзя было развалить главную.
 */

/** Больше трёх печатей на hero не помещается — столько же режет сервер. */
export const PROMO_MAX = 3;

/** Цвета печатей: ключ хранится в базе, классы лежат в index.css. */
export const PROMO_COLORS = {
  cyan: { label: 'Бирюзовый', dot: 'bg-gradient-to-br from-[#5be0e6] to-[#1aa4b8]' },
  ink:  { label: 'Синий',     dot: 'bg-gradient-to-br from-[#2f86bd] to-[#124a6a]' },
  ice:  { label: 'Белый',     dot: 'bg-gradient-to-br from-white to-[#d4ebf5] border border-[#c9e3ee]' },
};

export const PROMO_COLOR_KEYS = Object.keys(PROMO_COLORS);

export const isPromoColor = (value) => Object.hasOwn(PROMO_COLORS, value);

/** Верхние строки печати: не больше двух, пустые отбрасываем. */
export const promoTopLines = (title) =>
  String(title ?? '').split('\n').map((line) => line.trim()).filter(Boolean).slice(0, 2);

/** Подпись для незрячих: то же, что видно на печати. */
export const promoAria = (promo) =>
  [promoTopLines(promo.title).join(' '), promo.discount].filter(Boolean).join(' — ');

/**
 * Куда может вести акция. Выбор из готовых страниц, а не поле для адреса: так
 * администратору не нужно знать ссылки и нельзя привести на несуществующую.
 * Разделы прайса подставляются из админки, поэтому список собирается функцией.
 */
export function promoLinks(categories = []) {
  return [
    { href: '/contacts', label: 'Онлайн-запись' },
    { href: '/services', label: 'Услуги и цены' },
    { href: '/doctors', label: 'Врачи' },
    { href: '/gallery', label: 'Галерея' },
    { href: '/about', label: 'О клинике' },
    ...categories.map((c) => ({ href: `/services#${c.name}`, label: `Раздел: ${c.name}` })),
  ];
}
