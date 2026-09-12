import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { api } from '../../api/index.js';
import Modal from '../../components/admin/Modal';
import DeleteButton from '../../components/admin/DeleteButton';
import PromoSeal from '../../components/PromoSeal.jsx';
import { ErrorNote, Label, PageTitle, Row, SaveButton, field } from '../../components/admin/ui.jsx';
import { PROMO_COLORS, PROMO_COLOR_KEYS, PROMO_MAX, promoLinks, promoTopLines } from '../../lib/promo.js';

/** Пустая акция: цвет и ссылка сразу заполнены, чтобы не выбирать их каждый раз. */
const blank = () => ({
  _id: '',
  title: '',
  discount: '',
  cta: 'Записаться',
  link: '/contacts',
  color: 'cyan',
  description: '',
  active: true,
  expiresAt: '',
});

const toDateInput = (iso) => (iso ? iso.slice(0, 10) : '');

function PromoForm({ promo, links, onDone }) {
  const lines = promoTopLines(promo.title);
  const [values, setValues] = useState({ ...promo, line1: lines[0] ?? '', line2: lines[1] ?? '' });
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }));
  const id = promo._id || 'new';

  const save = async () => {
    setPending(true);
    setError(null);
    try {
      const data = {
        title: [values.line1, values.line2].filter(Boolean).join('\n'),
        discount: values.discount,
        cta: values.cta,
        link: values.link,
        color: values.color,
        description: values.description,
        active: values.active,
        expiresAt: values.expiresAt || null,
      };
      if (!data.title.trim()) throw new Error('Заполните верхнюю строку');
      if (values._id) await adminApi.updatePromotion(values._id, data);
      else await adminApi.createPromotion(data);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    try {
      await adminApi.deletePromotion(values._id);
      onDone();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-5 sm:grid-cols-[190px_1fr] sm:items-start">
        {/* Тот же круг, что на главной: сразу видно, влезает ли текст */}
        <div className="flex justify-center rounded-2xl bg-gray-50 p-4 sm:justify-start">
          <PromoSeal
            preview
            promo={{
              title: [values.line1, values.line2].filter(Boolean).join('\n'),
              discount: values.discount || '—',
              cta: values.cta || '…',
              color: values.color,
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`line1-${id}`}>Верхняя строка</Label>
              <input id={`line1-${id}`} value={values.line1} onChange={(e) => set('line1', e.target.value)}
                     maxLength={24} placeholder="Консультация" className={field} />
            </div>
            <div>
              <Label htmlFor={`line2-${id}`}>Вторая строка</Label>
              <input id={`line2-${id}`} value={values.line2} onChange={(e) => set('line2', e.target.value)}
                     maxLength={24} placeholder="всех врачей" className={field} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`big-${id}`}>Крупная строка</Label>
              <input id={`big-${id}`} value={values.discount} onChange={(e) => set('discount', e.target.value)}
                     maxLength={20} placeholder="бесплатно" className={field} />
            </div>
            <div>
              <Label htmlFor={`cta-${id}`}>Подпись внизу</Label>
              <input id={`cta-${id}`} value={values.cta} onChange={(e) => set('cta', e.target.value)}
                     maxLength={24} placeholder="Записаться" className={field} />
            </div>
          </div>

          <div>
            <Label htmlFor={`link-${id}`}>Куда ведёт</Label>
            <select id={`link-${id}`} value={values.link} onChange={(e) => set('link', e.target.value)} className={field}>
              {links.some((l) => l.href === values.link)
                ? null
                : <option value={values.link}>{values.link}</option>}
              {links.map((link) => <option key={link.href} value={link.href}>{link.label}</option>)}
            </select>
          </div>

          <div>
            <Label htmlFor={`color-${id}`}>Цвет</Label>
            <div id={`color-${id}`} className="flex flex-wrap gap-2">
              {PROMO_COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('color', key)}
                  aria-pressed={values.color === key}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-bold transition-colors ${
                    values.color === key ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-teal-400'
                  }`}
                >
                  <span className={`h-3.5 w-3.5 rounded-full ${PROMO_COLORS[key].dot}`} aria-hidden />
                  {PROMO_COLORS[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Своё, чего у Денталии нет: акцию можно спрятать, не удаляя, и задать срок */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`until-${id}`}>Показывать до</Label>
              <input id={`until-${id}`} type="date" value={toDateInput(values.expiresAt)}
                     onChange={(e) => set('expiresAt', e.target.value)} className={field} />
            </div>
            <label className="flex cursor-pointer items-center gap-2 self-end pb-2.5">
              <input type="checkbox" checked={values.active} onChange={(e) => set('active', e.target.checked)}
                     className="h-4 w-4 accent-teal-600" />
              <span className="text-sm text-gray-700">Показывать на сайте</span>
            </label>
          </div>
        </div>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}

      <div className="flex items-center gap-2">
        <SaveButton onClick={save} pending={pending} />
        {values._id && <DeleteButton variant="icon" onConfirm={remove} label={`Удалить акцию: ${values.discount || values.line1}`} />}
      </div>
    </div>
  );
}

/**
 * Акции-печати на главной: до трёх штук. Порядок в списке = порядок на экране:
 * первая слева сверху, вторая справа, третья снизу. Если акций нет, hero просто
 * остаётся без печатей.
 */
export default function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [links, setLinks] = useState(promoLinks());
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [listError, setListError] = useState('');

  const load = () => adminApi.getPromotions()
    .then((data) => { setPromos(data); setListError(''); })
    .catch((err) => setListError(err.message))
    .finally(() => setLoading(false));

  useEffect(() => {
    load();
    // Разделы прайса тоже страницы сайта — акция может вести прямо в раздел
    api.getCategories().then((cats) => setLinks(promoLinks(cats))).catch(() => {});
  }, []);

  const done = () => {
    setAdding(false);
    load();
  };

  const activeCount = promos.filter((p) => p.active).length;

  if (loading) return <div className="text-sm text-gray-400">Загрузка...</div>;

  return (
    <>
      <PageTitle title="Акции" subtitle={`На сайте ${activeCount} из ${PROMO_MAX} · всего ${promos.length}`} />
      <p className="mb-4 max-w-[640px] text-[13px] leading-relaxed text-gray-500">
        Круглые печати поверх главной страницы. Порядок в списке — порядок на экране: первая слева сверху,
        вторая справа, третья снизу.
      </p>

      {listError && <div className="mb-4"><ErrorNote>{listError}</ErrorNote></div>}

      <div className="flex flex-col gap-3">
        {promos.map((promo) => (
          <Row
            key={promo._id}
            summary={
              <span className="flex items-center gap-3">
                <span className={`h-8 w-8 shrink-0 rounded-full ${PROMO_COLORS[promo.color]?.dot ?? PROMO_COLORS.cyan.dot}`} aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-gray-800">{promo.discount || '—'}</span>
                  <span className="block truncate text-[12px] text-gray-500">
                    {promoTopLines(promo.title).join(' ')}{promo.active ? '' : ' · скрыта'}
                  </span>
                </span>
              </span>
            }
          >
            <PromoForm promo={promo} links={links} onDone={done} />
          </Row>
        ))}

        {activeCount < PROMO_MAX ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white py-3.5 text-[13px] font-bold text-teal-600 transition-colors hover:border-teal-500"
          >
            <Plus size={16} />
            Добавить акцию
          </button>
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-300 px-4 py-3.5 text-center text-[13px] font-semibold text-gray-500">
            Больше {PROMO_MAX} акций на главную не помещается. Скройте или удалите одну, чтобы добавить новую.
          </p>
        )}
      </div>

      {adding && (
        <Modal title="Новая акция" onClose={() => setAdding(false)}>
          <PromoForm promo={blank()} links={links} onDone={done} />
        </Modal>
      )}
    </>
  );
}
