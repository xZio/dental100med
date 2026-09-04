import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createHash, timingSafeEqual } from 'crypto';

const router = Router();

/** Сравнение за постоянное время. Хеши уравнивают длину — иначе timingSafeEqual бросает. */
const same = (a, b) =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Введите email и пароль' });

  const emailOk    = same(email.trim().toLowerCase(), (process.env.ADMIN_EMAIL || '').toLowerCase());
  const passwordOk = same(password, process.env.ADMIN_PASSWORD || '');

  if (!emailOk || !passwordOk)
    return res.status(401).json({ message: 'Неверный email или пароль' });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export default router;
