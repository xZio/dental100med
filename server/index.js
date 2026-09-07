import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { uploadDir } from './config/uploads.js';
import authRoutes         from './routes/auth.js';
import servicesRoutes     from './routes/services.js';
import categoriesRoutes   from './routes/categories.js';
import doctorsRoutes      from './routes/doctors.js';
import promotionsRoutes   from './routes/promotions.js';
import appointmentsRoutes from './routes/appointments.js';
import uploadsRoutes      from './routes/uploads.js';
import galleryRoutes      from './routes/gallery.js';
import pushRoutes         from './routes/push.js';
import ratingRoutes       from './routes/rating.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

connectDB();

app.use(cors());
app.use(express.json());

// API роуты
app.use('/api/auth',         authRoutes);
app.use('/api/services',     servicesRoutes);
app.use('/api/categories',   categoriesRoutes);
app.use('/api/doctors',      doctorsRoutes);
app.use('/api/promotions',   promotionsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/uploads',      uploadsRoutes);
app.use('/api/gallery',      galleryRoutes);
app.use('/api/push',         pushRoutes);
app.use('/api/rating',       ratingRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

// Загруженные фото лежат на volume, а не в репозитории
app.use('/uploads', express.static(uploadDir, { maxAge: '30d', immutable: true }));

// В продакшене раздаём собранный React
if (isProd) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  // Все остальные запросы → index.html (React Router)
  app.get('/{*path}', (_, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
