import { Router } from 'express';
import { db, now, mapRow } from '../config/db.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// В базе active лежит числом, наружу отдаём boolean — как было в mongo
const mapPromo = (row) => (row ? { ...mapRow(row), active: Boolean(row.active) } : null);

// Дата из админки приходит как "ГГГГ-ММ-ДД" — храним полным ISO
const toISO = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date) ? null : date.toISOString();
};

// Цвет печати выбирается из палитры сайта — произвольный в базу не пустим
const COLORS = ['cyan', 'ink', 'ice'];
const cleanColor = (value) => (COLORS.includes(value) ? value : COLORS[0]);

// Подпись внизу печати: короткая, иначе не влезет в круг
const cleanCta = (value) => String(value ?? '').trim().slice(0, 24) || 'Записаться';

// Печать ведёт только на страницу сайта — внешние адреса не принимаем
const cleanLink = (value) => {
  const link = String(value ?? '').trim();
  return link.startsWith('/') ? link : '/contacts';
};

// В hero помещаются три печати — четвёртую активную не даём включить
const MAX_ACTIVE = 3;
const activeCount = (exceptId) => db
  .prepare(`SELECT COUNT(*) AS n FROM promotions WHERE active = 1${exceptId ? ' AND id != ?' : ''}`)
  .get(...(exceptId ? [exceptId] : [])).n;
const LIMIT_MESSAGE = 'На сайте помещается не больше трёх акций — скройте или удалите одну';

// Публичный — только активные акции
router.get('/', (req, res) => {
  try {
    const promos = db
      .prepare(`SELECT * FROM promotions
                WHERE active = 1 AND (expiresAt IS NULL OR expiresAt > ?)
                ORDER BY createdAt, id LIMIT ${MAX_ACTIVE}`)
      .all(now())
      .map(mapPromo);
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Админ — все акции включая неактивные
router.get('/all', protect, (req, res) => {
  try {
    const promos = db
      .prepare('SELECT * FROM promotions ORDER BY createdAt, id')
      .all()
      .map(mapPromo);
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', adminOnly, (req, res) => {
  try {
    const { title, description, discount, link, cta, color, active, expiresAt } = req.body;
    if (!title) return res.status(400).json({ message: 'Заголовок обязателен' });
    if (active !== false && activeCount() >= MAX_ACTIVE) return res.status(400).json({ message: LIMIT_MESSAGE });

    const ts = now();
    const { lastInsertRowid } = db
      .prepare(`INSERT INTO promotions (title, description, discount, link, cta, color, active, expiresAt, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(title.trim(), description || '', discount || '', cleanLink(link), cleanCta(cta), cleanColor(color),
           active === false ? 0 : 1, toISO(expiresAt), ts, ts);

    const promo = db.prepare('SELECT * FROM promotions WHERE id = ?').get(lastInsertRowid);
    res.status(201).json(mapPromo(promo));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', adminOnly, (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = db.prepare('SELECT * FROM promotions WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ message: 'Акция не найдена' });

    const { title, description, discount, link, cta, color, active, expiresAt } = req.body;
    const nextActive = active == null ? current.active : (active ? 1 : 0);
    if (nextActive && !current.active && activeCount(id) >= MAX_ACTIVE) return res.status(400).json({ message: LIMIT_MESSAGE });

    db.prepare(`UPDATE promotions SET title = ?, description = ?, discount = ?, link = ?,
                cta = ?, color = ?, active = ?, expiresAt = ?, updatedAt = ? WHERE id = ?`)
      .run(
        title?.trim() ?? current.title,
        description ?? current.description,
        discount ?? current.discount,
        link === undefined ? current.link : cleanLink(link),
        cta === undefined ? current.cta : cleanCta(cta),
        color === undefined ? current.color : cleanColor(color),
        nextActive,
        expiresAt === undefined ? current.expiresAt : toISO(expiresAt),
        now(),
        id
      );

    const promo = db.prepare('SELECT * FROM promotions WHERE id = ?').get(id);
    res.json(mapPromo(promo));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminOnly, (req, res) => {
  try {
    const { changes } = db.prepare('DELETE FROM promotions WHERE id = ?').run(Number(req.params.id));
    if (!changes) return res.status(404).json({ message: 'Акция не найдена' });
    res.json({ message: 'Акция удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
