import { Component } from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Без этой обёртки любая ошибка при отрисовке (например, функция, которой нет
 * в старом Safari) снимает всё приложение — посетитель видит белый экран.
 * С ней падает только страница, а шапка с телефоном и подвал остаются.
 */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <section className="panel-blue page-hero flex min-h-[70vh] flex-col justify-center">
        <span className="eyebrow">Ошибка</span>
        <h1>Страница не открылась</h1>
        <p className="max-w-md">Попробуйте обновить страницу. Записаться на приём можно по телефону.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="tel:+74959241917" className="button button-light">+7 (495) 924-19-17 <ArrowUpRight /></a>
        </div>
      </section>
    );
  }
}
