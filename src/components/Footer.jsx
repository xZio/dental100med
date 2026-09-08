import { Link } from 'react-router-dom';
import { legal } from '../data/legal.js';

/** Подвал из макета: бренд, ссылки, реквизиты и обязательная медицинская пометка. */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Link className="brand" to="/" aria-label="ДенталстоМед — на главную">
          <img src="/images/logo.png" alt="ДенталстоМед" width="785" height="132" loading="lazy" />
        </Link>
        <div>
          <Link to="/services">Услуги</Link>
          <Link to="/doctors">Врачи</Link>
          <Link to="/gallery">Галерея</Link>
          <Link to="/about">О клинике</Link>
          <Link to="/contacts">Контакты</Link>
        </div>
        <a className="to-top" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          Наверх ↑
        </a>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ДенталстоМед</span>
        <span>{legal.shortName} · ИНН {legal.inn} · Лицензия № {legal.license.number}</span>
        <Link to="/privacy">Конфиденциальность</Link>
      </div>

      <p className="medical-note">Имеются противопоказания. Необходима консультация специалиста.</p>
    </footer>
  );
}
