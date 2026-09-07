/**
 * Цена в прайсе — свободная строка: «от 10 270 ₽», «2 640 – 3 500 ₽», «бесплатно».
 * Для карточек категорий нужен нижний порог числом, поэтому вытаскиваем
 * первое число из строки. «бесплатно» — это ноль, а не «нет цены».
 */
export function priceValue(price) {
  if (typeof price === 'number') return price;
  const text = String(price ?? '');
  if (/бесплатн/i.test(text)) return 0;
  const digits = text.replace(/\s| /g, '').match(/\d+/);
  return digits ? Number(digits[0]) : null;
}

/** Подпись «от N ₽» для карточки категории; бесплатная услуга ломает «от». */
export function priceFrom(services) {
  const values = services.map((s) => priceValue(s.price)).filter((v) => v !== null && v > 0);
  if (values.length === 0) return 'бесплатно';
  return `от ${Math.min(...values).toLocaleString('ru-RU')} ₽`;
}
