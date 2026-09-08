import { Star } from 'lucide-react';
import { reviewsSummary } from '../data/reviews.js';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { plural } from '../lib/plural.js';
import GoodPlaceBadge from './GoodPlaceBadge.jsx';

/**
 * Карточка-наклейка рейтинга на Яндекс Картах: цифры сервер обновляет раз
 * в сутки, при недоступности Яндекса показываем последние известные.
 * Вся карточка — ссылка на отзывы.
 */
export default function YandexRating({ className = '' }) {
  const { data: live } = useFetch(api.getRating);

  const rating = live?.rating ?? reviewsSummary.rating;
  const ratings = live?.ratings ?? reviewsSummary.ratings;
  const reviews = live?.reviews ?? reviewsSummary.reviews;
  const reviewsWord = plural(reviews, ['отзыв', 'отзыва', 'отзывов']);

  return (
    <a
      href={reviewsSummary.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Рейтинг ${rating} из 5 на Яндекс Картах, ${reviews} ${reviewsWord} — открыть отзывы`}
      className={`inline-flex -rotate-2 items-stretch gap-5 rounded-[18px] border border-[#c9e3ee] bg-white px-6 py-4 shadow-lg shadow-blue/10 transition-transform duration-300 hover:rotate-0 ${className}`}
    >
      <div className="flex flex-col items-center justify-center">
        <span className="text-[34px] font-black leading-none text-[#4d4d4d]">{rating}</span>
        <div className="mt-1.5 flex gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} className="fill-[#FFCC00] text-[#FFCC00]" />
          ))}
        </div>
        <span className="mt-1.5 text-xs text-muted">
          {ratings} {plural(ratings, ['оценка', 'оценки', 'оценок'])}
        </span>
      </div>

      <span className="w-px shrink-0 bg-[#c9e3ee]" aria-hidden />

      <div className="flex flex-col justify-center gap-1">
        <span className="inline-flex items-center gap-2">
          <GoodPlaceBadge className="h-6 w-[42px] flex-shrink-0" />
          <span className="text-[15px] font-bold text-ink">{reviewsSummary.award}</span>
        </span>
        <span className="text-[13px] text-muted">
          {reviews} {reviewsWord} на {reviewsSummary.source}
        </span>
      </div>
    </a>
  );
}
