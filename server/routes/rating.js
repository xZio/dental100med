import { Router } from 'express';
import { getYandexRating } from '../config/yandex-rating.js';

const router = Router();

// GET /api/rating — публичный: рейтинг клиники на Яндекс Картах
router.get('/', async (req, res) => {
  const rating = await getYandexRating();
  if (!rating) return res.status(204).end();
  res.json(rating);
});

export default router;
