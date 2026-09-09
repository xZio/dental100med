import { api } from '../api/index.js';
import { framingStyle } from '../lib/framing.js';
import { useFetch } from '../hooks/useFetch.js';
import { SkeletonCard, ErrorMessage } from '../components/Skeleton.jsx';
import { useSEO } from '../hooks/useSEO.js';

export default function Doctors() {
  useSEO({
    title: 'Наши врачи',
    description: 'Врачи стоматологии ДенталстоМед в Подольске: терапевты, ортопеды, ортодонт, стоматолог общей практики.',
  });

  const { data: doctors, loading, error } = useFetch(api.getDoctors);

  return (
    <>
      <section className="panel-blue page-hero page-hero-split">
        <div>
          <span className="eyebrow">В надёжных руках</span>
          <h1>Люди, которым<br />доверяют улыбки.</h1>
          <p>Опыт, внимание и любовь к своему делу. Знакомьтесь с командой клиники.</p>
        </div>
        <img className="page-hero-tooth" src="/images/teeth/tooth-happy.webp" alt="" aria-hidden="true" width="600" height="600" />
      </section>

      <section className="section-pad">
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {doctors && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doc) => (
              <article key={doc._id} className="card p-6">
                <div className="mb-4 h-24 w-24 overflow-hidden rounded-2xl bg-[#cce9f2]">
                  {doc.photo && (
                    <img src={doc.photo} alt={doc.name} className="h-full w-full object-cover" style={framingStyle(doc)} loading="lazy" />
                  )}
                </div>
                <h2 className="text-lg font-semibold leading-snug tracking-tight text-ink">{doc.name}</h2>
                <p className="mt-1 text-sm font-medium text-blue">{doc.specialty}</p>
                {doc.experience && <p className="mt-1 text-xs text-muted">{doc.experience}</p>}
                {doc.description && <p className="mt-3 text-sm leading-relaxed text-[#3d6a83]">{doc.description}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
