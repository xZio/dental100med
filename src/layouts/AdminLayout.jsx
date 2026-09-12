import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPWA from '../components/admin/AdminPWA';
import { Stethoscope, UserRound, Tag, CalendarClock, Images, LogOut, ChevronRight } from 'lucide-react';

// adminOnly — разделы, которых администратор клиники (роль manager) не видит:
// он занимается только заявками, и меню ему не нужно вовсе
const NAV = [
  { to: '/admin/services',     label: 'Услуги',  icon: Stethoscope,   adminOnly: true },
  { to: '/admin/doctors',      label: 'Врачи',   icon: UserRound,     adminOnly: true },
  { to: '/admin/promotions',   label: 'Акции',   icon: Tag,           adminOnly: true },
  { to: '/admin/gallery',      label: 'Галерея', icon: Images,        adminOnly: true },
  { to: '/admin/appointments', label: 'Заявки',  icon: CalendarClock },
];

/**
 * Разделы: на десктопе колонкой слева, на телефоне — нижней панелью, как в
 * мобильном приложении. Шторку-гамбургер убрали: панель открывают с телефона, и
 * тянуться к верхнему углу за каждым переходом неудобно.
 */
function AdminNav() {
  const linkCls = (isActive, mobile) =>
    mobile
      ? `flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${isActive ? 'text-teal-600' : 'text-gray-400'}`
      : `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${isActive ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <>
      <aside className="hidden md:sticky md:top-0 md:flex md:h-svh md:w-[224px] md:shrink-0 md:flex-col md:gap-1 md:border-r md:border-gray-200 md:bg-white md:p-4">
        <div className="mb-3 px-3.5 pt-1">
          <div className="text-[15px] font-extrabold leading-tight text-gray-800">ДенталстоМед</div>
          <div className="mt-0.5 text-xs text-gray-400">Панель управления</div>
        </div>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => linkCls(isActive, false)}>
            <Icon size={18} aria-hidden />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-50" aria-hidden />
          </NavLink>
        ))}
      </aside>

      <nav
        aria-label="Разделы"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => linkCls(isActive, true)}>
            <Icon size={20} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default function AdminLayout() {
  const { logout, isAdmin, email } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-svh touch-manipulation bg-gray-50 md:flex">
      <AdminPWA />
      {isAdmin && <AdminNav />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <img src="/images/logo-mark.png" alt="" width="348" height="224" className="h-7 w-auto" aria-hidden />
            <span className="text-[15px] font-extrabold text-gray-800">ДенталстоМед</span>
            <span className="hidden text-[13px] text-gray-400 sm:inline">· панель управления</span>
          </div>

          <div className="flex items-center gap-3">
            {email && <span className="hidden max-w-[220px] truncate text-[13px] text-gray-400 md:inline">{email}</span>}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3.5 py-2 text-[13px] font-bold text-gray-600 transition-colors hover:border-teal-500 hover:text-teal-600"
            >
              <LogOut size={15} aria-hidden />
              Выйти
            </button>
          </div>
        </header>

        {/* pb-24 на телефоне — чтобы нижняя панель не накрывала последнюю кнопку */}
        <main className="flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-10 md:pt-6">
          <div className="mx-auto max-w-[880px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
