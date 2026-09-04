import { Router } from 'express';
import { db, now, mapRow } from '../config/db.js';
import { protect } from '../middleware/auth.js';
import { notifyNewAppointment } from '../config/push.js';
import { forwardAppointment } from '../config/zioForms.js';

const router = Router();

// POST /api/appointments — публичный, отправка формы с сайта
router.post('/', (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone)
      return res.status(400).json({ message: 'Имя и телефон обязательны' });

    const ts = now();
    const { lastInsertRowid } = db
      .prepare('INSERT INTO appointments (name, phone, message, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)')
      .run(name.trim(), phone, message || '', ts, ts);

    res.status(201).json({ message: 'Заявка принята', id: String(lastInsertRowid) });

    // Ответ клиенту уже ушёл — уведомления отправляем следом и молча
    notifyNewAppointment({ name, phone, message });
    forwardAppointment({ name, phone, message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments — только админ, список всех заявок
router.get('/', protect, (req, res) => {
  try {
    const appointments = db
      .prepare('SELECT * FROM appointments ORDER BY createdAt DESC')
      .all()
      .map(mapRow);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/appointments/:id/status — обновить статус заявки
router.put('/:id/status', protect, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!['new', 'called', 'done'].includes(status))
      return res.status(400).json({ message: 'Недопустимый статус' });

    const { changes } = db
      .prepare('UPDATE appointments SET status = ?, updatedAt = ? WHERE id = ?')
      .run(status, now(), id);
    if (!changes) return res.status(404).json({ message: 'Заявка не найдена' });

    const apt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    res.json(mapRow(apt));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/appointments/:id — убрать отработанную заявку из списка
router.delete('/:id', protect, (req, res) => {
  try {
    const { changes } = db.prepare('DELETE FROM appointments WHERE id = ?').run(Number(req.params.id));
    if (!changes) return res.status(404).json({ message: 'Заявка не найдена' });
    res.json({ message: 'Заявка удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
