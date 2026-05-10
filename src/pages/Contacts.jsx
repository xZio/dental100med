import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../api/index.js';
import { useSEO } from '../hooks/useSEO.js';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

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
    if (!/^[а-яёА-ЯЁa-zA-Z\s\-]+$/.test(v)) return 'Только буквы, пробелы и дефис';
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
      <label className="block text-sm font-medium text-slate-700 mb-1">
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
  const base = 'w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition';
  if (!touched) return `${base} border-slate-200 focus:ring-primary-300`;
  if (error) return `${base} border-red-400 focus:ring-red-200 bg-red-50`;
  return `${base} border-emerald-400 focus:ring-emerald-200`;
}

export default function Contacts() {
  useSEO({
    title: 'Контакты и запись',
    description: 'Стоматология ДенталстоМед в Подольске. Адрес: пр. Юных Ленинцев, 82В, ТЦ Максимум. Запись онлайн или по телефону.',
  });

  const [form, setForm] = useState({ name: '', phone: '+7', message: '' });
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

  // Запрещаем вводить не-цифры после +7
  const handlePhoneKeyDown = (e) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleNameChange = (e) => {
    // Запрещаем цифры и большинство спецсимволов прямо при вводе
    const value = e.target.value.replace(/[^а-яёА-ЯЁa-zA-Z\s\-]/g, '');
    setForm((f) => ({ ...f, name: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAll();
    if (!isValid) return;
    setLoading(true);
    try {
      await api.sendAppointment({
        name: form.name,
        phone: form.phone,
        message: form.message,
      });
      setSent(true);
    } catch {
      alert('Не удалось отправить заявку. Попробуйте позвонить нам напрямую.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setForm({ name: '', phone: '+7', message: '' });
    setTouched({ name: false, phone: false, message: false });
  };

  return (
    <>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-primary-300 text-sm font-medium mb-2">Мы рядом</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Контакты</h1>
            <p className="text-primary-200 text-base sm:text-lg max-w-lg">
              Запишитесь онлайн или позвоните — ответим быстро.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Form */}
            <motion.div {...fadeUp} className="card p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Онлайн-запись</h2>

              {sent ? (
                <div className="flex flex-col items-center text-center py-8 gap-3">
                  <CheckCircle size={48} className="text-emerald-500" />
                  <h3 className="text-xl font-bold text-slate-800">Заявка отправлена!</h3>
                  <p className="text-slate-500 text-sm">
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
                    <p className={`text-xs mt-1 text-right ${form.message.length > 450 ? 'text-orange-500' : 'text-slate-400'}`}>
                      {form.message.length} / 500
                    </p>
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Отправляем...' : (
                      <>
                        <Send size={17} />
                        Записаться на приём
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-400 text-center">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  </p>
                </form>
              )}
            </motion.div>

            {/* Info */}
            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }} className="flex flex-col gap-5">
              <div className="card p-6">
                <h3 className="font-bold text-slate-800 mb-4">Как нас найти</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>г. Подольск, пр. Юных Ленинцев, д. 82В, ТЦ Максимум, 2 этаж</span>
                  </div>
                  <a href="tel:+74959241917" className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary-700 transition-colors">
                    <Phone size={18} className="text-primary-600 flex-shrink-0" />
                    +7 (495) 924-19-17
                  </a>
                  <a href="mailto:dental100med@yandex.ru" className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary-700 transition-colors">
                    <Mail size={18} className="text-primary-600 flex-shrink-0" />
                    dental100med@yandex.ru
                  </a>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-primary-600" />
                  Режим работы
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex justify-between"><span>Понедельник – Пятница</span><span className="font-medium">9:00 – 21:00</span></li>
                  <li className="flex justify-between"><span>Суббота</span><span className="font-medium">9:00 – 19:00</span></li>
                  <li className="flex justify-between"><span>Воскресенье</span><span className="font-medium">10:00 – 17:00</span></li>
                </ul>
              </div>

              <div className="card overflow-hidden h-64 p-0">
                <iframe
                  title="Карта клиники ДенталстоМед"
                  src="https://yandex.ru/map-widget/v1/?ll=37.567411%2C55.484551&z=17&ol=biz&oid=159190759541"
                  width="100%"
                  height="100%"
                  className="border-0 w-full h-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <a
                href="https://yandex.ru/maps/?text=Подольск+проспект+Юных+Ленинцев+82В"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 text-sm hover:underline flex items-center gap-1"
              >
                <MapPin size={14} />
                Открыть в Яндекс Картах
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
