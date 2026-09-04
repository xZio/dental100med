/**
 * Дублирование заявки в zio-forms — оттуда она уходит письмом.
 * Заявка при этом остаётся в своей базе и в админке: это дополнительный
 * канал уведомления, а не замена.
 */

const ENDPOINT = process.env.ZIO_FORMS_URL || 'https://forms.zio-dev.com/api/submit';
const ORIGIN = process.env.SITE_ORIGIN || 'https://dental100med.zio-dev.com';

/** Без ключа отправка просто выключена — локальная разработка не шлёт заявки в прод. */
export const forwardAppointment = async ({ name, phone, message }) => {
  const key = process.env.ZIO_FORMS_KEY;
  if (!key) return;

  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        // Запрос идёт с сервера, поэтому Origin проставляем сами — по нему
        // сервис сверяет сайт со списком разрешённых доменов.
        origin: ORIGIN,
      },
      body: JSON.stringify({ access_key: key, name, phone, message: message || '' }),
    });
  } catch {
    // Сеть недоступна или сервис лежит — заявка уже сохранена, молча пропускаем.
  }
};
