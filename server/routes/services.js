import { Router } from 'express';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// GET /api/services — публичный, для фронтенда
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ category: 1, order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/services — только админ
router.post('/', protect, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/services/:id — только админ
router.put('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ message: 'Услуга не найдена' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/services/:id — только админ
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Услуга не найдена' });
    res.json({ message: 'Услуга удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
