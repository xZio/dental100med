import { Router } from 'express';
import { db, now, mapRow } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// В базе active лежит числом, наружу отдаём boolean — как было в mongo
const mapPromo = (row) => (row ? { ...mapRow(row), active: Boolean(row.active) } : null);

// Дата из админки приходит как "ГГГГ-ММ-ДД" — храним полным ISO
const toISO = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date) ? null : date.toISOString();
};

// Публичный — только активные акции
router.get('/', (req, res) => {
  try {
    const promos = db
      .prepare(`SELECT * FROM promotions
                WHERE active = 1 AND (expiresAt IS NULL OR expiresAt > ?)
                ORDER BY createdAt DESC`)
      .all(now())
      .map(mapPromo);
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Админ — все акции включая неактивные
router.get('/all', protect, (req, res) => {
  try {
    const promos = db
      .prepare('SELECT * FROM promotions ORDER BY createdAt DESC')
      .all()
      .map(mapPromo);
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, (req, res) => {
  try {
    const { title, description, discount, active, expiresAt } = req.body;
    if (!title) return res.status(400).json({ message: 'Заголовок обязателен' });

    const ts = now();
    const { lastInsertRowid } = db
      .prepare(`INSERT INTO promotions (title, description, discount, active, expiresAt, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(title.trim(), description || '', discount || '', active === false ? 0 : 1, toISO(expiresAt), ts, ts);

    const promo = db.prepare('SELECT * FROM promotions WHERE id = ?').get(lastInsertRowid);
    res.status(201).json(mapPromo(promo));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = db.prepare('SELECT * FROM promotions WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ message: 'Акция не найдена' });

    const { title, description, discount, active, expiresAt } = req.body;
    db.prepare(`UPDATE promotions SET title = ?, description = ?, discount = ?,
                active = ?, expiresAt = ?, updatedAt = ? WHERE id = ?`)
      .run(
        title?.trim() ?? current.title,
        description ?? current.description,
        discount ?? current.discount,
        active == null ? current.active : (active ? 1 : 0),
        expiresAt === undefined ? current.expiresAt : toISO(expiresAt),
        now(),
        id
      );

    const promo = db.prepare('SELECT * FROM promotions WHERE id = ?').get(id);
    res.json(mapPromo(promo));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, (req, res) => {
  try {
    db.prepare('DELETE FROM promotions WHERE id = ?').run(Number(req.params.id));
    res.json({ message: 'Акция удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
