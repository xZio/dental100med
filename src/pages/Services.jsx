import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { SkeletonRow, ErrorMessage } from '../components/Skeleton.jsx';
import { useSEO } from '../hooks/useSEO.js';
import { groupByCategory } from '../lib/categories.js';
import ServiceIcon from '../components/ServiceIcon.jsx';

export default function Services() {
  useSEO({
    title: 'Услуги и цены',
    description: 'Прайс-лист стоматологической клиники ДенталстоМед в Подольске. Терапия, имплантация, ортодонтия, детская стоматология.',
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const { hash } = useLocation();
  const listRef = useRef(null);

  const { data: services, loading, error } = useFetch(api.getServices);
  const { data: categoryList } = useFetch(api.getCategories);

  // Разделы прайса — в том же порядке, что задан в админке
  const categories = useMemo(() => groupByCategory(services, categoryList), [services, categoryList]);
  const filtered = activeCategory === 'all' ? categories : categories.filter((c) => c.id === activeCategory);

  // Ссылки с главной и из акций ведут на /services#Раздел: разделы грузятся
  // асинхронно, поэтому браузер сам к якорю не прокрутит — включаем фильтр
  // на нужный раздел и подводим к нему, когда прайс уже на странице
  useEffect(() => {
    if (!hash || categories.length === 0) return;
    const wanted = decodeURIComponent(hash.slice(1));
    if (!categories.some((c) => c.id === wanted)) return;
    setActiveCategory(wanted);
    requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }, [hash, categories]);

  return (
    <>
      <section className="panel-blue page-hero page-hero-split page-hero-with-tooth">
        <div>
          <span className="eyebrow">Прозрачные цены</span>
          <h1>Услуги и цены</h1>
          <p>Актуальный прайс-лист. Окончательная стоимость — после осмотра врача.</p>
        </div>
        <img className="page-hero-tooth" src="/images/teeth/tooth-joy.webp" alt="" aria-hidden="true" width="600" height="600" />
      </section>

      {/* Цветные пятна под стеклянными карточками — иначе стеклу нечего размывать */}
      <section className="section-pad relative">
        <div className="glass-blobs" aria-hidden="true">
          <span className="b1" /><span className="b2" /><span className="b3" />
        </div>

        <div ref={listRef} className="relative z-[1] mx-auto max-w-6xl scroll-mt-6">
          {/* Разделы */}
          <div className="mb-10 filter-bar" role="tablist" aria-label="Разделы прайса">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              className={`filter-chip ${activeCategory === 'all' ? 'is-active' : ''}`}
            >
              Все услуги
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`filter-chip ${activeCategory === cat.id ? 'is-active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card">
                  <div className="h-[84px] animate-pulse bg-white/30" />
                  {Array.from({ length: 4 }).map((_, j) => <SkeletonRow key={j} className="border-t border-white/60" />)}
                </div>
              ))}
            </div>
          )}

          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div className="space-y-5">
              {filtered.length === 0 && <p className="py-10 text-center text-muted">Прайс пока пуст</p>}
              {filtered.map((cat) => (
                <div key={cat.id} id={cat.id} className="glass-card">
                  <div className="flex items-center gap-4 px-6 py-5">
                    <span className="glass-card-icon">
                      <ServiceIcon slug={cat.slug} icon={cat.icon} size={64} className="text-white" />
                    </span>
                    <h2 className="text-lg font-semibold tracking-tight text-ink">{cat.label}</h2>
                  </div>
                  <div className="divide-y divide-white/70 border-t border-white/70">
                    {cat.services.map((service) => (
                      <div key={service._id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/45">
                        <div className="min-w-0">
                          <span className="text-sm text-ink sm:text-[15px]">{service.name}</span>
                          {service.note && <span className="mt-0.5 block text-xs text-muted">{service.note}</span>}
                        </div>
                        <span className="flex-shrink-0 whitespace-nowrap text-sm font-semibold text-blue sm:text-[15px]">{service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="panel-blue mt-12 flex flex-col items-start gap-6 px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">Нужна консультация по стоимости?</h3>
                <p className="mt-2 max-w-xl text-sm text-[#d5eef7]">
                  Позвоните нам или запишитесь онлайн — врач составит план лечения и точную смету.
                </p>
              </div>
              <Link to="/contacts" className="button button-light flex-shrink-0">
                Записаться на приём <ArrowUpRight />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
