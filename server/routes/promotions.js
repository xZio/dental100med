import { Router } from 'express';
import Promotion from '../models/Promotion.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Публичный — только активные акции
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const promos = await Promotion.find({
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    }).sort({ createdAt: -1 });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Админ — все акции включая неактивные
router.get('/all', protect, async (req, res) => {
  try {
    const promos = await Promotion.find().sort({ createdAt: -1 });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const promo = await Promotion.create(req.body);
    res.status(201).json(promo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promo) return res.status(404).json({ message: 'Акция не найдена' });
    res.json(promo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Акция удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
