// В продакшене фронт и бэк на одном домене → /api
// Локально → отдельный порт 5000
const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
}

// Бейдж рейтинга стоит на странице по 2–3 раза — запрос делаем один на сессию
let ratingPromise = null;

export const api = {
  getServices:    () => request('/services'),
  getCategories:  () => request('/categories'),
  getDoctors:     () => request('/doctors'),
  getPromotions:  () => request('/promotions'),
  getGallery:     () => request('/gallery'),
  // 204 — Яндекс не ответил: показываем запасные цифры, а не ошибку
  getRating: () => {
    ratingPromise ??= fetch(`${BASE_URL}/rating`).then((res) => (res.status === 204 ? null : res.json()));
    return ratingPromise;
  },
  sendAppointment: async (data) => {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // Сервер отвечает JSON и на ошибку — без проверки статуса форма показала бы «отправлено»
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || `Ошибка ${res.status}`);
    return body;
  },
};
