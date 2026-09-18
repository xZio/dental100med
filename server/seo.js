import { PAGE_SEO, NOT_FOUND_SEO, clinicJsonLd } from '../src/data/seo.js';

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Страница сайта — SPA: без этого у всех адресов в HTML один <title> главной,
 * а свои заголовок, описание и canonical появляются только после JS. Робот
 * не всегда выполняет скрипты, поэтому отдаём их сразу в HTML. Браузер потом
 * перепишет те же теги через useSEO — дублей не будет, он ищет их по селектору.
 *
 * Возвращает { status, html }: неизвестный адрес — 404 с noindex, а не «пустая» 200.
 */
export function renderPage(template, pathname, origin) {
  const key = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const page = PAGE_SEO[key];
  const seo = page || NOT_FOUND_SEO;
  const url = `${origin}${key}`;

  const tags = [
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta name="robots" content="${page ? 'index, follow' : 'noindex, nofollow'}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="ДенталстоМед" />',
    '<meta property="og:locale" content="ru_RU" />',
    `<meta property="og:image" content="${escapeAttr(`${origin}/images/og-cover.jpg`)}" />`,
    // </script> внутри JSON не встретится: экранируем «<» на всякий случай
    `<script type="application/ld+json">${JSON.stringify(clinicJsonLd(origin)).replace(/</g, '\\u003c')}</script>`,
  ];

  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(seo.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttr(seo.description)}" />`)
    .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`);

  return { status: page ? 200 : 404, html };
}
