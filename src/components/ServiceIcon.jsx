import { useEffect, useState } from 'react';

/**
 * Значок категории услуг. Если есть картинка /images/services/<slug>.webp —
 * показываем её, иначе рисуем иконку. Новую картинку достаточно положить
 * в папку, править код не нужно.
 *
 * Картинку подставляем ТОЛЬКО после того, как она успешно загрузилась:
 * несуществующий файл сервер отдаёт как страницу (SPA-фолбэк), и <img>
 * успевает мигнуть значком битого изображения, прежде чем сработает onError.
 */
export default function ServiceIcon({ slug, icon: Icon, size = 22, className = '' }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const url = `/images/services/${slug}.webp`;
    const probe = new Image();
    probe.onload = () => setSrc(url);
    probe.src = url;
    return () => { probe.onload = null; };
  }, [slug]);

  if (src) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden
        className={className}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    );
  }

  return <Icon size={size} className={className} aria-hidden />;
}
