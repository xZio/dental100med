import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { useSEO } from '../hooks/useSEO.js';

const TABS = [
  { id: 'clinic', label: 'Наша клиника' },
  { id: 'works', label: 'Наши работы' },
];

function Lightbox({ photos, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIndex((i) => (i + 1) % photos.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d3a57]/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20" aria-label="Закрыть">
        <X size={24} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20" aria-label="Предыдущее фото">
        <ChevronLeft size={24} />
      </button>
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={photos[index].src}
        alt={photos[index].alt}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20" aria-label="Следующее фото">
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
        {index + 1} / {photos.length}
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  useSEO({
    title: 'Галерея',
    description: 'Фотографии клиники ДенталстоМед в Подольске и примеры выполненных работ.',
  });

  const [activeTab, setActiveTab] = useState('clinic');
  const [lightbox, setLightbox] = useState(null);
  const { data: images } = useFetch(api.getGallery);

  const all = images ?? [];
  const tabs = TABS.map((tab) => ({ ...tab, photos: all.filter((p) => p.tab === tab.id) }));
  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <>
      <section className="panel-blue page-hero page-hero-split page-hero-with-tooth">
        <div>
          <span className="eyebrow">Посмотрите сами</span>
          <h1>Галерея</h1>
          <p>Фотографии нашей клиники и примеры выполненных работ.</p>
        </div>
        <img className="page-hero-tooth" src="/images/teeth/tooth-smile.webp" alt="" aria-hidden="true" width="600" height="600" />
      </section>

      <section className="section-pad">
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-colors ${
                activeTab === tab.id ? 'bg-blue text-white' : 'bg-white/80 text-ink border border-blue/20 hover:bg-white'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">{tab.photos.length}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4"
        >
          {currentTab?.photos.map((photo, i) => (
            <button
              key={photo._id}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative aspect-square overflow-hidden rounded-[20px] bg-[#cce9f2] transition-shadow duration-300 hover:shadow-lg hover:shadow-blue/20"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Открыть
                </span>
              </span>
            </button>
          ))}
        </motion.div>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox photos={currentTab?.photos ?? []} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
