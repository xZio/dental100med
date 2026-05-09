import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// POST /api/appointments — публичный, отправка формы с сайта
router.post('/', async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone)
      return res.status(400).json({ message: 'Имя и телефон обязательны' });

    const appointment = await Appointment.create({ name, phone, message });
    res.status(201).json({ message: 'Заявка принята', id: appointment._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments — только админ, список всех заявок
router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/appointments/:id/status — обновить статус заявки
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const apt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!apt) return res.status(404).json({ message: 'Заявка не найдена' });
    res.json(apt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
