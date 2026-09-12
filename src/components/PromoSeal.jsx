import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PROMO_COLOR_KEYS, isPromoColor, promoAria, promoTopLines } from '../lib/promo.js';

/**
 * Печать акции: сияющая размытая аура + круг с наклоном. Один и тот же вид на
 * главной и в предпросмотре админки — чтобы администратор видел, влезает ли
 * текст в круг, не открывая сайт.
 *
 * preview — вариант для админки: не ссылка и стоит в потоке, а не в слоте hero.
 */
export default function PromoSeal({ promo, preview = false }) {
  const color = isPromoColor(promo.color) ? promo.color : PROMO_COLOR_KEYS[0];
  const lines = promoTopLines(promo.title);

  const body = (
    <>
      <span className="promo-aura" aria-hidden="true" />
      <span className="promo-body">
        <span className="promo-title">
          {lines.length > 0
            ? lines.map((line, i) => <span key={i}>{line}</span>)
            : <span>&nbsp;</span>}
        </span>
        {promo.discount && <span className="promo-big">{promo.discount}</span>}
        <span className="promo-cta">{promo.cta || 'Записаться'} <ArrowUpRight /></span>
      </span>
    </>
  );

  const className = `promo-seal promo-seal-${color}${preview ? ' promo-seal-static' : ''}`;

  if (preview) return <span className={className}>{body}</span>;

  return (
    <Link
      to={promo.link || '/contacts'}
      className={className}
      title={promo.description || undefined}
      aria-label={promoAria(promo)}
    >
      {body}
    </Link>
  );
}
