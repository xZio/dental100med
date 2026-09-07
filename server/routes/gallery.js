import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { db, now, mapRow } from '../config/db.js';
import { uploadDir } from '../config/uploads.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/gallery — публичный, фото клиники и работ
router.get('/', (req, res) => {
  try {
    const images = db
      .prepare('SELECT * FROM gallery ORDER BY tab ASC, "order" ASC, id ASC')
      .all()
      .map(mapRow);
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', adminOnly, (req, res) => {
  try {
    const { src, alt, tab, order } = req.body;
    if (!src) return res.status(400).json({ message: 'Не передано фото' });

    const ts = now();
    const { lastInsertRowid } = db
      .prepare('INSERT INTO gallery (src, alt, tab, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)')
      .run(src, alt || '', tab === 'works' ? 'works' : 'clinic', Number(order) || 0, ts, ts);

    const image = db.prepare('SELECT * FROM gallery WHERE id = ?').get(lastInsertRowid);
    res.status(201).json(mapRow(image));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', adminOnly, (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ message: 'Фото не найдено' });

    const { alt, tab, order } = req.body;
    db.prepare('UPDATE gallery SET alt = ?, tab = ?, "order" = ?, updatedAt = ? WHERE id = ?')
      .run(
        alt ?? current.alt,
        tab === undefined ? current.tab : (tab === 'works' ? 'works' : 'clinic'),
        order == null ? current.order : Number(order),
        now(),
        id
      );

    res.json(mapRow(db.prepare('SELECT * FROM gallery WHERE id = ?').get(id)));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Вместе со строкой убираем и сам файл — иначе volume зарастает мусором.
// Трогаем только свои загрузки: фото из /public положены в репозиторий.
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const image = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!image) return res.status(404).json({ message: 'Фото не найдено' });

    db.prepare('DELETE FROM gallery WHERE id = ?').run(id);

    if (image.src.startsWith('/uploads/')) {
      await fs.rm(path.join(uploadDir, path.basename(image.src)), { force: true });
    }
    res.json({ message: 'Фото удалено' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
