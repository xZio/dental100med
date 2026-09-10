import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Роутер сам не трогает прокрутку: клик по «Контакты» в подвале открывал бы
 * страницу на той же высоте, где был подвал. Переходы с якорем (#раздел)
 * пропускаем — к ним прокручивает сама страница, когда данные загрузятся.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
