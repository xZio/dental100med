import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO.js';

export default function NotFound() {
  useSEO({ title: 'Страница не найдена', description: 'Такой страницы на сайте нет.', noindex: true });

  return (
    <div className="page-shell">
      <section className="panel-blue page-hero flex min-h-screen flex-col justify-center">
        <span className="eyebrow">Ошибка 404</span>
        <h1>Страница не найдена</h1>
        <p className="max-w-md">Возможно, её перенесли или удалили. Вернитесь на главную — там всё на месте.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="button button-light">На главную <ArrowUpRight /></Link>
          <Link to="/contacts" className="text-button !text-white">Записаться на приём <ArrowUpRight /></Link>
        </div>
      </section>
    </div>
  );
}
