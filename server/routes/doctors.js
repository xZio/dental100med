import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { db, now, mapRow } from '../config/db.js';
import { adminOnly } from '../middleware/auth.js';
import { uploadDir } from '../config/uploads.js';

const router = Router();

// Фото из админки лежат на volume — вместе с врачом или при замене снимка
// убираем и файл, иначе диск зарастает. Фото из /public не трогаем.
const removeUpload = async (src) => {
  if (!src || !src.startsWith('/uploads/')) return;
  await fs.rm(path.join(uploadDir, path.basename(src)), { force: true }).catch((err) => console.error('rm photo:', err));
};

router.get('/', (req, res) => {
  try {
    const doctors = db
      .prepare('SELECT * FROM doctors ORDER BY "order" ASC')
      .all()
      .map(mapRow);
    res.json(doctors);
  } catch (err) {
    console.error('doctors GET:', err);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

router.post('/', adminOnly, (req, res) => {
  try {
    const { name, specialty, experience, description, photo, order,
            photoScale, photoPosX, photoPosY } = req.body;
    if (!name || !specialty)
      return res.status(400).json({ message: 'Имя и специальность обязательны' });

    const ts = now();
    const { lastInsertRowid } = db
      .prepare(`INSERT INTO doctors (name, specialty, experience, description, photo, "order",
                                     photoScale, photoPosX, photoPosY, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(name.trim(), specialty, experience || '', description || '', photo || '', Number(order) || 0,
           Number(photoScale) || 1, photoPosX == null ? 50 : Number(photoPosX),
           photoPosY == null ? 50 : Number(photoPosY), ts, ts);

    const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(lastInsertRowid);
    res.status(201).json(mapRow(doctor));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = db.prepare('SELECT * FROM doctors WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ message: 'Врач не найден' });

    const { name, specialty, experience, description, photo, order,
            photoScale, photoPosX, photoPosY } = req.body;
    const nextPhoto = photo ?? current.photo;
    db.prepare(`UPDATE doctors SET name = ?, specialty = ?, experience = ?, description = ?,
                photo = ?, "order" = ?, photoScale = ?, photoPosX = ?, photoPosY = ?,
                updatedAt = ? WHERE id = ?`)
      .run(
        name?.trim() ?? current.name,
        specialty ?? current.specialty,
        experience ?? current.experience,
        description ?? current.description,
        nextPhoto,
        order == null ? current.order : Number(order),
        photoScale == null ? current.photoScale : Number(photoScale),
        photoPosX == null ? current.photoPosX : Number(photoPosX),
        photoPosY == null ? current.photoPosY : Number(photoPosY),
        now(),
        id
      );

    if (nextPhoto !== current.photo) await removeUpload(current.photo);

    const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(id);
    res.json(mapRow(doctor));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = db.prepare('SELECT photo FROM doctors WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ message: 'Врач не найден' });

    db.prepare('DELETE FROM doctors WHERE id = ?').run(id);
    await removeUpload(current.photo);
    res.json({ message: 'Врач удалён' });
  } catch (err) {
    console.error('doctors DELETE:', err);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

export default router;
