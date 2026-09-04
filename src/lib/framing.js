export const DEFAULT_FRAMING = { photoScale: 1.22, photoPosX: 50, photoPosY: 0 };

/**
 * Единый рендер кадра: и фото на сайте, и превью в админке считают его этой
 * функцией — что настроил админ, то и увидит посетитель.
 *
 * Модель — object-position (0–100% по осям) + масштаб. object-position выбирает,
 * какую часть снимка показать, НЕ оголяя края; масштаб — зум сверх заполнения.
 */
export function framingStyle(doctor) {
  const scale = doctor?.photoScale ?? DEFAULT_FRAMING.photoScale;
  const posX  = doctor?.photoPosX  ?? DEFAULT_FRAMING.photoPosX;
  const posY  = doctor?.photoPosY  ?? DEFAULT_FRAMING.photoPosY;
  return {
    objectPosition: `${posX}% ${posY}%`,
    transform: `scale(${scale})`,
    transformOrigin: `${posX}% ${posY}%`,
  };
}
