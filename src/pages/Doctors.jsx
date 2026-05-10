import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { SkeletonCard, ErrorMessage } from '../components/Skeleton.jsx';
import { useSEO } from '../hooks/useSEO.js';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

export default function Doctors() {
  useSEO({
    title: 'Наши врачи',
    description: 'Опытные стоматологи клиники ДенталстоМед в Подольске. Терапевты, хирурги, ортодонты, имплантологи.',
  });

  const { data: doctors, loading, error } = useFetch(api.getDoctors);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-primary-300 text-sm font-medium mb-2">Профессионалы своего дела</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Наши врачи</h1>
            <p className="text-primary-200 text-base sm:text-lg max-w-xl">
              Регулярно проходят обучение и повышение квалификации в России и за рубежом.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Скелетон загрузки */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Ошибка */}
          {error && <ErrorMessage message={error} />}

          {/* Данные */}
          {doctors && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc, i) => (
                <motion.div
                  key={doc._id}
                  {...fadeUp}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="card p-6"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 mb-4 flex-shrink-0 relative">
                    {doc.photo ? (
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="fallback-icon absolute inset-0 items-center justify-center"
                      style={{ display: doc.photo ? 'none' : 'flex' }}
                    >
                      <Stethoscope size={34} className="text-primary-700" />
                    </div>
                  </div>
                  <h2 className="font-bold text-slate-800 text-lg leading-snug">{doc.name}</h2>
                  <p className="text-primary-600 text-sm font-semibold mt-1">{doc.specialty}</p>
                  <p className="text-slate-400 text-xs mt-1 mb-3">{doc.experience}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{doc.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
