import { Router } from 'express';
import { db, now, mapRow } from '../config/db.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/categories — публичный (нужен на фронте в странице услуг)
router.get('/', (req, res) => {
  try {
    const cats = db
      .prepare('SELECT * FROM categories ORDER BY "order" ASC, name ASC')
      .all()
      .map(mapRow);
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories — только админ
router.post('/', adminOnly, (req, res) => {
  try {
    const { name, order } = req.body;
    if (!name) return res.status(400).json({ message: 'Название обязательно' });

    const ts = now();
    const { lastInsertRowid } = db
      .prepare('INSERT INTO categories (name, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?)')
      .run(name.trim(), Number(order) || 0, ts, ts);

    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(lastInsertRowid);
    res.status(201).json(mapRow(cat));
  } catch (err) {
    const message = err.message.includes('UNIQUE')
      ? 'Категория с таким названием уже есть'
      : err.message;
    res.status(400).json({ message });
  }
});

// PUT /api/categories/:id — переименовать категорию
// Если имя изменилось — обновляем поле category у всех услуг
router.put('/:id', adminOnly, (req, res) => {
  try {
    const id = Number(req.params.id);
    const old = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!old) return res.status(404).json({ message: 'Категория не найдена' });

    const { name, order } = req.body;
    const newName = name?.trim() || old.name;

    if (newName !== old.name) {
      db.prepare('UPDATE services SET category = ?, updatedAt = ? WHERE category = ?')
        .run(newName, now(), old.name);
    }

    db.prepare('UPDATE categories SET name = ?, "order" = ?, updatedAt = ? WHERE id = ?')
      .run(newName, order == null ? old.order : Number(order), now(), id);

    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.json(mapRow(cat));
  } catch (err) {
    const message = err.message.includes('UNIQUE')
      ? 'Категория с таким названием уже есть'
      : err.message;
    res.status(400).json({ message });
  }
});

// DELETE /api/categories/:id — удалить категорию
// Нельзя удалить, если в ней есть услуги
router.delete('/:id', adminOnly, (req, res) => {
  try {
    const id = Number(req.params.id);
    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!cat) return res.status(404).json({ message: 'Категория не найдена' });

    const { count } = db
      .prepare('SELECT COUNT(*) AS count FROM services WHERE category = ?')
      .get(cat.name);
    if (count > 0) {
      return res.status(400).json({
        message: `В категории «${cat.name}» есть ${count} услуг. Сначала удалите или перенесите их.`,
      });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ message: 'Категория удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
