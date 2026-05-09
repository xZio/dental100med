import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/services', label: 'Услуги и цены' },
  { to: '/doctors', label: 'Врачи' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/about', label: 'О клинике' },
  { to: '/contacts', label: 'Контакты' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Dental100 — стоматология"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+74959241917"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
            >
              <Phone size={16} />
              <span className="hidden md:inline">+7 (495) 924-19-17</span>
            </a>
            <Link to="/contacts" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
              Записаться
            </Link>
            {/* Burger */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Меню"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1 border-t border-slate-100 mt-1 flex flex-col gap-2">
              <a
                href="tel:+74959241917"
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-primary-700"
              >
                <Phone size={16} />
                +7 (495) 924-19-17
              </a>
              <Link to="/contacts" className="btn-primary justify-center mx-4">
                Записаться на приём
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
