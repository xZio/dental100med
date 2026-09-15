import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * Каркас сайта: скруглённые панели на ледяном фоне, шапка лежит поверх
 * первой панели каждой страницы (абсолютно), поэтому панель сама оставляет
 * под неё место — см. .hero и .page-hero.
 */
export default function MainLayout() {
  // key — чтобы после ошибки переход на другую страницу снова её отрисовал
  const { pathname } = useLocation();

  return (
    <div className="page-shell">
      <ScrollToTop />
      <Navbar />
      <main>
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
