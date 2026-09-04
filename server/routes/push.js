import { Router } from 'express';
import { saveSubscription, removeSubscription, pushEnabled } from '../config/push.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Публичный ключ отдаём эндпоинтом, а не переменной сборки: фронт собирается
// один раз, а ключи задаются на сервере
router.get('/key', (req, res) => {
  res.json({ key: pushEnabled() ? process.env.VAPID_PUBLIC_KEY : null });
});

router.post('/', protect, (req, res) => {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys?.p256dh || !keys?.auth)
    return res.status(400).json({ message: 'Подписка неполная' });

  saveSubscription({ endpoint, keys });
  res.json({ ok: true });
});

router.delete('/', protect, (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) return res.status(400).json({ message: 'Нет endpoint' });

  removeSubscription(endpoint);
  res.json({ ok: true });
});

export default router;
