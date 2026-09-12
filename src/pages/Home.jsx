import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { api } from '../api/index.js';
import { framingStyle } from '../lib/framing.js';
import { plural } from '../lib/plural.js';
import { groupByCategory } from '../lib/categories.js';
import ServiceIcon from '../components/ServiceIcon.jsx';
import PromoSeal from '../components/PromoSeal.jsx';
import Reviews from '../components/Reviews.jsx';
import YandexRating from '../components/YandexRating.jsx';
import { reachGoal } from '../components/Metrika.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { useSEO } from '../hooks/useSEO.js';

/**
 * Акции-печати в hero: до трёх круглых наклеек с сияющей аурой. Тексты, цвет и
 * ссылка — из админки, место и наклон задаёт порядок в списке. На десктопе
 * висят справа от заголовка, на телефоне — под кнопкой записи.
 */
function HeroPromos({ promos, compact = false }) {
  if (promos.length === 0) return null;
  return (
    <div className={compact ? 'hero-promos hero-promos-compact' : 'hero-promos'} aria-label="Акции">
      {promos.map((promo) => <PromoSeal key={promo._id} promo={promo} />)}
    </div>
  );
}

function Hero({ promos }) {
  return (
    <section className="hero" id="top" aria-label="ДенталстоМед">
      <div className="hero-intro">
        <span className="eyebrow"><i className="status-dot" /> Стоматология в Подольске</span>
      </div>

      <div className="hero-stage">
        <div className="hero-headline">
          <span className="handwritten">С любовью</span>
          <h1>К вашей<br /><span>улыбке.</span></h1>
        </div>
        <div className="hero-aura" aria-hidden="true" />
        <img
          className="hero-art"
          src="/images/hero-art.webp"
          alt="Объёмные белые зубы, голубой стакан со щёткой и бирюзовое сердечко"
          fetchPriority="high"
          width="1122"
          height="1402"
        />
        <span className="floating-pearl pearl-one" aria-hidden="true" />
        <span className="floating-pearl pearl-two" aria-hidden="true" />
        <div className="hero-floor" aria-hidden="true" />
        <HeroPromos promos={promos} />
        {/* Рейтинг Яндекса — слева под заголовком; на телефоне переезжает под кнопку */}
        <YandexRating className="hero-rating" />
      </div>

      <div className="hero-bottom">
        <div className="hero-bottom-copy">
          <p>Здесь начинается ваша<br /> здоровая и красивая улыбка.</p>
        </div>
        <Link className="button button-light hero-cta" to="/contacts">
          Записаться на приём <ArrowUpRight />
        </Link>
        <span aria-hidden="true" />
      </div>
      <HeroPromos promos={promos} compact />
      <div className="hero-rating-compact">
        <YandexRating />
      </div>
    </section>
  );
}

function ServicesSection({ categories }) {
  return (
    <section className="services section-pad" id="services">
      {/* Пятна палитры под стеклянными карточками — стеклу нужно что-то размывать */}
      <div className="glass-blobs services-blobs" aria-hidden="true">
        <span className="b1" /><span className="b2" /><span className="b3" />
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Забота в деталях</span>
          <h2>Для здоровья.<br /><span className="soft-text">Для красоты. Для вас.</span></h2>
        </div>
        {/* Пробел перед <br /> обязателен: на телефоне переносы прячутся, и слова слипаются */}
        <p>Всё, что нужно вашей улыбке, <br />в одной клинике. Найдём решение <br />и объясним каждый шаг.</p>
      </div>

      <div className="service-grid">
        {categories.length === 0 && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="service-card animate-pulse opacity-60" />
        ))}
        {categories.map((cat) => (
          <Link key={cat.id} to={`/services#${cat.id}`} className="service-card">
            <div className="service-top">
              <ServiceIcon slug={cat.slug} icon={cat.icon} size={96} className="text-[#c9f3f8]" />
            </div>
            <h3>{cat.label}</h3>
            <div className="service-bottom">
              <span className="circle"><ArrowUpRight /></span>
            </div>
          </Link>
        ))}
      </div>

      <div className="services-bottom">
        <Link to="/services" className="text-button">Все услуги и цены <ArrowUpRight /></Link>
      </div>
    </section>
  );
}

function AboutPanel({ doctorsCount }) {
  return (
    <section className="about section-pad" id="about">
      <div className="about-visual">
        <img
          src="/images/clinic/interior-reception.webp"
          alt="Ресепшн и зона ожидания клиники ДенталстоМед"
          loading="lazy"
          width="590"
          height="700"
        />
      </div>

      <div className="about-copy">
        <h2>Хорошая стоматология<br />начинается<br /><span className="handwritten">с доверия.</span></h2>
        <p>Мы — ДенталстоМед. Семейная клиника в Подольске, где за каждой улыбкой видят человека. Его историю, переживания и ожидания.</p>
        <p>Внимательно выслушаем, понятно расскажем о лечении и вместе выберем подходящий путь. Чтобы приходить к стоматологу было спокойно.</p>
        <div className="about-facts">
          <div><strong>с 2008</strong><span>заботимся об улыбках</span></div>
          <div><strong>{doctorsCount} {plural(doctorsCount, ['врач', 'врача', 'врачей'])}</strong><span>одна команда</span></div>
        </div>
        <Link className="text-button" to="/doctors">Познакомиться с командой <ArrowUpRight /></Link>
      </div>
    </section>
  );
}

/** Три врача карточками, как было раньше; полный состав — на странице команды. */
function DoctorsPreview({ doctors }) {
  return (
    <section className="doctors section-pad" id="doctors">
      <div className="section-heading">
        <div>
          <span className="eyebrow">В надёжных руках</span>
          <h2>Люди, которым<br /><span className="soft-text">доверяют улыбки.</span></h2>
        </div>
        <p>Опыт, внимание и любовь <br />к своему делу.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.slice(0, 3).map((doc) => (
          <Link key={doc._id} to="/doctors" className="card flex items-start gap-4 p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-[#cce9f2]">
              {doc.photo && <img src={doc.photo} alt={doc.name} className="h-full w-full object-cover" style={framingStyle(doc)} loading="lazy" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-ink">{doc.name}</h3>
              <p className="mt-1 text-[13px] font-medium text-blue">{doc.specialty}</p>
              {doc.experience && <p className="mt-1 text-xs text-muted">{doc.experience}</p>}
            </div>
          </Link>
        ))}
      </div>

      <div className="doctors-bottom">
        <span>Полный состав команды — на странице врачей.</span>
        <Link to="/doctors" className="text-button !text-[11px]">Все врачи <ArrowUpRight /></Link>
      </div>
    </section>
  );
}

function ContactPanel() {
  return (
    <section className="contact section-pad" id="contacts">
      <div className="contact-title">
        <span className="eyebrow">До встречи в клинике</span>
        <h2>Ваша улыбка —<br /><span className="handwritten">наша забота.</span></h2>
        <p>Сделайте первый шаг. А мы позаботимся <br />о том, чтобы он был комфортным.</p>
        <Link className="button button-light" to="/contacts">Записаться на приём <ArrowUpRight /></Link>
      </div>
      <div className="contact-details">
        <a className="contact-phone" href="tel:+74959241917" onClick={() => reachGoal('call')}>
          +7 (495) 924-19-17 <ArrowUpRight size={24} />
        </a>
        <a className="contact-email" href="mailto:dental100med@yandex.ru">dental100med@yandex.ru</a>
        <div className="contact-address">
          <MapPin />
          <div>
            <h3>Подольск, пр. Юных Ленинцев, 82В</h3>
            <p>ТЦ «Максимум», 2 этаж</p>
            <a href="https://yandex.ru/maps/org/dentalstomed/159190759541/" target="_blank" rel="noopener noreferrer">Построить маршрут ↗</a>
          </div>
        </div>
        <div className="contact-hours">
          <Clock />
          <div>
            <div><span>Понедельник — пятница</span><b>9:00–21:00</b></div>
            <div><span>Суббота</span><b>9:00–19:00</b></div>
            <div><span>Воскресенье</span><b>10:00–17:00</b></div>
          </div>
        </div>
      </div>
      <span className="contact-decoration" aria-hidden="true">♡</span>
    </section>
  );
}

export default function Home() {
  // Без title: имя сайта уже «ДенталстоМед — стоматология в Подольске», иначе фраза удваивается
  useSEO({
    description: 'Семейная стоматологическая клиника ДенталстоМед в Подольске. Лечение, имплантация, ортодонтия. Запись онлайн.',
  });

  const { data: services } = useFetch(api.getServices);
  const { data: categories } = useFetch(api.getCategories);
  const { data: doctors } = useFetch(api.getDoctors);
  const { data: promotions } = useFetch(api.getPromotions);

  const serviceCategories = groupByCategory(services, categories);
  // На главной — только врачи; ассистент и администратор есть на странице команды
  const physicians = (doctors ?? []).filter((d) => /^врач/i.test(d.specialty));
  // Печатей в hero не больше трёх — сервер тоже режет, но на всякий случай
  const promos = (promotions ?? []).slice(0, 3);

  return (
    <>
      <Hero promos={promos} />
      <ServicesSection categories={serviceCategories} />
      <AboutPanel doctorsCount={physicians.length || 7} />
      {physicians.length > 0 && <DoctorsPreview doctors={physicians} />}
      <Reviews />
      <ContactPanel />
    </>
  );
}
