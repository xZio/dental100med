/**
 * Бесконечная лента. Дублирует содержимое `repeat` раз, чтобы стык был
 * незаметен; при наведении останавливается.
 */
export default function Marquee({ children, vertical = false, reverse = false, repeat = 2, className = '', style }) {
  return (
    <div style={style} className={`group flex overflow-hidden gap-3 ${vertical ? 'flex-col' : 'flex-row'} ${className}`}>
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={`flex shrink-0 gap-3 ${vertical ? 'flex-col animate-marquee-v' : 'flex-row animate-marquee-h'} group-hover:[animation-play-state:paused]`}
          style={reverse ? { animationDirection: 'reverse' } : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
