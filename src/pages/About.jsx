import { motion } from 'framer-motion';
import { Shield, Award, Users, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

const milestones = [
  { year: '2008', text: 'Открытие клиники в Подольске' },
  { year: '2012', text: 'Установка цифрового рентгена и 3D-томографа' },
  { year: '2016', text: 'Получение лицензии на имплантологию' },
  { year: '2020', text: 'Расширение — открытие детского кабинета' },
  { year: '2024', text: 'Более 12 000 вылеченных пациентов' },
];

export default function About() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-primary-300 text-sm font-medium mb-2">Наша история</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">О клинике</h1>
            <p className="text-primary-200 text-base sm:text-lg max-w-xl">
              С 2008 года помогаем жителям Подольска сохранять здоровье и красоту улыбки.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Main info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                Семейная клиника с 15-летней историей
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Dental100 — это стоматологическая клиника в Подольске, которой доверяют целые семьи. Мы работаем с детьми от 1 года и пациентами любого возраста.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Наш принцип: лечить только то, что нужно. Никакого навязывания услуг. Честный диагноз, прозрачный план лечения и реальные цены.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }} className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, label: '15+ лет', sub: 'на рынке' },
                { icon: Users, label: '12 000+', sub: 'пациентов' },
                { icon: Stethoscope, label: '7 врачей', sub: 'высшей категории' },
                { icon: Shield, label: 'Гарантия', sub: 'на все работы' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="card p-5 text-center">
                  <Icon size={24} className="text-primary-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-lg">{label}</p>
                  <p className="text-slate-500 text-xs">{sub}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Наш путь</h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-100 -translate-x-1/2" />
              <div className="space-y-6">
                {milestones.map(({ year, text }, i) => (
                  <motion.div
                    key={year}
                    {...fadeUp}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className={`flex items-center gap-4 md:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-10 md:pl-0`}>
                      <div className="card p-4 inline-block">
                        <p className="text-primary-700 font-bold text-lg">{year}</p>
                        <p className="text-slate-600 text-sm">{text}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary-700 rounded-full -translate-x-1/2 border-2 border-white shadow" />
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp} className="text-center">
            <Link to="/contacts" className="btn-primary text-base px-8 py-4">
              Записаться на приём
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
