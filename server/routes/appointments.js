import { Router } from 'express';
import { db, now, mapRow } from '../config/db.js';
import { protect } from '../middleware/auth.js';
import { notifyNewAppointment } from '../config/push.js';
import { forwardAppointment } from '../config/zioForms.js';

const router = Router();

// Поле формы: только строка, без хвостовых пробелов и не длиннее лимита
const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

// POST /api/appointments — публичный, отправка формы с сайта
router.post('/', (req, res) => {
  try {
    const body = req.body ?? {};
    const name = text(body.name, 100);
    const phone = text(body.phone, 30);
    const service = text(body.service, 200);
    const message = text(body.message, 2000);

    if (!name || !phone)
      return res.status(400).json({ message: 'Имя и телефон обязательны' });
    // Российский номер: 10 цифр после кода страны. Мусор вместо телефона — бесполезная заявка
    const digits = phone.replace(/\D/g, '').replace(/^[78]/, '');
    if (digits.length !== 10)
      return res.status(400).json({ message: 'Введите номер телефона полностью' });

    // Дату принимаем только в виде ГГГГ-ММ-ДД и только реальную — иначе в админке будет каша
    const date = typeof body.date === 'string' ? body.date : '';
    const visitDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) ? date : '';

    const ts = now();
    const { lastInsertRowid } = db
      .prepare('INSERT INTO appointments (name, phone, service, date, message, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(name, phone, service, visitDate, message, ts, ts);

    res.status(201).json({ message: 'Заявка принята', id: String(lastInsertRowid) });

    // Ответ клиенту уже ушёл — уведомления отправляем следом. Их ошибки только в лог:
    // необработанный reject в Node 24 уронил бы весь сервер
    notifyNewAppointment({ name, phone, service, message }).catch((err) => console.error('push:', err));
    forwardAppointment({ name, phone, message }).catch((err) => console.error('zio-forms:', err));
  } catch (err) {
    console.error('appointments POST:', err);
    res.status(500).json({ message: 'Не удалось сохранить заявку' });
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
    console.error('appointments GET:', err);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

// PUT /api/appointments/:id/status — обновить статус заявки
router.put('/:id/status', protect, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body ?? {};
    if (!['new', 'called', 'done'].includes(status))
      return res.status(400).json({ message: 'Недопустимый статус' });

    const { changes } = db
      .prepare('UPDATE appointments SET status = ?, updatedAt = ? WHERE id = ?')
      .run(status, now(), id);
    if (!changes) return res.status(404).json({ message: 'Заявка не найдена' });

    const apt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    res.json(mapRow(apt));
  } catch (err) {
    console.error('appointments PUT:', err);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

// DELETE /api/appointments/:id — убрать отработанную заявку из списка
router.delete('/:id', protect, (req, res) => {
  try {
    const { changes } = db.prepare('DELETE FROM appointments WHERE id = ?').run(Number(req.params.id));
    if (!changes) return res.status(404).json({ message: 'Заявка не найдена' });
    res.json({ message: 'Заявка удалена' });
  } catch (err) {
    console.error('appointments DELETE:', err);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

export default router;
