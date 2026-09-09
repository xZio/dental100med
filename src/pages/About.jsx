import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { useSEO } from '../hooks/useSEO.js';
import YandexRating from '../components/YandexRating.jsx';
import { legal } from '../data/legal.js';
import { plural } from '../lib/plural.js';

/**
 * Страница «О клинике». Факты только проверяемые: год основания, состав
 * команды из базы, лицензия со скана. Никаких выдуманных вех.
 */
export default function About() {
  useSEO({
    title: 'О клинике',
    description: 'ДенталстоМед — семейная стоматология в Подольске с 2008 года. Команда, принципы, лицензия.',
  });

  const { data: doctors } = useFetch(api.getDoctors);
  const physicians = (doctors ?? []).filter((d) => /^врач/i.test(d.specialty)).length || 7;

  return (
    <>
      <section className="panel-blue page-hero page-hero-split">
        <div>
          <span className="eyebrow">Давайте знакомиться</span>
          <h1>Хорошая стоматология<br />начинается<br /><span className="handwritten">с доверия.</span></h1>
          <p>С 2008 года помогаем жителям Подольска сохранять здоровье и красоту улыбки.</p>
        </div>
        <YandexRating className="page-hero-badge" />
      </section>

      <section className="section-pad">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[15px] leading-[1.8] text-[#3d6a83]">
              Мы — ДенталстоМед. Семейная клиника в Подольске, где за каждой улыбкой видят человека: его историю, переживания и ожидания.
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-[#3d6a83]">
              Наш принцип — лечить только то, что нужно. Внимательно выслушаем, понятно расскажем о лечении и вместе выберем подходящий путь. Честный диагноз, прозрачный план лечения и понятные цены.
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-[#3d6a83]">
              Принимаем взрослых и детей — чтобы приходить к стоматологу было спокойно всей семьёй.
            </p>
            <Link to="/doctors" className="text-button mt-8">Познакомиться с командой <ArrowUpRight /></Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'с 2008', label: 'заботимся об улыбках' },
              { value: `${physicians} ${plural(physicians, ['врач', 'врача', 'врачей'])}`, label: 'одна команда' },
              { value: 'Вся семья', label: 'взрослые и дети' },
              { value: 'Лицензия', label: `№ ${legal.license.number}` },
            ].map(({ value, label }) => (
              <div key={label} className="card p-6">
                <p className="text-2xl font-semibold tracking-tight text-ink">{value}</p>
                <p className="mt-1.5 text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about mt-14 !gap-10 px-8 py-10 md:px-14">
          <div className="about-visual">
            <img src="/images/clinic/interior-02.webp" alt="Лечебный кабинет клиники ДенталстоМед" loading="lazy" width="590" height="700" />
          </div>
          <div className="about-copy">
            <span className="eyebrow">Юридическая информация</span>
            <h2 className="!text-[28px]">{legal.fullName}</h2>
            <p>ИНН {legal.inn} · ОГРН {legal.ogrn}</p>
            <p>{legal.address}</p>
            <p>
              Лицензия на медицинскую деятельность № {legal.license.number} от {legal.license.date}, {legal.license.term}.
              Лицензирующий орган — {legal.license.issuer}.
            </p>
            <Link className="text-button" to="/contacts">Записаться на приём <ArrowUpRight /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
