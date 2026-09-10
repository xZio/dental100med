import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

/**
 * Каркас сайта: скруглённые панели на ледяном фоне, шапка лежит поверх
 * первой панели каждой страницы (абсолютно), поэтому панель сама оставляет
 * под неё место — см. .hero и .page-hero.
 */
export default function MainLayout() {
  return (
    <div className="page-shell">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
