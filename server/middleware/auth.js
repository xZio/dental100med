import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена — доступ запрещён' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Токен недействителен' });
  }
};

/**
 * Всё, кроме заявок: цены, врачи, галерея, акции. Менеджеру сюда нельзя —
 * проверяем на сервере, а не только прячем пункты меню в интерфейсе.
 */
export const adminOnly = [
  protect,
  (req, res, next) => {
    if (req.user?.role !== 'admin')
      return res.status(403).json({ message: 'Недостаточно прав' });
    next();
  },
];
