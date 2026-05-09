import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contacts from './pages/Contacts';

import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminAppointments from './pages/admin/AdminAppointments';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Публичный сайт */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
          </Route>

          {/* Админка */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
          >
            <Route index element={<Dashboard />} />
            <Route path="services"     element={<AdminServices />} />
            <Route path="doctors"      element={<AdminDoctors />} />
            <Route path="promotions"   element={<AdminPromotions />} />
            <Route path="appointments" element={<AdminAppointments />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
