import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Metrika from './components/Metrika';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

// Админка грузится отдельным чанком — посетителям сайта её код не нужен
const AdminLayout       = lazy(() => import('./layouts/AdminLayout'));
const Login             = lazy(() => import('./pages/admin/Login'));
const AdminServices     = lazy(() => import('./pages/admin/AdminServices'));
const AdminDoctors      = lazy(() => import('./pages/admin/AdminDoctors'));
const AdminPromotions   = lazy(() => import('./pages/admin/AdminPromotions'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
const AdminGallery      = lazy(() => import('./pages/admin/AdminGallery'));

const adminFallback = <div className="p-8 text-sm text-gray-500">Загрузка…</div>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Metrika />
        <Suspense fallback={adminFallback}>
          <Routes>
            {/* Публичный сайт */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>

            {/* Админка */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
            >
              {/* Дашборда нет: админ попадает в услуги, приёмная — в заявки (adminOnly перенаправит) */}
              <Route index element={<ProtectedRoute adminOnly><Navigate to="/admin/services" replace /></ProtectedRoute>} />
              <Route path="services"     element={<ProtectedRoute adminOnly><AdminServices /></ProtectedRoute>} />
              <Route path="doctors"      element={<ProtectedRoute adminOnly><AdminDoctors /></ProtectedRoute>} />
              <Route path="promotions"   element={<ProtectedRoute adminOnly><AdminPromotions /></ProtectedRoute>} />
              <Route path="gallery"      element={<ProtectedRoute adminOnly><AdminGallery /></ProtectedRoute>} />
              <Route path="appointments" element={<AdminAppointments />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
