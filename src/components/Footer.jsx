import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <div className="inline-block bg-white rounded-xl px-3 py-2">
                <img
                  src="/images/logo.png"
                  alt="ДенталстоМед"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <p className="text-slate-400 text-xs mt-2">Стоматология в Подольске</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Современная семейная стоматологическая клиника. Лечим с заботой о каждом пациенте.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Главная' },
                { to: '/services', label: 'Услуги и цены' },
                { to: '/doctors', label: 'Врачи' },
                { to: '/gallery', label: 'Галерея' },
                { to: '/about', label: 'О клинике' },
                { to: '/contacts', label: 'Контакты' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary-400" />
                г. Подольск, пр. Юных Ленинцев, д. 82В, ТЦ Максимум, 2 этаж
              </li>
              <li>
                <a href="tel:+74959241917" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <Phone size={16} className="flex-shrink-0 text-primary-400" />
                  +7 (495) 924-19-17
                </a>
              </li>
              <li>
                <a href="mailto:dental100med@yandex.ru" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <Mail size={16} className="flex-shrink-0 text-primary-400" />
                  dental100med@yandex.ru
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Режим работы</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Clock size={15} className="text-primary-400" />
                Пн–Пт: 9:00 – 21:00
              </li>
              <li className="flex items-center gap-2">
                <Clock size={15} className="text-primary-400" />
                Сб: 9:00 – 19:00
              </li>
              <li className="flex items-center gap-2">
                <Clock size={15} className="text-primary-400" />
                Вс: 10:00 – 17:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2025 Dental100. Все права защищены.</p>
          <p className="text-xs text-slate-500">Лицензия №ЛО-50-01-012345</p>
        </div>
      </div>
    </footer>
  );
}
