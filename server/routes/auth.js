import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createHash, timingSafeEqual } from 'crypto';

const router = Router();

/** Сравнение за постоянное время. Хеши уравнивают длину — иначе timingSafeEqual бросает. */
const same = (a, b) =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

/**
 * Аккаунтов ровно два, оба из переменных окружения — своей таблицы пользователей
 * нет. admin — всё, manager (администратор клиники) — только заявки.
 */
const accounts = () => [
  { email: process.env.ADMIN_EMAIL,   password: process.env.ADMIN_PASSWORD,   role: 'admin' },
  { email: process.env.MANAGER_EMAIL, password: process.env.MANAGER_PASSWORD, role: 'manager' },
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Введите email и пароль' });

  const login = email.trim().toLowerCase();
  const account = accounts().find(
    (a) => a.email && a.password && same(login, a.email.toLowerCase()) && same(password, a.password)
  );

  if (!account)
    return res.status(401).json({ message: 'Неверный email или пароль' });

  const token = jwt.sign({ email: account.email, role: account.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, role: account.role });
});

export default router;
