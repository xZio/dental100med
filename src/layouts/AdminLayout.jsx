import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Stethoscope, UserRound, Tag, CalendarClock,
  LogOut, Menu, X, ChevronRight,
} from 'lucide-react';

const NAV = [
  { to: '/admin',              label: 'Дашборд',   icon: LayoutDashboard, end: true },
  { to: '/admin/services',     label: 'Услуги',    icon: Stethoscope },
  { to: '/admin/doctors',      label: 'Врачи',     icon: UserRound },
  { to: '/admin/promotions',   label: 'Акции',     icon: Tag },
  { to: '/admin/appointments', label: 'Заявки',    icon: CalendarClock },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-teal-700">
        <div className="text-white font-bold text-lg leading-tight">
          Dental100med
        </div>
        <div className="text-teal-300 text-xs mt-0.5">Панель управления</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-teal-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-50" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-teal-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-teal-100 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-teal-700 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-teal-700 flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={22} />
          </button>
          <span className="font-semibold text-gray-800">Dental100med</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
