import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminGallery from './pages/admin/AdminGallery';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Metrika />
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
            <Route index element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="services"     element={<ProtectedRoute adminOnly><AdminServices /></ProtectedRoute>} />
            <Route path="doctors"      element={<ProtectedRoute adminOnly><AdminDoctors /></ProtectedRoute>} />
            <Route path="promotions"   element={<ProtectedRoute adminOnly><AdminPromotions /></ProtectedRoute>} />
            <Route path="gallery"      element={<ProtectedRoute adminOnly><AdminGallery /></ProtectedRoute>} />
            <Route path="appointments" element={<AdminAppointments />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
