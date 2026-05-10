import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { SkeletonRow, ErrorMessage } from '../components/Skeleton.jsx';
import { useSEO } from '../hooks/useSEO.js';

// Ключи — русские названия категорий (как в MongoDB)
const CATEGORY_ICONS = {
  'Терапия':               '🦷',
  'Детская стоматология':  '👶',
  'Ортопедия':             '👑',
  'Хирургия':              '⚕️',
  'Имплантация':           '🔩',
  'Ортодонтия':            '😁',
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

export default function Services() {
  useSEO({
    title: 'Услуги и цены',
    description: 'Прайс-лист стоматологической клиники ДенталстоМед в Подольске. Терапия, имплантация, ортодонтия, детская стоматология.',
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { data: services, loading, error } = useFetch(api.getServices);

  // Группируем услуги по категориям
  const categories = useMemo(() => {
    if (!services) return [];
    const map = {};
    services.forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return Object.entries(map).map(([id, items]) => ({
      id,
      label: id,
      icon: CATEGORY_ICONS[id] || '🦷',
      services: items,
    }));
  }, [services]);

  const filtered = useMemo(() => {
    let cats = activeCategory === 'all' ? categories : categories.filter(c => c.id === activeCategory);
    if (search.trim()) {
      cats = cats.map(c => ({
        ...c,
        services: c.services.filter(s => s.name.toLowerCase().includes(search.toLowerCase())),
      })).filter(c => c.services.length > 0);
    }
    return cats;
  }, [categories, activeCategory, search]);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-xl">
            <p className="text-primary-300 text-sm font-medium mb-2">Прозрачные цены</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Услуги и цены</h1>
            <p className="text-primary-200 text-base sm:text-lg">
              Актуальный прайс-лист. Окончательная стоимость — после осмотра врача.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Поиск */}
          <div className="relative max-w-md mb-6">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск услуги..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm"
            />
          </div>

          {/* Категории */}
          <div className="flex gap-2 flex-wrap mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary-700 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              Все услуги
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-primary-700 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Загрузка */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="bg-primary-50 px-6 py-4 h-14 animate-pulse" />
                  {Array.from({ length: 4 }).map((_, j) => <SkeletonRow key={j} className="border-t border-slate-100" />)}
                </div>
              ))}
            </div>
          )}

          {/* Ошибка */}
          {error && <ErrorMessage message={error} />}

          {/* Список услуг */}
          {!loading && !error && (
            <div className="space-y-6">
              {filtered.length === 0 && (
                <p className="text-slate-500 text-center py-10">Ничего не найдено</p>
              )}
              {filtered.map((cat, i) => (
                <motion.div key={cat.id} id={cat.id} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }} className="card overflow-hidden">
                  <div className="bg-primary-50 px-6 py-4 flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <h2 className="text-lg font-bold text-primary-800">{cat.label}</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {cat.services.map(service => (
                      <div key={service._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                        <span className="text-slate-700 text-sm sm:text-base">{service.name}</span>
                        <span className="text-primary-700 font-semibold whitespace-nowrap text-sm sm:text-base flex-shrink-0">
                          {service.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          {!loading && (
            <motion.div {...fadeUp} className="mt-12 bg-primary-700 rounded-2xl p-8 text-white text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Нужна консультация по стоимости?</h3>
              <p className="text-primary-200 mb-6 text-sm sm:text-base">
                Позвоните нам или запишитесь онлайн — врач составит план лечения и точную смету.
              </p>
              <Link to="/contacts" className="bg-white text-primary-800 hover:bg-primary-50 font-semibold px-7 py-3 rounded-xl transition-all inline-flex items-center gap-2">
                Записаться бесплатно <ChevronRight size={18} />
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
