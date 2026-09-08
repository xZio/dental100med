import { Star } from 'lucide-react';
import { reviews } from '../data/reviews.js';
import Marquee from './Marquee.jsx';
import YandexRating from './YandexRating.jsx';

function Stars({ n }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${n} из 5`}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={13} className="fill-[#F5A623] text-[#F5A623]" aria-hidden />
      ))}
    </div>
  );
}

function ReviewCard({ name, date, text, rating }) {
  return (
    <div className="w-[270px] rounded-[18px] border border-[#c9e3ee] bg-white/85 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9dcfe1] text-sm font-semibold text-ink">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-tight text-ink">{name}</p>
          <p className="truncate text-xs leading-tight text-muted">{date}</p>
        </div>
      </div>
      <div className="mt-3">
        <Stars n={rating} />
      </div>
      <p className="mt-2.5 line-clamp-6 text-[13px] leading-relaxed text-[#3d6a83]">{text}</p>
    </div>
  );
}

/**
 * Стена отзывов — настоящие отзывы пациентов с Яндекс Карт в 3D-витрине
 * из бегущих колонок, рядом с заголовком — карточка рейтинга с наградой
 * «Хорошее место». Колонки раздаются по кругу, чтобы карточки в соседних
 * не повторялись; на узких экранах лишние колонки прячутся.
 */
export default function Reviews() {
  const columns = [0, 1, 2, 3].map((col) => reviews.filter((_, i) => i % 4 === col));

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-pad overflow-hidden bg-[#e7f3f7]">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Ваши истории</span>
          <h2 id="reviews-title">Улыбки говорят<br /><span className="soft-text">сами за себя.</span></h2>
        </div>
        <YandexRating />
      </div>

      <div className="relative flex h-[460px] items-center justify-center [perspective:1200px]">
        <div className="flex gap-3" style={{ transform: 'rotateX(5deg) rotateY(-11deg) rotateZ(4deg) scale(1.04)' }}>
          {columns.map((column, i) => (
            <Marquee
              key={i}
              vertical
              reverse={i % 2 === 1}
              className={`reviews-fade h-[460px] ${
                i === 0 ? 'flex' : i === 1 ? 'hidden sm:flex' : i === 2 ? 'hidden lg:flex' : 'hidden xl:flex'
              }`}
              style={{ '--dur': `${46 + i * 4}s` }}
            >
              {column.map((review, j) => (
                <ReviewCard key={j} {...review} />
              ))}
            </Marquee>
          ))}
        </div>
      </div>
    </section>
  );
}
