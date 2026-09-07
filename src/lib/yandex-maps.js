let pending = null;

/**
 * Грузит Яндекс.Карты (JS API 2.1) один раз на страницу.
 *
 * Работаем без API-ключа: мы только показываем карту с меткой и не дёргаем
 * метрируемые функции. Понадобится ключ — дописать `&apikey=…` к адресу.
 */
export function loadYandexMaps() {
  if (window.ymaps?.Map) return Promise.resolve(window.ymaps);
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.async = true;
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
    script.onerror = () => {
      pending = null;
      reject(new Error('Яндекс.Карты не загрузились'));
    };
    document.head.appendChild(script);
  });

  return pending;
}
