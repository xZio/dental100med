import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import Select from '../components/ui/Select.jsx';
import DatePicker from '../components/ui/DatePicker.jsx';
import ClinicMap from '../components/ClinicMap.jsx';
import { useSEO } from '../hooks/useSEO.js';
import { reachGoal } from '../components/Metrika.jsx';
import YandexRating from '../components/YandexRating.jsx';
import Reviews from '../components/Reviews.jsx';

// Форматирует строку в маску +7 (XXX) XXX-XX-XX
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  // Убираем ведущую 7 или 8
  const local = digits.startsWith('7') || digits.startsWith('8')
    ? digits.slice(1)
    : digits;
  const d = local.slice(0, 10);

  let out = '+7';
  if (d.length === 0) return out;
  out += ` (${d.slice(0, 3)}`;
  if (d.length < 3) return out;
  out += `) ${d.slice(3, 6)}`;
  if (d.length < 6) return out;
  out += `-${d.slice(6, 8)}`;
  if (d.length < 8) return out;
  out += `-${d.slice(8, 10)}`;
  return out;
}

function phoneDigitCount(value) {
  return value.replace(/\D/g, '').replace(/^[78]/, '').length;
}

// Правила валидации
const validators = {
  name: (v) => {
    if (!v.trim()) return 'Введите ваше имя';
    if (v.trim().length < 2) return 'Минимум 2 символа';
    if (!/^[а-яёА-ЯЁa-zA-Z\s-]+$/.test(v)) return 'Только буквы, пробелы и дефис';
    return '';
  },
  phone: (v) => {
    if (!v || v === '+7') return 'Введите номер телефона';
    if (phoneDigitCount(v) < 10) return 'Введите все 10 цифр номера';
    return '';
  },
  message: (v) => {
    if (v.length > 500) return 'Максимум 500 символов';
    return '';
  },
};

function Field({ label, required, error, touched, children }) {
  const showError = touched && error;
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[1.4px] text-muted">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {showError && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(touched, error) {
  const base = 'w-full rounded-[14px] border bg-white/90 px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition focus:outline-none focus:ring-2';
  if (!touched) return `${base} border-[#c9e3ee] focus:border-blue focus:ring-blue/25`;
  if (error) return `${base} border-red-400 focus:ring-red-200 bg-red-50`;
  return `${base} border-emerald-400 focus:ring-emerald-200`;
}

export default function Contacts() {
  useSEO({
    title: 'Контакты и запись',
    description: 'Стоматология ДенталстоМед в Подольске. Адрес: пр. Юных Ленинцев, 82В, ТЦ Максимум. Запись онлайн или по телефону.',
  });

  const { data: categories } = useFetch(api.getCategories);

  const [form, setForm] = useState({ name: '', phone: '+7', service: '', date: '', message: '' });
  const [touched, setTouched] = useState({ name: false, phone: false, message: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = {
    name: validators.name(form.name),
    phone: validators.phone(form.phone),
    message: validators.message(form.message),
  };

  const isValid = !errors.name && !errors.phone && !errors.message;

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));
  const touchAll = () => setTouched({ name: true, phone: true, message: true });

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    // Если пользователь удалил всё или стёр +7 — сбрасываем к базе
    if (raw.length < 2) {
      setForm((f) => ({ ...f, phone: '+7' }));
      return;
    }
    setForm((f) => ({ ...f, phone: formatPhone(raw) }));
  };

  // Запрещаем вводить не-цифры после +7. Сочетания с Ctrl/Cmd (вставка, выделение)
  // и Enter пропускаем — иначе номер нельзя вставить из буфера и отправить с клавиатуры
  const handlePhoneKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleNameChange = (e) => {
    // Запрещаем цифры и большинство спецсимволов прямо при вводе
    const value = e.target.value.replace(/[^а-яёА-ЯЁa-zA-Z\s-]/g, '');
    setForm((f) => ({ ...f, name: value }));
  };

  // В списке — разделы прайса, а не отдельные позиции: пациент выбирает
  // направление («Имплантация»), а не строку прайса («Имплантат Astra Tech»).
  // Порядок тот же, что на странице услуг.
  const serviceOptions = (categories ?? []).map((c) => ({ value: c.name, label: c.name }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAll();
    if (!isValid) return;
    setLoading(true);
    try {
      await api.sendAppointment({
        name: form.name,
        phone: form.phone,
        service: form.service,
        date: form.date,
        message: form.message,
      });
      setSent(true);
      reachGoal('lead');
    } catch {
      alert('Не удалось отправить заявку. Попробуйте позвонить нам напрямую.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setForm({ name: '', phone: '+7', service: '', date: '', message: '' });
    setTouched({ name: false, phone: false, message: false });
  };

  return (
    <>
      <section className="panel-blue page-hero page-hero-split">
        <div>
          <span className="eyebrow">До встречи в клинике</span>
          <h1>Ваша улыбка —<br /><span className="handwritten">наша забота.</span></h1>
          <p>Запишитесь онлайн или позвоните — ответим быстро.</p>
        </div>
        <YandexRating className="page-hero-badge" />
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">

            {/* Form */}
            <div className="card fade-up p-6 sm:p-8">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink">Онлайн-запись</h2>

              {sent ? (
                <div className="flex flex-col items-center text-center py-8 gap-3">
                  <CheckCircle size={48} className="text-emerald-500" />
                  <h3 className="text-xl font-semibold tracking-tight text-ink">Заявка отправлена!</h3>
                  <p className="text-sm text-muted">
                    Мы свяжемся с вами в течение 30 минут для подтверждения записи.
                  </p>
                  <button onClick={handleReset} className="btn-outline mt-2">
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                  {/* Имя */}
                  <Field
                    label="Ваше имя"
                    required
                    error={errors.name}
                    touched={touched.name}
                  >
                    <input
                      type="text"
                      placeholder="Иван Иванов"
                      value={form.name}
                      onChange={handleNameChange}
                      onBlur={() => touch('name')}
                      maxLength={60}
                      autoComplete="name"
                      className={inputClass(touched.name, errors.name)}
                    />
                  </Field>

                  {/* Телефон */}
                  <Field
                    label="Телефон"
                    required
                    error={errors.phone}
                    touched={touched.phone}
                  >
                    <input
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      onKeyDown={handlePhoneKeyDown}
                      onFocus={(e) => {
                        // Курсор в конец при фокусе
                        const len = e.target.value.length;
                        setTimeout(() => e.target.setSelectionRange(len, len), 0);
                      }}
                      onBlur={() => touch('phone')}
                      autoComplete="tel"
                      className={inputClass(touched.phone, errors.phone)}
                    />
                    {touched.phone && !errors.phone && (
                      <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={12} />
                        Номер введён верно
                      </p>
                    )}
                  </Field>

                  {/* Услуга и дата — необязательные: заявку принимаем и без них */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Услуга">
                      <Select
                        id="service"
                        value={form.service}
                        options={serviceOptions}
                        placeholder="Выберите услугу"
                        onChange={(value) => setForm((f) => ({ ...f, service: value }))}
                      />
                    </Field>

                    <Field label="Желаемая дата">
                      <DatePicker
                        id="date"
                        value={form.date}
                        onChange={(value) => setForm((f) => ({ ...f, date: value }))}
                      />
                    </Field>
                  </div>

                  {/* Сообщение */}
                  <Field
                    label="Что беспокоит?"
                    error={errors.message}
                    touched={touched.message}
                  >
                    <textarea
                      rows={4}
                      placeholder="Опишите кратко проблему или желаемую услугу..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      onBlur={() => touch('message')}
                      maxLength={500}
                      className={`${inputClass(touched.message, errors.message)} resize-none`}
                    />
                    <p className={`mt-1 text-right text-xs ${form.message.length > 450 ? 'text-orange-500' : 'text-muted'}`}>
                      {form.message.length} / 500
                    </p>
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    className="button button-blue w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Отправляем…' : 'Записаться на приём'} <ArrowUpRight />
                  </button>

                  <p className="text-center text-xs text-muted">
                    Нажимая кнопку, вы соглашаетесь на{' '}
                    <Link to="/privacy" className="underline transition-colors hover:text-blue">
                      обработку персональных данных
                    </Link>
                  </p>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="fade-up-delayed flex flex-col gap-5">
              <div className="card p-6">
                <h3 className="mb-4 font-semibold tracking-tight text-ink">Как нас найти</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-[#3d6a83]">
                    <MapPin size={18} className="mt-0.5 flex-shrink-0 text-blue" />
                    <span>г. Подольск, пр. Юных Ленинцев, д. 82В, ТЦ Максимум, 2 этаж</span>
                  </div>
                  <a href="tel:+74959241917"
              onClick={() => reachGoal('call')} className="flex items-center gap-3 text-sm text-[#3d6a83] transition-colors hover:text-ink">
                    <Phone size={18} className="flex-shrink-0 text-blue" />
                    +7 (495) 924-19-17
                  </a>
                  <a href="mailto:dental100med@yandex.ru" className="flex items-center gap-3 text-sm text-[#3d6a83] transition-colors hover:text-ink">
                    <Mail size={18} className="flex-shrink-0 text-blue" />
                    dental100med@yandex.ru
                  </a>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold tracking-tight text-ink">
                  <Clock size={18} className="text-blue" />
                  Режим работы
                </h3>
                <ul className="space-y-2 text-sm text-[#3d6a83]">
                  <li className="flex justify-between"><span>Понедельник — пятница</span><span className="font-medium">9:00–21:00</span></li>
                  <li className="flex justify-between"><span>Суббота</span><span className="font-medium">9:00–19:00</span></li>
                  <li className="flex justify-between"><span>Воскресенье</span><span className="font-medium">10:00–17:00</span></li>
                </ul>
              </div>

              <ClinicMap
                address="Подольск, пр-т Юных Ленинцев, 82В, ТЦ «Максимум», 2 этаж"
                className="h-64"
              />
              <a
                href="https://yandex.ru/maps/?text=Подольск+проспект+Юных+Ленинцев+82В"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue hover:underline"
              >
                <MapPin size={14} />
                Открыть в Яндекс Картах
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Те же отзывы, что на главной */}
      <Reviews />
    </>
  );
}
