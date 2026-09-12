import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Локально — файл в server/data, в проде — volume (DB_PATH=/data/app.db)
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/dental100med.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);

export const connectDB = () => {
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL UNIQUE,
      "order"   INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      -- Строка, а не число: в прайсе есть «от 10 270 ₽», «2 640 – 3 500 ₽» и «бесплатно»
      price     TEXT NOT NULL,
      note      TEXT NOT NULL DEFAULT '',
      category  TEXT NOT NULL,
      "order"   INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      specialty   TEXT NOT NULL,
      experience  TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      photo       TEXT NOT NULL DEFAULT '',
      "order"     INTEGER NOT NULL DEFAULT 0,
      createdAt   TEXT NOT NULL,
      updatedAt   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      discount    TEXT NOT NULL DEFAULT '',
      active      INTEGER NOT NULL DEFAULT 1,
      expiresAt   TEXT,
      createdAt   TEXT NOT NULL,
      updatedAt   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      src       TEXT NOT NULL,
      alt       TEXT NOT NULL DEFAULT '',
      tab       TEXT NOT NULL DEFAULT 'clinic',
      "order"   INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint  TEXT NOT NULL UNIQUE,
      p256dh    TEXT NOT NULL,
      auth      TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      phone     TEXT NOT NULL,
      service   TEXT NOT NULL DEFAULT '',
      -- Дата местная, в виде ГГГГ-ММ-ДД: времени у неё нет, а часовой пояс сдвинул бы день
      date      TEXT NOT NULL DEFAULT '',
      message   TEXT NOT NULL DEFAULT '',
      status    TEXT NOT NULL DEFAULT 'new',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Услуга и желаемая дата визита — добавлены позже
  addColumn('appointments', 'service', "TEXT NOT NULL DEFAULT ''");
  addColumn('appointments', 'date',    "TEXT NOT NULL DEFAULT ''");

  // Примечание к позиции прайса («под ключ», «один зубной ряд») — добавлено позже
  addColumn('services', 'note', "TEXT NOT NULL DEFAULT ''");

  // Кадр фото врача — добавлен позже, поэтому не в CREATE TABLE
  // По умолчанию — «без кадра»: фото врачей уже квадратные и с лицом по центру,
  // а зум от верхнего края срезал бы подбородок
  addColumn('doctors', 'photoScale', 'REAL NOT NULL DEFAULT 1');
  addColumn('doctors', 'photoPosX',  'REAL NOT NULL DEFAULT 50');
  addColumn('doctors', 'photoPosY',  'REAL NOT NULL DEFAULT 50');
  // Акции-печати в hero ведут на страницу сайта (запись или раздел услуг)
  addColumn('promotions', 'link', "TEXT NOT NULL DEFAULT '/contacts'");

  // Цвет и подпись печати выбираются в админке. Раньше цвет назначался по
  // порядку акции, а подпись вычислялась из ссылки — у существующих строк
  // повторяем то же самое, чтобы после обновления сайт не изменился.
  if (addColumn('promotions', 'color', "TEXT NOT NULL DEFAULT 'cyan'")) {
    const tones = ['cyan', 'ink', 'ice'];
    const rows = db.prepare('SELECT id FROM promotions ORDER BY createdAt, id').all();
    const setColor = db.prepare('UPDATE promotions SET color = ? WHERE id = ?');
    rows.forEach((row, i) => setColor.run(tones[i % tones.length], row.id));
  }
  if (addColumn('promotions', 'cta', "TEXT NOT NULL DEFAULT 'Записаться'")) {
    db.exec("UPDATE promotions SET cta = 'Подробнее' WHERE link NOT LIKE '/contacts%'");
  }

  console.log(`SQLite подключена: ${dbPath}`);
};

/** ALTER TABLE ADD COLUMN нельзя выполнить дважды — проверяем по схеме. true, если колонку добавили сейчас. */
const addColumn = (table, column, ddl) => {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (columns.some((c) => c.name === column)) return false;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
  return true;
};

export const now = () => new Date().toISOString();

// Фронт и админка ждут mongo-подобный ответ: строковый _id
export const mapRow = (row) => (row ? { ...row, _id: String(row.id) } : null);
