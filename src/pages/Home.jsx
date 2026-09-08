import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Clock, MapPin, Smile } from 'lucide-react';
import { api } from '../api/index.js';
import { framingStyle } from '../lib/framing.js';
import { plural } from '../lib/plural.js';
import { groupByCategory } from '../lib/categories.js';
import { reviewsSummary } from '../data/reviews.js';
import ServiceIcon from '../components/ServiceIcon.jsx';
import ToothIcon from '../components/ToothIcon.jsx';
import Reviews from '../components/Reviews.jsx';
import { reachGoal } from '../components/Metrika.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { useSEO } from '../hooks/useSEO.js';

/** Печать «С заботой о вас · с 2008 года» — текст по кругу, как на макете. */
function Seal() {
  return (
    <Link className="hero-seal" to="/about" aria-label="Семейная стоматология с 2008 года">
      <svg className="seal-text" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="circle-text" d="M60,60m-45,0a45,45 0 1,1 90,0a45,45 0 1,1-90,0" />
        </defs>
        <text>
          <textPath href="#circle-text" textLength="279">С ЗАБОТОЙ О ВАС · С 2008 ГОДА · </textPath>
        </text>
      </svg>
      <Smile className="seal-smile" strokeWidth={1.2} />
    </Link>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-label="ДенталстоМед">
      <div className="hero-intro">
        <span className="eyebrow"><i className="status-dot" /> Стоматология в Подольске</span>
        <p>Здоровье вашей улыбки.<br /><strong>С заботой о вас и ваших близких.</strong></p>
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
        <div className="hero-note hero-note-left">
          <span className="mini-line" />
          <p>Большая забота<br />о каждой улыбке</p>
          <span className="tiny">ДЛЯ ВЗРОСЛЫХ И ДЕТЕЙ</span>
        </div>
        <Seal />
        <span className="floating-pearl pearl-one" aria-hidden="true" />
        <span className="floating-pearl pearl-two" aria-hidden="true" />
        <div className="hero-floor" aria-hidden="true" />
      </div>

      <div className="hero-bottom">
        <div className="hero-bottom-copy">
          <p>Здесь начинается ваша<br /> здоровая и красивая улыбка.</p>
          <span>От первого знакомства до результата</span>
        </div>
        <Link className="button button-light hero-cta" to="/contacts">
          Записаться на приём <ArrowUpRight />
        </Link>
        <span aria-hidden="true" />
      </div>
    </section>
  );
}

function TrustStrip({ rating }) {
  return (
    <div className="trust-strip">
      <span><ToothIcon strokeWidth={1.8} /> Для всей семьи</span>
      <span><Check strokeWidth={1.8} /> План лечения без сюрпризов</span>
      <span><Clock strokeWidth={1.8} /> Приём по записи</span>
      <a href={reviewsSummary.url} target="_blank" rel="noopener noreferrer">
        <b className="yandex-mark">Я</b> {rating}{' '}
        <span className="stars" aria-label="5 из 5">★★★★★</span>{' '}
        <span className="rating-label">на Яндекс Картах</span> ↗
      </a>
    </div>
  );
}

function ServicesSection({ categories }) {
  return (
    <section className="services section-pad" id="services">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Забота в деталях</span>
          <h2>Для здоровья.<br /><span className="soft-text">Для красоты. Для вас.</span></h2>
        </div>
        <p>Всё, что нужно вашей улыбке,<br />в одной клинике. Найдём решение<br />и объясним каждый шаг.</p>
      </div>

      <div className="service-grid">
        {categories.length === 0 && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="service-card animate-pulse opacity-60" />
        ))}
        {categories.map((cat) => (
          <Link key={cat.id} to={`/services#${cat.id}`} className="service-card">
            <div className="service-top">
              <ServiceIcon slug={cat.slug} icon={cat.icon} size={76} className="text-[#c9f3f8]" />
            </div>
            <h3>{cat.label}</h3>
            <div className="service-bottom">
              <span className="circle"><ArrowUpRight /></span>
            </div>
          </Link>
        ))}
      </div>

      <div className="services-bottom">
        <p>Начните со знакомства — подберём подходящего специалиста.</p>
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
          src="/images/clinic/clinic-01.jpg"
          alt="Врач клиники ДенталстоМед с маленькой пациенткой после приёма"
          loading="lazy"
          width="590"
          height="700"
        />
        <div className="photo-caption">
          <span>Там, где вам рады</span>
          <Smile strokeWidth={1.6} />
        </div>
        <span className="photo-sticker">Забота,<br />которую чувствуешь ♡</span>
      </div>

      <div className="about-copy">
        <span className="eyebrow">Давайте знакомиться</span>
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
        <p>Опыт, внимание и любовь<br />к своему делу.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.slice(0, 3).map((doc) => (
          <Link key={doc._id} to="/doctors" className="card flex items-start gap-4 p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#cce9f2]">
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
        <p>Сделайте первый шаг. А мы позаботимся<br />о том, чтобы он был комфортным.</p>
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
  useSEO({
    title: 'Стоматология в Подольске',
    description: 'Семейная стоматологическая клиника ДенталстоМед в Подольске. Лечение, имплантация, ортодонтия. Запись онлайн.',
  });

  const { data: services } = useFetch(api.getServices);
  const { data: categories } = useFetch(api.getCategories);
  const { data: doctors } = useFetch(api.getDoctors);
  const { data: rating } = useFetch(api.getRating);

  const serviceCategories = groupByCategory(services, categories);
  // На главной — только врачи; ассистент и администратор есть на странице команды
  const physicians = (doctors ?? []).filter((d) => /^врач/i.test(d.specialty));

  return (
    <>
      <Hero />
      <TrustStrip rating={rating?.rating ?? reviewsSummary.rating} />
      <ServicesSection categories={serviceCategories} />
      <AboutPanel doctorsCount={physicians.length || 7} />
      {physicians.length > 0 && <DoctorsPreview doctors={physicians} />}
      <Reviews />
      <ContactPanel />
    </>
  );
}
