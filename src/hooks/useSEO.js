import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'ДенталстоМед — стоматология в Подольске';

function setMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
}

/**
 * Заголовок, описание, canonical и Open Graph для текущей страницы.
 * SPA не перезагружает документ, поэтому теги переписываем при каждом переходе.
 */
export function useSEO({ title, description, noindex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const url = `${window.location.origin}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;

    document.title = fullTitle;
    if (description) setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('link[rel="canonical"]', { rel: 'canonical', href: url });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    if (description) setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'ДенталстоМед' });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'ru_RU' });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: `${window.location.origin}/images/og-cover.jpg` });
    // 404 и служебные страницы поисковику не нужны
    setMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' });

    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, noindex, pathname]);
}
