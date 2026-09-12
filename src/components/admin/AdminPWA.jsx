import { useEffect } from 'react';

// Зум запрещён: это панель-приложение, а не текст для чтения, и случайный
// пинч только сбивает раскладку с нижней панелью. В установленном PWA iOS и
// Android это уважают, в обычной вкладке Safari — игнорирует.
const VIEWPORT = 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, viewport-fit=cover';

/**
 * Теги установки приложения — только для админки: на «Домой» ставится панель
 * заявок, а не сайт клиники. Стоит и на экране входа: именно оттуда чаще всего
 * добавляют приложение, а на iPhone без установки Apple вообще не шлёт push.
 *
 * viewport-fit=cover нужен, чтобы в установленном приложении работал
 * env(safe-area-inset-*) — иначе нижняя кромка липнет к полоске-индикатору.
 */
export default function AdminPWA() {
  useEffect(() => {
    const added = [];

    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/admin.webmanifest';
    document.head.appendChild(manifest);
    added.push(manifest);

    for (const [name, content] of [
      ['apple-mobile-web-app-capable', 'yes'],
      // Подпись под иконкой на iPhone. Android берёт её из short_name манифеста
      ['apple-mobile-web-app-title', 'СтоМед'],
      ['apple-mobile-web-app-status-bar-style', 'default'],
    ]) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
      added.push(meta);
    }

    const viewport = document.head.querySelector('meta[name="viewport"]');
    const original = viewport?.content;
    if (viewport) viewport.content = VIEWPORT;

    return () => {
      added.forEach((el) => el.remove());
      if (viewport && original) viewport.content = original;
    };
  }, []);

  return null;
}
