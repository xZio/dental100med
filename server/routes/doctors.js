import { Router } from 'express';
import Doctor from '../models/Doctor.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ order: 1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ message: 'Врач не найден' });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Врач не найден' });
    res.json({ message: 'Врач удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
