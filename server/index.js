import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes        from './routes/auth.js';
import servicesRoutes    from './routes/services.js';
import doctorsRoutes     from './routes/doctors.js';
import promotionsRoutes  from './routes/promotions.js';
import appointmentsRoutes from './routes/appointments.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к MongoDB
connectDB();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'https://dental100med.vercel.app'] }));
app.use(express.json());

// Роуты
app.use('/api/auth',         authRoutes);
app.use('/api/services',     servicesRoutes);
app.use('/api/doctors',      doctorsRoutes);
app.use('/api/promotions',   promotionsRoutes);
app.use('/api/appointments', appointmentsRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
