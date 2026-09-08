import { api } from '../api/index.js';
import { framingStyle } from '../lib/framing.js';
import { useFetch } from '../hooks/useFetch.js';
import { SkeletonCard, ErrorMessage } from '../components/Skeleton.jsx';
import { useSEO } from '../hooks/useSEO.js';

const pad2 = (n) => String(n).padStart(2, '0');

export default function Doctors() {
  useSEO({
    title: 'Наши врачи',
    description: 'Врачи стоматологии ДенталстоМед в Подольске: терапевты, ортопеды, ортодонт, стоматолог общей практики.',
  });

  const { data: doctors, loading, error } = useFetch(api.getDoctors);

  return (
    <>
      <section className="panel-blue page-hero">
        <span className="eyebrow">03 / В надёжных руках</span>
        <h1>Люди, которым<br />доверяют улыбки.</h1>
        <p>Опыт, внимание и любовь к своему делу. Знакомьтесь с командой клиники.</p>
      </section>

      <section className="section-pad">
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {doctors && (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doc, i) => {
              const [surname, ...given] = doc.name.split(' ');
              return (
                <article key={doc._id} className="doctor-card !flex-none">
                  <div className="doctor-portrait">
                    <span className="doctor-number">{pad2(i + 1)} /</span>
                    {doc.photo && <img src={doc.photo} alt={doc.name} loading="lazy" style={framingStyle(doc)} />}
                  </div>
                  <h2 className="mt-5 text-xl font-semibold leading-tight tracking-tight text-ink">
                    {surname}<span className="block">{given.join(' ')}</span>
                  </h2>
                  <p className="mt-2 text-[13px] font-medium text-blue">{doc.specialty}</p>
                  {doc.experience && <p className="mt-1 text-xs text-muted">{doc.experience}</p>}
                  {doc.description && <p className="mt-3 text-sm leading-relaxed text-[#3d6a83]">{doc.description}</p>}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
