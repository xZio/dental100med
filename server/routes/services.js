import { Router } from 'express';
import { db, now, mapRow } from '../config/db.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/services — публичный, для фронтенда
router.get('/', (req, res) => {
  try {
    const services = db
      .prepare('SELECT * FROM services ORDER BY category ASC, "order" ASC')
      .all()
      .map(mapRow);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/services — только админ
router.post('/', adminOnly, (req, res) => {
  try {
    const { name, price, category, order } = req.body;
    if (!name || price == null || !category)
      return res.status(400).json({ message: 'Название, цена и категория обязательны' });

    const ts = now();
    const { lastInsertRowid } = db
      .prepare('INSERT INTO services (name, price, category, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name.trim(), Number(price), category, Number(order) || 0, ts, ts);

    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(lastInsertRowid);
    res.status(201).json(mapRow(service));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/services/:id — только админ
router.put('/:id', adminOnly, (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM services WHERE id = ?').get(Number(req.params.id));
    if (!current) return res.status(404).json({ message: 'Услуга не найдена' });

    const { name, price, category, order } = req.body;
    db.prepare('UPDATE services SET name = ?, price = ?, category = ?, "order" = ?, updatedAt = ? WHERE id = ?')
      .run(
        name?.trim() ?? current.name,
        price == null ? current.price : Number(price),
        category ?? current.category,
        order == null ? current.order : Number(order),
        now(),
        Number(req.params.id)
      );

    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(Number(req.params.id));
    res.json(mapRow(service));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/services/:id — только админ
router.delete('/:id', adminOnly, (req, res) => {
  try {
    const { changes } = db.prepare('DELETE FROM services WHERE id = ?').run(Number(req.params.id));
    if (!changes) return res.status(404).json({ message: 'Услуга не найдена' });
    res.json({ message: 'Услуга удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
