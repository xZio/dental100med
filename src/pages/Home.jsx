import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone, ChevronRight, Shield, Clock, Star, Users, Award, Smile,
  Stethoscope, Baby, Crown, Scissors, Zap, AlignJustify, Tag
} from 'lucide-react';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { useSEO } from '../hooks/useSEO.js';

// Ключи — русские названия категорий (как в MongoDB)
const CATEGORY_META = {
  'Терапия':               { icon: Zap },
  'Детская стоматология':  { icon: Baby },
  'Ортопедия':             { icon: Crown },
  'Хирургия':              { icon: Scissors },
  'Имплантация':           { icon: Stethoscope },
  'Ортодонтия':            { icon: AlignJustify },
};

const stats = [
  { value: '15+', label: 'лет работы', icon: Award },
  { value: '12 000+', label: 'пациентов', icon: Users },
  { value: '7', label: 'врачей', icon: Stethoscope },
  { value: '98%', label: 'довольных', icon: Smile },
];

const advantages = [
  {
    icon: Shield,
    title: 'Гарантия качества',
    text: 'Даём письменную гарантию на все виды лечения и протезирования.',
  },
  {
    icon: Clock,
    title: 'Без очередей',
    text: 'Принимаем строго по записи — ваше время ценно.',
  },
  {
    icon: Star,
    title: 'Современное оборудование',
    text: 'Цифровой рентген, лазер, 3D-томограф — лечим точно и безболезненно.',
  },
  {
    icon: Smile,
    title: 'Семейная клиника',
    text: 'Принимаем детей от 1 года. Создаём комфортную атмосферу для всей семьи.',
  },
];


const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Home() {
  useSEO({
    title: 'Стоматология в Подольске',
    description: 'Семейная стоматологическая клиника ДенталстоМед в Подольске. Лечение, имплантация, ортодонтия. Запись онлайн.',
  });

  const { data: services }    = useFetch(api.getServices);
  const { data: doctors }     = useFetch(api.getDoctors);
  const { data: promotions }  = useFetch(api.getPromotions);

  // Группируем услуги по категориям для карточек на главной
  const serviceCategories = services
    ? Object.entries(
        services.reduce((acc, s) => {
          if (!acc[s.category]) acc[s.category] = [];
          acc[s.category].push(s);
          return acc;
        }, {})
      ).map(([id, items]) => ({
        id,
        label: id,
        icon: (CATEGORY_META[id] || { icon: Zap }).icon,
        services: items,
      }))
    : [];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary-300 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            >
              <Star size={14} className="text-yellow-300" />
              ДенталстоМед — стоматология в Подольске с 2008 года
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Красивая улыбка —<br />
              <span className="text-primary-200">это просто</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-primary-100 leading-relaxed max-w-xl"
            >
              Лечим зубы быстро, безболезненно и по разумным ценам. Семейная клиника в ТЦ Максимум — врачи высшей категории.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col xs:flex-row gap-3"
            >
              <Link
                to="/contacts"
                className="bg-white text-primary-800 hover:bg-primary-50 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 inline-flex items-center justify-center gap-2"
              >
                Записаться на приём
                <ChevronRight size={18} />
              </Link>
              <a
                href="tel:+74959241917"
                className="border-2 border-white/40 hover:border-white text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Phone size={18} />
                Позвонить нам
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-primary-700" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <h2 className="section-title">Наши услуги</h2>
            <p className="section-subtitle">Полный спектр стоматологической помощи для всей семьи</p>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {serviceCategories.length === 0 && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-40" />
            ))}
            {serviceCategories.map((cat, i) => {
              const Icon = cat.icon || Zap;
              const minPrice = Math.min(...cat.services.map((s) => s.price));
              return (
                <motion.div
                  key={cat.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    to={`/services#${cat.id}`}
                    className="card p-6 block group hover:-translate-y-1 transition-transform duration-200"
                  >
                    <div className="w-12 h-12 bg-primary-50 group-hover:bg-primary-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                      <Icon size={22} className="text-primary-700" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg mb-1">{cat.label}</h3>
                    <p className="text-sm text-slate-500 mb-3">{cat.services.length} услуги</p>
                    <p className="text-primary-700 font-semibold text-sm">
                      от {minPrice.toLocaleString('ru-RU')} ₽
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Смотреть цены <ChevronRight size={15} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div {...fadeUp} className="text-center mt-10">
            <Link to="/services" className="btn-primary">
              Все услуги и цены
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <h2 className="section-title">Почему выбирают нас</h2>
            <p className="section-subtitle">Мы делаем всё, чтобы визит к стоматологу был комфортным</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} className="text-primary-700" />
                </div>
                <h3 className="font-semibold text-slate-800 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors preview */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <h2 className="section-title">Наши врачи</h2>
            <p className="section-subtitle">Опытные специалисты с постоянным повышением квалификации</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {!doctors && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse flex gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
            {(doctors || []).slice(0, 3).map((doc, i) => (
              <motion.div
                key={doc._id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6 flex items-start gap-4"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0 relative">
                  {doc.photo ? (
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.querySelector('.fb').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="fb absolute inset-0 items-center justify-center" style={{ display: doc.photo ? 'none' : 'flex' }}>
                    <Stethoscope size={22} className="text-primary-700" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 leading-snug">{doc.name}</h3>
                  <p className="text-primary-600 text-sm font-medium mt-0.5">{doc.specialty}</p>
                  <p className="text-slate-400 text-xs mt-1">{doc.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-8">
            <Link to="/doctors" className="btn-outline">
              Все врачи <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Promotions */}
      {promotions && promotions.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
              <h2 className="section-title">Акции и спецпредложения</h2>
              <p className="section-subtitle">Выгодные предложения для наших пациентов</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {promotions.map((promo, i) => (
                <motion.div
                  key={promo._id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card p-6 border-l-4 border-l-primary-500 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                      <Tag size={18} className="text-primary-600" />
                    </div>
                    {promo.discount && (
                      <span className="bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {promo.discount}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{promo.title}</h3>
                  {promo.description && (
                    <p className="text-slate-500 text-sm leading-relaxed flex-1">{promo.description}</p>
                  )}
                  {promo.expiresAt && (
                    <p className="text-xs text-slate-400">
                      До {new Date(promo.expiresAt).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                  <Link to="/contacts" className="mt-auto text-primary-600 text-sm font-medium hover:text-primary-800 flex items-center gap-1 transition-colors">
                    Записаться <ChevronRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <h2 className="section-title">Наша клиника</h2>
            <p className="section-subtitle">Современный интерьер, комфорт и профессиональное оборудование</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((n, i) => (
              <motion.div
                key={n}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`overflow-hidden rounded-xl bg-slate-100 ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
              >
                <img
                  src={`/images/clinic/clinic-${String(n).padStart(2, '0')}.jpg`}
                  alt={`Клиника ДенталстоМед — фото ${n}`}
                  className={`w-full object-cover ${i === 0 ? 'h-56 sm:h-72 md:h-96' : 'h-36 sm:h-44'} hover:scale-105 transition-transform duration-500`}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-8">
            <Link to="/gallery" className="btn-outline">
              Смотреть всю галерею <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Reviews — Яндекс виджет */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <h2 className="section-title">Отзывы пациентов</h2>
            <p className="section-subtitle">Что говорят о нас пациенты на Яндекс Картах</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-stretch">

            {/* Левый блок — рейтинг */}
            <motion.div {...fadeUp} className="lg:col-span-2 card p-8 flex flex-col justify-between gap-6">
              <div>
                {/* Яндекс лого */}
                <div className="flex items-center gap-2 mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#FC3F1D"/>
                    <path d="M13.32 7.17h-.82c-1.33 0-2.03.64-2.03 1.59 0 1.07.46 1.61 1.46 2.28l.81.54-2.34 3.47H8.9l2.12-3.14c-1.2-.86-1.88-1.7-1.88-3.08C9.14 6.77 10.3 6 12.46 6H15v9.05h-1.68V7.17z" fill="white"/>
                  </svg>
                  <span className="text-slate-500 text-sm font-medium">Яндекс Карты</span>
                </div>

                {/* Рейтинг */}
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-7xl font-bold text-slate-800 leading-none">5.0</span>
                  <div className="pb-2">
                    <div className="flex gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-400 text-sm">из 5 возможных</p>
                  </div>
                </div>

                <p className="text-slate-500 text-sm mb-6">
                  На основе <span className="font-semibold text-slate-700">320+ отзывов</span> и <span className="font-semibold text-slate-700">426 оценок</span>
                </p>

                {/* Шкалы */}
                {[5, 4, 3, 2, 1].map((stars, i) => (
                  <div key={stars} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-slate-400 w-4 text-right">{stars}</span>
                    <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: ['92%', '5%', '1%', '1%', '1%'][i] }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://yandex.com/maps/org/dentalstomed/159190759541/reviews/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center text-center"
              >
                Все отзывы на Яндексе
              </a>
            </motion.div>

            {/* Правый блок — виджет */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 rounded-2xl overflow-hidden shadow-sm border border-slate-200"
            >
              <iframe
                src="https://yandex.ru/maps-reviews-widget/159190759541?comments"
                title="Отзывы о клинике ДенталстоМед"
                width="100%"
                height="100%"
                className="border-0 block min-h-[480px]"
                allowFullScreen
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-700 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Запишитесь на бесплатную консультацию
            </h2>
            <p className="text-primary-200 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Осмотр и составление плана лечения — бесплатно. Позвоните или оставьте заявку онлайн.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 justify-center">
              <Link
                to="/contacts"
                className="bg-white text-primary-800 hover:bg-primary-50 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg inline-flex items-center justify-center gap-2"
              >
                Онлайн-запись
              </Link>
              <a
                href="tel:+74959241917"
                className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                +7 (495) 924-19-17
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
