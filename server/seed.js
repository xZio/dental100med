import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, connectDB, now } from './config/db.js';

const categories = [
  { name: 'Терапия',               order: 1 },
  { name: 'Детская стоматология',  order: 2 },
  { name: 'Ортопедия',             order: 3 },
  { name: 'Хирургия',              order: 4 },
  { name: 'Имплантация',           order: 5 },
  { name: 'Ортодонтия',            order: 6 },
];

const services = [
  // Терапия
  { category: 'Терапия', order: 1, name: 'Консультация стоматолога', price: 1000 },
  { category: 'Терапия', order: 2, name: 'Лечение кариеса (1 поверхность)', price: 10300 },
  { category: 'Терапия', order: 3, name: 'Лечение кариеса (2 поверхности)', price: 12500 },
  { category: 'Терапия', order: 4, name: 'Профессиональная чистка зубов', price: 7000 },
  { category: 'Терапия', order: 5, name: 'Отбеливание зубов', price: 18000 },
  // Детская
  { category: 'Детская стоматология', order: 1, name: 'Консультация детского стоматолога', price: 1000 },
  { category: 'Детская стоматология', order: 2, name: 'Лечение кариеса молочного зуба', price: 7370 },
  { category: 'Детская стоматология', order: 3, name: 'Удаление молочного зуба', price: 3500 },
  { category: 'Детская стоматология', order: 4, name: 'Герметизация фиссур', price: 4200 },
  // Ортопедия
  { category: 'Ортопедия', order: 1, name: 'Коронка металлокерамическая', price: 27000 },
  { category: 'Ортопедия', order: 2, name: 'Коронка циркониевая', price: 37000 },
  { category: 'Ортопедия', order: 3, name: 'Съёмный протез (акриловый)', price: 35000 },
  { category: 'Ортопедия', order: 4, name: 'Виниры', price: 25000 },
  // Хирургия
  { category: 'Хирургия', order: 1, name: 'Удаление простого зуба', price: 5000 },
  { category: 'Хирургия', order: 2, name: 'Удаление сложного зуба', price: 9000 },
  { category: 'Хирургия', order: 3, name: 'Удаление зуба мудрости', price: 12000 },
  // Имплантация
  { category: 'Имплантация', order: 1, name: 'Имплант Straumann (под ключ)', price: 135000 },
  { category: 'Имплантация', order: 2, name: 'Имплант Nobel Biocare', price: 120000 },
  { category: 'Имплантация', order: 3, name: 'Имплант отечественный', price: 65000 },
  // Ортодонтия
  { category: 'Ортодонтия', order: 1, name: 'Брекеты металлические (1 челюсть)', price: 85000 },
  { category: 'Ортодонтия', order: 2, name: 'Брекеты керамические (1 челюсть)', price: 110000 },
  { category: 'Ортодонтия', order: 3, name: 'Элайнеры (полный курс)', price: 150000 },
];

const doctors = [
  { order: 1, name: 'Мищенко Елена Владимировна',   specialty: 'Главный врач, стоматолог-терапевт',  experience: 'Стаж более 20 лет',                  photo: '/images/doctor-mishenko.png',     description: 'Специализируется на эстетической стоматологии и комплексном лечении.' },
  { order: 2, name: 'Павлова Анна Эдуардовна',       specialty: 'Стоматолог-терапевт',                experience: 'Высшая квалификационная категория',   photo: '/images/doctor-pavlova.jpg',      description: 'Лечение кариеса, реставрация зубов, профессиональная гигиена.' },
  { order: 3, name: 'Перевязкина Юлия Витальевна',   specialty: 'Стоматолог-ортодонт',                experience: 'Специалист по брекетам и элайнерам',  photo: '/images/doctor-perevyazkina.jpg', description: 'Исправление прикуса, брекет-системы, прозрачные элайнеры.' },
  { order: 4, name: 'Тюриков Иван Николаевич',        specialty: 'Хирург-имплантолог',                 experience: 'Специалист по имплантации',            photo: '/images/doctor-tyurikov.jpg',     description: 'Хирургические вмешательства, имплантация зубов, костная пластика.' },
  { order: 5, name: 'Морсакова Елена Константиновна', specialty: 'Стоматолог-ортопед',                 experience: 'Протезирование любой сложности',       photo: '/images/doctor-morsakova.jpg',    description: 'Коронки, виниры, мостовидные протезы, съёмное протезирование.' },
  { order: 6, name: 'Логунова Полина Алексеевна',     specialty: 'Детский стоматолог',                 experience: 'Специалист по детской стоматологии',  photo: '/images/doctor-logunova.jpg',     description: 'Лечение детей от 1 года. Комфортный подход без страха и боли.' },
];

// Фото лежат в public/images — в базу кладём только пути; новые снимки
// админ загрузит через админку, они попадут в /uploads на volume
const gallery = [
  ...Array.from({ length: 16 }, (_, i) => ({
    src: `/images/clinic/clinic-${String(i + 1).padStart(2, '0')}.jpg`,
    alt: `Интерьер клиники ДенталстоМед — фото ${i + 1}`,
    tab: 'clinic',
    order: i + 1,
  })),
  { src: '/images/works/work-01.jpg', alt: 'Работа стоматолога — результат лечения', tab: 'works', order: 1 },
  { src: '/images/works/work-02.jpg', alt: 'Эстетическая реставрация зубов',        tab: 'works', order: 2 },
  { src: '/images/works/work-03.jpg', alt: 'Результат лечения в ДенталстоМед',      tab: 'works', order: 3 },
];

const promotions = [
  { title: 'Бесплатная консультация', description: 'Первичный осмотр и консультация врача — бесплатно', discount: 'Бесплатно', active: true },
  { title: 'Скидка на чистку зубов', description: 'Профессиональная гигиена полости рта со скидкой', discount: '20%', active: true },
];

async function seed() {
  connectDB();

  // С флагом --if-empty (первый запуск в проде) не трогаем уже заполненную базу
  if (process.argv.includes('--if-empty')) {
    const { count } = db.prepare('SELECT COUNT(*) AS count FROM services').get();
    if (count > 0) {
      console.log('База уже заполнена — сид пропущен');
      db.close();
      return;
    }
  }

  // Очищаем старые данные
  db.exec('DELETE FROM categories; DELETE FROM services; DELETE FROM doctors; DELETE FROM promotions; DELETE FROM gallery;');
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('categories','services','doctors','promotions','gallery')");

  const ts = now();

  const insertCategory = db.prepare('INSERT INTO categories (name, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?)');
  for (const c of categories) insertCategory.run(c.name, c.order, ts, ts);

  const insertService = db.prepare('INSERT INTO services (name, price, category, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
  for (const s of services) insertService.run(s.name, s.price, s.category, s.order, ts, ts);

  const insertDoctor = db.prepare(`INSERT INTO doctors (name, specialty, experience, description, photo, "order", createdAt, updatedAt)
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const d of doctors) insertDoctor.run(d.name, d.specialty, d.experience, d.description, d.photo, d.order, ts, ts);

  const insertPromo = db.prepare(`INSERT INTO promotions (title, description, discount, active, expiresAt, createdAt, updatedAt)
                                  VALUES (?, ?, ?, ?, ?, ?, ?)`);
  for (const p of promotions) insertPromo.run(p.title, p.description, p.discount, p.active ? 1 : 0, null, ts, ts);

  const insertImage = db.prepare('INSERT INTO gallery (src, alt, tab, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
  for (const g of gallery) insertImage.run(g.src, g.alt, g.tab, g.order, ts, ts);

  // Генерируем хэш пароля администратора
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 12);
  console.log('\n✅ База данных заполнена!');
  console.log('\n🔑 Хэш пароля администратора — добавь в .env:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);

  db.close();
}

seed();
