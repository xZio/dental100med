import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { reachGoal } from './Metrika.jsx';
import ToothIcon from './ToothIcon.jsx';

const navLinks = [
  { to: '/services', label: 'Услуги и цены' },
  { to: '/doctors', label: 'Врачи' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/about', label: 'О клинике' },
  { to: '/contacts', label: 'Контакты' },
];

/** Шапка из макета: лежит поверх синей панели, белым по синему. */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onClick = (e) => {
      if (!navRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  return (
    <div className="site-header">
      <header className="header">
        <Link to="/" className="brand" aria-label="ДенталстоМед — на главную">
          <ToothIcon />
          <span>
            Денталсто<span className="brand-med">Мед</span>
            <small>СЕМЕЙНАЯ СТОМАТОЛОГИЯ</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
          ))}
        </nav>

        <div className="header-contact">
          <a href="tel:+74959241917" onClick={() => reachGoal('call')}>+7 (495) 924-19-17</a>
          <span>Подольск · ТЦ «Максимум»</span>
        </div>

        <button
          ref={menuRef}
          type="button"
          className="menu-toggle circle"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </header>

      {open && (
        <nav id="mobile-nav" ref={navRef} className="mobile-nav" aria-label="Мобильная навигация">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
          <a href="tel:+74959241917" onClick={() => reachGoal('call')}>+7 (495) 924-19-17</a>
        </nav>
      )}
    </div>
  );
}
