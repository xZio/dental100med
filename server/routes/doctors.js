import { Router } from 'express';
import { db, now, mapRow } from '../config/db.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const doctors = db
      .prepare('SELECT * FROM doctors ORDER BY "order" ASC')
      .all()
      .map(mapRow);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

router.put('/:id', adminOnly, (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = db.prepare('SELECT * FROM doctors WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ message: 'Врач не найден' });

    const { name, specialty, experience, description, photo, order,
            photoScale, photoPosX, photoPosY } = req.body;
    db.prepare(`UPDATE doctors SET name = ?, specialty = ?, experience = ?, description = ?,
                photo = ?, "order" = ?, photoScale = ?, photoPosX = ?, photoPosY = ?,
                updatedAt = ? WHERE id = ?`)
      .run(
        name?.trim() ?? current.name,
        specialty ?? current.specialty,
        experience ?? current.experience,
        description ?? current.description,
        photo ?? current.photo,
        order == null ? current.order : Number(order),
        photoScale == null ? current.photoScale : Number(photoScale),
        photoPosX == null ? current.photoPosX : Number(photoPosX),
        photoPosY == null ? current.photoPosY : Number(photoPosY),
        now(),
        id
      );

    const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(id);
    res.json(mapRow(doctor));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminOnly, (req, res) => {
  try {
    const { changes } = db.prepare('DELETE FROM doctors WHERE id = ?').run(Number(req.params.id));
    if (!changes) return res.status(404).json({ message: 'Врач не найден' });
    res.json({ message: 'Врач удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
