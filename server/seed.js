import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Service from './models/Service.js';
import Doctor from './models/Doctor.js';
import Promotion from './models/Promotion.js';

const services = [
  // Терапия
  { category: 'therapy', order: 1, name: 'Консультация стоматолога', price: 1000 },
  { category: 'therapy', order: 2, name: 'Лечение кариеса (1 поверхность)', price: 10300 },
  { category: 'therapy', order: 3, name: 'Лечение кариеса (2 поверхности)', price: 12500 },
  { category: 'therapy', order: 4, name: 'Профессиональная чистка зубов', price: 7000 },
  { category: 'therapy', order: 5, name: 'Отбеливание зубов', price: 18000 },
  // Детская
  { category: 'children', order: 1, name: 'Консультация детского стоматолога', price: 1000 },
  { category: 'children', order: 2, name: 'Лечение кариеса молочного зуба', price: 7370 },
  { category: 'children', order: 3, name: 'Удаление молочного зуба', price: 3500 },
  { category: 'children', order: 4, name: 'Герметизация фиссур', price: 4200 },
  // Ортопедия
  { category: 'orthopedics', order: 1, name: 'Коронка металлокерамическая', price: 27000 },
  { category: 'orthopedics', order: 2, name: 'Коронка циркониевая', price: 37000 },
  { category: 'orthopedics', order: 3, name: 'Съёмный протез (акриловый)', price: 35000 },
  { category: 'orthopedics', order: 4, name: 'Виниры', price: 25000 },
  // Хирургия
  { category: 'surgery', order: 1, name: 'Удаление простого зуба', price: 5000 },
  { category: 'surgery', order: 2, name: 'Удаление сложного зуба', price: 9000 },
  { category: 'surgery', order: 3, name: 'Удаление зуба мудрости', price: 12000 },
  // Имплантация
  { category: 'implants', order: 1, name: 'Имплант Straumann (под ключ)', price: 135000 },
  { category: 'implants', order: 2, name: 'Имплант Nobel Biocare', price: 120000 },
  { category: 'implants', order: 3, name: 'Имплант отечественный', price: 65000 },
  // Ортодонтия
  { category: 'orthodontics', order: 1, name: 'Брекеты металлические (1 челюсть)', price: 85000 },
  { category: 'orthodontics', order: 2, name: 'Брекеты керамические (1 челюсть)', price: 110000 },
  { category: 'orthodontics', order: 3, name: 'Элайнеры (полный курс)', price: 150000 },
];

const doctors = [
  { order: 1, name: 'Мищенко Елена Владимировна',   specialty: 'Главный врач, стоматолог-терапевт',  experience: 'Стаж более 20 лет',                  photo: '/images/doctor-mishenko.png',     description: 'Специализируется на эстетической стоматологии и комплексном лечении.' },
  { order: 2, name: 'Павлова Анна Эдуардовна',       specialty: 'Стоматолог-терапевт',                experience: 'Высшая квалификационная категория',   photo: '/images/doctor-pavlova.jpg',      description: 'Лечение кариеса, реставрация зубов, профессиональная гигиена.' },
  { order: 3, name: 'Перевязкина Юлия Витальевна',   specialty: 'Стоматолог-ортодонт',                experience: 'Специалист по брекетам и элайнерам',  photo: '/images/doctor-perevyazkina.jpg', description: 'Исправление прикуса, брекет-системы, прозрачные элайнеры.' },
  { order: 4, name: 'Тюриков Иван Николаевич',        specialty: 'Хирург-имплантолог',                 experience: 'Специалист по имплантации',            photo: '/images/doctor-tyurikov.jpg',     description: 'Хирургические вмешательства, имплантация зубов, костная пластика.' },
  { order: 5, name: 'Морсакова Елена Константиновна', specialty: 'Стоматолог-ортопед',                 experience: 'Протезирование любой сложности',       photo: '/images/doctor-morsakova.jpg',    description: 'Коронки, виниры, мостовидные протезы, съёмное протезирование.' },
  { order: 6, name: 'Логунова Полина Алексеевна',     specialty: 'Детский стоматолог',                 experience: 'Специалист по детской стоматологии',  photo: '/images/doctor-logunova.jpg',     description: 'Лечение детей от 1 года. Комфортный подход без страха и боли.' },
];

const promotions = [
  { title: 'Бесплатная консультация', description: 'Первичный осмотр и консультация врача — бесплатно', discount: 'Бесплатно', active: true },
  { title: 'Скидка на чистку зубов', description: 'Профессиональная гигиена полости рта со скидкой', discount: '20%', active: true },
];

async function seed() {
  await connectDB();

  // Очищаем старые данные
  await Service.deleteMany({});
  await Doctor.deleteMany({});
  await Promotion.deleteMany({});

  await Service.insertMany(services);
  await Doctor.insertMany(doctors);
  await Promotion.insertMany(promotions);

  // Генерируем хэш пароля администратора
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 12);
  console.log('\n✅ База данных заполнена!');
  console.log(`\n🔑 Хэш пароля администратора — добавь в .env:`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);

  await mongoose.disconnect();
}

seed();
