import 'dotenv/config';
import { db, connectDB, now } from './config/db.js';

const categories = [
  { name: 'Консультация и диагностика',    order: 1 },
  { name: 'Лечение зубов — терапия',       order: 2 },
  { name: 'Реставрация',                   order: 3 },
  { name: 'Гигиена и профилактика',        order: 4 },
  { name: 'Детская стоматология',          order: 5 },
  { name: 'Протезирование — ортопедия',    order: 6 },
  { name: 'Виниры',                        order: 7 },
  { name: 'Имплантация',                   order: 8 },
  { name: 'Хирургия',                      order: 9 },
  { name: 'Брекеты и элайнеры',            order: 10 },
];

const services = [
  { category: 'Консультация и диагностика', order: 1, name: 'Первичная консультация', price: 'бесплатно', note: '' },
  { category: 'Консультация и диагностика', order: 2, name: 'Консультация с планом лечения', price: '3 500 ₽', note: 'стоматолог, хирург, ортопед, терапевт' },
  { category: 'Консультация и диагностика', order: 3, name: 'Цифровая радиовизиография', price: '550 ₽', note: '' },
  { category: 'Консультация и диагностика', order: 4, name: 'Панорамный снимок (ОПТГ)', price: 'от 2 000 ₽', note: '' },
  { category: 'Консультация и диагностика', order: 5, name: 'Компьютерная томография (КТ)', price: '4 000 ₽', note: '' },
  { category: 'Консультация и диагностика', order: 6, name: 'Телерентгенограмма (ТРГ)', price: '2 000 ₽', note: '' },
  { category: 'Лечение зубов — терапия', order: 1, name: 'Лечение кариеса (пломба)', price: 'от 10 270 ₽', note: '' },
  { category: 'Лечение зубов — терапия', order: 2, name: 'Эндодонтическое лечение (корневые каналы)', price: 'от 11 500 ₽', note: '' },
  { category: 'Реставрация', order: 1, name: 'Эстетическая реставрация композитом', price: 'от 12 000 ₽', note: '' },
  { category: 'Гигиена и профилактика', order: 1, name: 'Профессиональная гигиена полости рта', price: '7 000 ₽', note: 'стандартная' },
  { category: 'Гигиена и профилактика', order: 2, name: 'Снятие отложений скейлером (1 зуб)', price: '500 ₽', note: 'до 6 зубов' },
  { category: 'Гигиена и профилактика', order: 3, name: 'Аппарат Air-Flow (1 зуб)', price: '500 ₽', note: 'до 6 зубов' },
  { category: 'Детская стоматология', order: 1, name: 'Лечение кариеса молочного зуба', price: 'от 6 570 ₽', note: '' },
  { category: 'Детская стоматология', order: 2, name: 'Эндодонтическое лечение молочного зуба', price: 'от 12 000 ₽', note: '' },
  { category: 'Детская стоматология', order: 3, name: 'Эстетическая реставрация', price: 'от 8 000 ₽', note: '' },
  { category: 'Детская стоматология', order: 4, name: 'Удаление молочного зуба', price: 'от 1 900 ₽', note: '' },
  { category: 'Протезирование — ортопедия', order: 1, name: 'Металлокерамическая коронка', price: 'от 27 000 ₽', note: '' },
  { category: 'Протезирование — ортопедия', order: 2, name: 'Цельнокерамическая коронка (EMAX)', price: 'от 37 000 ₽', note: '' },
  { category: 'Протезирование — ортопедия', order: 3, name: 'Коронка на диоксиде циркония', price: 'от 37 000 ₽', note: '' },
  { category: 'Протезирование — ортопедия', order: 4, name: 'Керамическая вкладка', price: '37 000 ₽', note: 'под ключ' },
  { category: 'Виниры', order: 1, name: 'Керамический винир', price: '37 000 ₽', note: 'под ключ' },
  { category: 'Имплантация', order: 1, name: 'Имплантат Astra Tech (Швеция)', price: '65 000 ₽', note: 'без учёта коронки' },
  { category: 'Имплантация', order: 2, name: 'Имплантат Dentium (Ю. Корея)', price: '43 000 ₽', note: 'без учёта коронки' },
  { category: 'Хирургия', order: 1, name: 'Удаление зуба', price: 'от 5 400 ₽', note: '' },
  { category: 'Хирургия', order: 2, name: 'Удаление зуба мудрости', price: 'от 11 300 ₽', note: '' },
  { category: 'Хирургия', order: 3, name: 'Синуслифтинг (операция)', price: 'от 23 380 ₽', note: '' },
  { category: 'Хирургия', order: 4, name: 'Закрытый кюретаж карманов (1 зуб)', price: '2 640 – 3 500 ₽', note: '' },
  { category: 'Хирургия', order: 5, name: 'Открытый кюретаж карманов (1 зуб)', price: '5 400 ₽', note: '' },
  { category: 'Брекеты и элайнеры', order: 1, name: 'Консультация ортодонта', price: '1 500 ₽', note: 'детская до 12 лет — 1 000 ₽' },
  { category: 'Брекеты и элайнеры', order: 2, name: 'Брекет-система металлическая', price: 'от 75 300 ₽', note: 'один зубной ряд' },
  { category: 'Брекеты и элайнеры', order: 3, name: 'Брекет-система эстетическая', price: 'от 100 000 ₽', note: 'один зубной ряд' },
  { category: 'Брекеты и элайнеры', order: 4, name: 'Лечение на съёмных аппаратах', price: 'от 14 000 ₽', note: '' },
  { category: 'Брекеты и элайнеры', order: 5, name: 'Лечение на элайнерах', price: 'от 200 000 ₽', note: '' },
];


const doctors = [
  { order: 1, name: 'Ивина Елена Владимировна',        specialty: 'Врач стоматолог-терапевт, основательница клиники', experience: 'В стоматологии с 1997 года', photo: '/images/doctors/ivina.webp',        description: 'Реставрация фронтальных зубов, эндодонтическое лечение. Сертифицированный специалист Kerr и 3M ESPE, ведёт взрослый и детский приём.' },
  { order: 2, name: 'Тюриков Иван Николаевич',         specialty: 'Врач стоматолог-ортопед',        experience: 'Стаж работы более десяти лет', photo: '/images/doctors/tyurikov.webp',     description: 'Все виды несъёмного и съёмного протезирования, протезирование на имплантах. Прошёл переподготовку по хирургической стоматологии.' },
  { order: 3, name: 'Перевязкина Юлия Витальевна',     specialty: 'Врач стоматолог-ортопед',        experience: 'МГМСУ им. А.И. Евдокимова, ординатура 2019', photo: '/images/doctors/perevyazkina.webp', description: 'Коронки, виниры, вкладки, съёмные и бюгельные протезы, протезирование на имплантах. Диагностика и лечение заболеваний ВНЧС.' },
  { order: 4, name: 'Логунова Полина Алексеевна',      specialty: 'Врач стоматолог-ортодонт',       experience: 'Пациенты любого возраста', photo: '/images/doctors/rachkovskaya.webp', description: 'Брекет-системы, элайнеры, съёмные и функциональные аппараты. Анализ ОПТГ, ТРГ и КТ, комплексный план лечения прикуса.' },
  { order: 5, name: 'Ионова Анна Эдуардовна',          specialty: 'Врач стоматолог-терапевт',       experience: 'МГМСУ им. А.И. Евдокимова, 2021', photo: '/images/doctors/ionova.webp',       description: 'Лечение кариеса и его осложнений, профессиональная гигиена и отбеливание, лечение заболеваний слизистой полости рта.' },
  { order: 6, name: 'Морсакова Елена Константиновна',  specialty: 'Врач стоматолог-терапевт',       experience: 'ВолгГМУ, 2007', photo: '/images/doctors/morsakova.webp',    description: 'Эндодонтия: лечение и перелечивание корневых каналов, современные методы инструментации и обтурации.' },
  { order: 7, name: 'Паршин Виталий Степанович',       specialty: 'Врач стоматолог общей практики', experience: 'Пензенский государственный университет, 2021', photo: '/images/doctors/parshin.webp',      description: 'Хирургические операции, лечение кариеса, эндодонтия, установка имплантов и подготовка к протезированию.' },
  { order: 8, name: 'Муродалиева Нуринисо Садриддиновна', specialty: 'Ассистент стоматолога',       experience: 'В стоматологии с 2016 года', photo: '/images/doctors/murodalieva.webp',  description: 'Помогает врачам на приёме, готовит кабинет и инструменты. Медицинский сертификат по специальности «сестринское дело».' },
  { order: 9, name: 'Лопатина Юлия Олеговна',          specialty: 'Администратор',                  experience: '', photo: '/images/doctors/lopatina.webp',    description: 'Встречает пациентов, записывает на приём и подбирает удобное время визита.' },
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

// Акции-печати в hero: мелкий текст, крупный текст и куда ведёт. Те же три,
// что сейчас у Денталии, — заготовка, клиника поменяет через админку.
const promotions = [
  { title: 'Консультация всех врачей', discount: 'бесплатно',   link: '/contacts' },
  { title: 'Панорамный снимок КТ',     discount: '4200 ₽',      link: '/contacts' },
  { title: 'Брекеты',                  discount: 'в рассрочку', link: '/services#Брекеты и элайнеры' },
];

function seed() {
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

  const insertService = db.prepare('INSERT INTO services (name, price, note, category, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const s of services) insertService.run(s.name, s.price, s.note, s.category, s.order, ts, ts);

  // Кадр фото задаём явно: у уже существующей базы дефолты колонок могли остаться старыми (1.22 / верх)
  const insertDoctor = db.prepare(`INSERT INTO doctors (name, specialty, experience, description, photo, "order", photoScale, photoPosX, photoPosY, createdAt, updatedAt)
                                   VALUES (?, ?, ?, ?, ?, ?, 1, 50, 50, ?, ?)`);
  for (const d of doctors) insertDoctor.run(d.name, d.specialty, d.experience, d.description, d.photo, d.order, ts, ts);

  const insertPromo = db.prepare(`INSERT INTO promotions (title, description, discount, link, active, expiresAt, createdAt, updatedAt)
                                  VALUES (?, '', ?, ?, 1, NULL, ?, ?)`);
  for (const p of promotions) insertPromo.run(p.title, p.discount, p.link, ts, ts);

  const insertImage = db.prepare('INSERT INTO gallery (src, alt, tab, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
  for (const g of gallery) insertImage.run(g.src, g.alt, g.tab, g.order, ts, ts);

  console.log('\n✅ База данных заполнена!');

  db.close();
}

seed();
