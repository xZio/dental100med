import { useEffect, useRef, useState } from 'react';

/**
 * Число, которое досчитывается до значения, когда попадает в кадр.
 * Разбираем строку вида «12 000+» или «98%»: цифры анимируем, всё
 * остальное оставляем как есть. Уважаем prefers-reduced-motion —
 * при нём просто показываем итоговое значение.
 */
export default function CountUp({ value, duration = 1400, className = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const digits = value.replace(/[^\d]/g, '');
    const target = Number(digits);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!target || reduced) return;

    // Пробел внутри «12 000+» — часть числа, поэтому хвост ищем после ПОСЛЕДНЕЙ цифры
    const first = value.search(/\d/);
    const last = value.length - 1 - [...value].reverse().findIndex((c) => /\d/.test(c));
    const prefix = value.slice(0, first);
    const suffix = value.slice(last + 1);
    const format = (n) => prefix + n.toLocaleString('ru-RU') + suffix;

    const node = ref.current;
    if (!node) return;

    let raf = 0;
    const run = () => {
      // На скрытой вкладке кадры не идут: не обнуляем счётчик, иначе там
      // навсегда останется «0+» вместо «15+»
      if (document.visibilityState !== 'visible') return;
      setDisplay(format(0));
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        // Замедление к концу: счётчик «доезжает», а не обрывается
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(format(Math.round(target * eased)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}
