import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const clinicPhotos = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `/images/clinic/clinic-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `Интерьер клиники ДенталстоМед — фото ${i + 1}`,
}));

const workPhotos = [
  { id: 1, src: '/images/works/work-01.jpg', alt: 'Работа стоматолога — результат лечения' },
  { id: 2, src: '/images/works/work-02.jpg', alt: 'Эстетическая реставрация зубов' },
  { id: 3, src: '/images/works/work-03.jpg', alt: 'Результат лечения в ДенталстоМед' },
];

const tabs = [
  { id: 'clinic', label: 'Наша клиника', photos: clinicPhotos },
  { id: 'works', label: 'Наши работы', photos: workPhotos },
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
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        <X size={24} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={photos[index].src}
        alt={photos[index].alt}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {index + 1} / {photos.length}
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('clinic');
  const [lightbox, setLightbox] = useState(null);

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-primary-300 text-sm font-medium mb-2">Посмотрите сами</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Галерея</h1>
            <p className="text-primary-200 text-base sm:text-lg max-w-xl">
              Фотографии нашей клиники и примеры выполненных работ.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-70">({currentTab?.id === tab.id ? currentTab.photos.length : tabs.find(t => t.id === tab.id)?.photos.length})</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          >
            {currentTab?.photos.map((photo, i) => (
              <motion.button
                key={photo.id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => setLightbox(i)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                    Открыть
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            photos={currentTab?.photos ?? []}
            startIndex={lightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
