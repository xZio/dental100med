import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { SkeletonRow, ErrorMessage } from '../components/Skeleton.jsx';
import { useSEO } from '../hooks/useSEO.js';
import { groupByCategory } from '../lib/categories.js';
import ServiceIcon from '../components/ServiceIcon.jsx';

const chip = (active) =>
  `px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
    active ? 'bg-blue text-white' : 'bg-white/80 text-ink border border-blue/20 hover:bg-white'
  }`;

export default function Services() {
  useSEO({
    title: 'Услуги и цены',
    description: 'Прайс-лист стоматологической клиники ДенталстоМед в Подольске. Терапия, имплантация, ортодонтия, детская стоматология.',
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { data: services, loading, error } = useFetch(api.getServices);
  const { data: categoryList } = useFetch(api.getCategories);

  // Разделы прайса — в том же порядке, что задан в админке
  const categories = useMemo(() => groupByCategory(services, categoryList), [services, categoryList]);

  const filtered = useMemo(() => {
    let cats = activeCategory === 'all' ? categories : categories.filter((c) => c.id === activeCategory);
    if (search.trim()) {
      cats = cats
        .map((c) => ({ ...c, services: c.services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())) }))
        .filter((c) => c.services.length > 0);
    }
    return cats;
  }, [categories, activeCategory, search]);

  return (
    <>
      <section className="panel-blue page-hero">
        <span className="eyebrow">Прозрачные цены</span>
        <h1>Услуги и цены</h1>
        <p>Актуальный прайс-лист. Окончательная стоимость — после осмотра врача.</p>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-6xl">
          {/* Поиск */}
          <div className="relative mb-6 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Поиск услуги…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-blue/20 bg-white/80 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:border-blue focus:outline-none"
            />
          </div>

          {/* Разделы */}
          <div className="mb-10 flex flex-wrap gap-2">
            <button type="button" onClick={() => setActiveCategory('all')} className={chip(activeCategory === 'all')}>
              Все услуги
            </button>
            {categories.map((cat) => (
              <button key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)} className={chip(activeCategory === cat.id)}>
                {cat.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="h-16 animate-pulse bg-blue/10" />
                  {Array.from({ length: 4 }).map((_, j) => <SkeletonRow key={j} className="border-t border-blue/10" />)}
                </div>
              ))}
            </div>
          )}

          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div className="space-y-5">
              {filtered.length === 0 && <p className="py-10 text-center text-muted">Ничего не найдено</p>}
              {filtered.map((cat) => (
                <div key={cat.id} id={cat.id} className="card overflow-hidden">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-[#3e91bd] to-[#2f7fae] px-6 py-4 text-snow">
                    <ServiceIcon slug={cat.slug} icon={cat.icon} size={44} className="flex-shrink-0 text-white" />
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">{cat.label}</h2>
                    </div>
                  </div>
                  <div className="divide-y divide-blue/10">
                    {cat.services.map((service) => (
                      <div key={service._id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white">
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
