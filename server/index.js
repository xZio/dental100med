import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { rateLimit } from 'express-rate-limit';
import { db, connectDB } from './config/db.js';
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
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://dental100med.zio-dev.com';

// Без секрета JWT и учётки админа сервер поднялся бы «здоровым», но с мёртвой админкой —
// лучше упасть сразу, чем узнать об этом от клиники
for (const key of ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']) {
  if (!process.env[key]) {
    console.error(`Не задана переменная окружения ${key}`);
    process.exit(1);
  }
}

connectDB();

// За Traefik/Caddy в Coolify: иначе rate limit увидит один IP прокси на всех
app.set('trust proxy', 1);
app.disable('x-powered-by');

// В проде фронт и API на одном домене — чужим сайтам доступ к API не нужен.
// Локально фронт живёт на :5173, поэтому CORS открыт.
if (!isProd) app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Минимальные security-заголовки (без helmet: CSP пришлось бы подстраивать под Метрику и Карты)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Публичные POST без ограничений — это спам заявками с push на все телефоны и брутфорс пароля
const limiter = (windowMs, limit, message) =>
  rateLimit({ windowMs, limit, standardHeaders: 'draft-7', legacyHeaders: false, message: { message } });
app.use('/api/auth/login', limiter(15 * 60 * 1000, 10, 'Слишком много попыток входа — подождите 15 минут'));
app.post('/api/appointments', limiter(10 * 60 * 1000, 5, 'Слишком много заявок подряд — позвоните нам или попробуйте позже'));

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
// Неизвестный API-путь — JSON 404, а не страница сайта
app.use('/api', (_, res) => res.status(404).json({ message: 'Не найдено' }));

// Загруженные фото лежат на volume, а не в репозитории
app.use('/uploads', express.static(uploadDir, { maxAge: '30d', immutable: true }));

// Поисковикам: админку не индексировать, карта сайта — публичные страницы
const PAGES = ['/', '/services', '/doctors', '/gallery', '/about', '/contacts', '/privacy'];
app.get('/robots.txt', (_, res) => {
  res.type('text/plain').send(`User-agent: *\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
});
app.get('/sitemap.xml', (_, res) => {
  const urls = PAGES.map((p) => `  <url><loc>${SITE_ORIGIN}${p}</loc></url>`).join('\n');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
});

// В продакшене раздаём собранный React
if (isProd) {
  const distPath = path.join(__dirname, '../dist');
  // Файлы сборки с хешем в имени можно кешировать навсегда; index.html — нет
  app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }));
  // Остальные запросы → index.html (React Router). Но только навигационные:
  // на «/images/services/therapy.webp» надо отдать 404, а не страницу, иначе
  // <img> покажет значок битой картинки вместо запасной иконки.
  app.get('/{*path}', (req, res, next) => {
    if (path.extname(req.path)) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Всё, что не поймали роуты (multer, кривой JSON, ошибки в async-обработчиках) —
// ответом JSON, а не HTML-страницей Express, которую фронт не сможет прочитать
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'Файл больше 15 МБ' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Неверный формат запроса' });
  console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Ошибка сервера' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

// Аккуратная остановка: дождаться текущих запросов и закрыть SQLite (чекпоинт WAL)
const shutdown = () => {
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 5000).unref();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
