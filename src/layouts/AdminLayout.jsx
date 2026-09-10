import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope, UserRound, Tag, CalendarClock, Images,
  LogOut, Menu, X, ChevronRight,
} from 'lucide-react';

// adminOnly — пункты, которых администратор клиники (роль manager) не видит:
// он занимается только заявками
const NAV = [
  { to: '/admin/services',     label: 'Услуги',    icon: Stethoscope,     adminOnly: true },
  { to: '/admin/doctors',      label: 'Врачи',     icon: UserRound,       adminOnly: true },
  { to: '/admin/promotions',   label: 'Акции',     icon: Tag,             adminOnly: true },
  { to: '/admin/gallery',      label: 'Галерея',   icon: Images,          adminOnly: true },
  { to: '/admin/appointments', label: 'Заявки',    icon: CalendarClock },
];

function Sidebar({ isAdmin, onNavigate, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-teal-700">
        <div className="text-white font-bold text-lg leading-tight">
          ДенталстоМед
        </div>
        <div className="text-teal-300 text-xs mt-0.5">Панель управления</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.filter((item) => isAdmin || !item.adminOnly).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
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
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-teal-100 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Манифест PWA нужен только админке: без него iPhone не поставит её на «Домой»,
  // а без установки Apple не шлёт push. На публичных страницах его быть не должно.
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/admin.webmanifest';
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-teal-700 flex-shrink-0">
        <Sidebar isAdmin={isAdmin} onNavigate={closeSidebar} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={closeSidebar} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-teal-700 flex flex-col">
            <button
              type="button"
              onClick={closeSidebar}
              className="absolute top-4 right-4 text-white"
              aria-label="Закрыть меню"
            >
              <X size={20} />
            </button>
            <Sidebar isAdmin={isAdmin} onNavigate={closeSidebar} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          <button type="button" onClick={() => setSidebarOpen(true)} className="text-gray-600" aria-label="Открыть меню">
            <Menu size={22} />
          </button>
          <span className="font-semibold text-gray-800">ДенталстоМед</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
