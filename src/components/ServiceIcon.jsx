import { useState } from 'react';

/**
 * Значок категории услуг. Если для неё есть картинка
 * /images/services/<slug>.webp — показываем её, иначе рисуем иконку.
 * Так новые картинки достаточно положить в папку, ничего не правя в коде.
 */
export default function ServiceIcon({ slug, icon: Icon, size = 22, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (slug && !failed) {
    return (
      <img
        src={`/images/services/${slug}.webp`}
        alt=""
        aria-hidden
        loading="lazy"
        onError={() => setFailed(true)}
        className={className}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    );
  }

  return <Icon size={size} className={className} aria-hidden />;
}
