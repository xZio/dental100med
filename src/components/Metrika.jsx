import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/** Счётчик клиники в Яндекс.Метрике. Не секрет — лежит в коде, как и на любом сайте. */
export const YM_ID = 112353469;

/** Метрика включается только в проде: локальные заходы не должны попадать в статистику. */
const enabled = import.meta.env.PROD;

/** Отправить достижение цели. Если Метрика не загрузилась — молча ничего не делаем. */
export function reachGoal(goal, params) {
  if (typeof window.ym === 'function') window.ym(YM_ID, 'reachGoal', goal, params);
}

/**
 * Подключает счётчик и сообщает ему о переходах. Сайт — SPA: смена страницы
 * не перезагружает документ, поэтому просмотры нужно отправлять вручную,
 * иначе в отчётах будет видна только та страница, с которой начали.
 */
export default function Metrika() {
  const { pathname, search } = useLocation();
  const started = useRef(false);
  const firstHitSkipped = useRef(false);

  useEffect(() => {
    if (!enabled || started.current) return;
    started.current = true;

    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    window.ym(YM_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }, []);

  useEffect(() => {
    if (!enabled || typeof window.ym !== 'function') return;
    // Первый просмотр отправляет сам init — вручную шлём только последующие
    if (!firstHitSkipped.current) {
      firstHitSkipped.current = true;
      return;
    }
    window.ym(YM_ID, 'hit', pathname + search);
  }, [pathname, search]);

  return null;
}
