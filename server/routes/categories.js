import { Router } from 'express';
import Category from '../models/Category.js';
import Service  from '../models/Service.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// GET /api/categories — публичный (нужен на фронте в странице услуг)
router.get('/', async (req, res) => {
  try {
    const cats = await Category.find().sort({ order: 1, name: 1 });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories — только админ
router.post('/', protect, async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/categories/:id — переименовать категорию
// Если имя изменилось — обновляем поле category у всех услуг
router.put('/:id', protect, async (req, res) => {
  try {
    const old = await Category.findById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Категория не найдена' });

    const { name, order } = req.body;

    if (name && name !== old.name) {
      await Service.updateMany({ category: old.name }, { category: name });
    }

    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { name, order },
      { new: true, runValidators: true }
    );
    res.json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/categories/:id — удалить категорию
// Нельзя удалить, если в ней есть услуги
router.delete('/:id', protect, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Категория не найдена' });

    const count = await Service.countDocuments({ category: cat.name });
    if (count > 0) {
      return res.status(400).json({
        message: `В категории «${cat.name}» есть ${count} услуг. Сначала удалите или перенесите их.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Категория удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
