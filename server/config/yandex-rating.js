/** Организация «ДенталстоМед» на Яндекс Картах. */
const ORG_ID = '159190759541';

/**
 * Официальный встраиваемый виджет отзывов Яндекс Карт. В отличие от страницы
 * карт отдаётся без капчи и авторизации, и в нём текстом лежит
 * «5,0 332 отзыва • 440 оценок».
 */
const WIDGET_URL = `https://yandex.ru/maps-reviews-widget/${ORG_ID}?comments`;

const DAY = 24 * 60 * 60 * 1000;

/** Вытаскиваем «5,0 332 отзыва • 440 оценок» из HTML виджета. null — формат сменился. */
export function parseWidget(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  // Окончания только кириллицей: \w в JS — это [A-Za-z0-9_], русское «отзыва» им не ловится
  const m = text.match(/(\d,\d)\s+(\d[\d\s ]*?)\s*отзыв[а-яё]*\s*[•·]?\s*(\d[\d\s ]*?)\s*оцен/i);
  if (!m) return null;

  const num = (s) => Number(s.replace(/[\s ]/g, ''));
  const result = { rating: m[1], reviews: num(m[2]), ratings: num(m[3]) };
  return result.reviews > 0 && result.ratings > 0 ? result : null;
}

let cache = { at: 0, value: null };

/**
 * Цифры рейтинга, не чаще раза в сутки. Ошибка Яндекса тоже кэшируется —
 * иначе каждый заход на страницу дёргал бы его заново. null означает
 * «не знаем»: фронт покажет последние известные цифры из своих данных.
 */
export async function getYandexRating() {
  if (Date.now() - cache.at < DAY) return cache.value;

  try {
    const res = await fetch(WIDGET_URL, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
        'accept-language': 'ru',
      },
      signal: AbortSignal.timeout(8000),
    });
    cache = { at: Date.now(), value: res.ok ? parseWidget(await res.text()) : null };
  } catch {
    cache = { at: Date.now(), value: null };
  }

  return cache.value;
}
