import { ArrowUpRight, Star } from 'lucide-react';
import { reviews, reviewsSummary } from '../data/reviews.js';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { plural } from '../lib/plural.js';
import Marquee from './Marquee.jsx';

function Stars({ n, size = 13 }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${n} из 5`}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={size} className="fill-[#F5A623] text-[#F5A623]" aria-hidden />
      ))}
    </div>
  );
}

function ReviewCard({ name, date, text, rating }) {
  return (
    <div className="w-[250px] rounded-[18px] border border-[#c9e3ee] bg-white/85 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9dcfe1] text-sm font-semibold text-ink">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-tight text-ink">{name}</p>
          <p className="truncate text-[11px] leading-tight text-muted">{date}</p>
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
 * Отзывы: слева сводка с живым рейтингом (как в макете), справа — стена
 * из настоящих отзывов с Яндекс Карт в 3D-витрине из бегущих колонок.
 * Колонки раздаются по кругу, чтобы карточки в соседних не повторялись.
 */
export default function Reviews() {
  const { data: live } = useFetch(api.getRating);
  const rating = live?.rating ?? reviewsSummary.rating;
  const count = live?.reviews ?? reviewsSummary.reviews;
  const columns = [0, 1, 2].map((col) => reviews.filter((_, i) => i % 3 === col));

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="reviews section-pad">
      <div className="reviews-summary">
        <span className="eyebrow">04 / Ваши истории</span>
        <h2 id="reviews-title">Улыбки говорят<br />сами за себя.</h2>
        <div className="rating-big">
          <b>{rating}</b>
          <div>
            <Stars n={5} size={14} />
            <span>{count} {plural(count, ['отзыв', 'отзыва', 'отзывов'])} на Яндекс Картах</span>
          </div>
        </div>
        <a className="text-button" href={reviewsSummary.url} target="_blank" rel="noopener noreferrer">
          Все отзывы <ArrowUpRight />
        </a>
      </div>

      <div className="relative flex h-[440px] items-center justify-center [perspective:1200px]">
        <div className="flex gap-3" style={{ transform: 'rotateX(5deg) rotateY(-11deg) rotateZ(4deg) scale(1.02)' }}>
          {columns.map((column, i) => (
            <Marquee
              key={i}
              vertical
              reverse={i % 2 === 1}
              className={`reviews-fade h-[440px] ${i === 0 ? 'flex' : i === 1 ? 'hidden sm:flex' : 'hidden xl:flex'}`}
              style={{ '--dur': `${46 + i * 5}s` }}
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
