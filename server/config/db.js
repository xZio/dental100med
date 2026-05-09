import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Пробуем все возможные имена переменной, которые генерирует Railway
    const uri =
      process.env.MONGODB_URI  ||   // наша переменная
      process.env.MONGO_URL    ||   // Railway MongoDB plugin (старый формат)
      process.env.MONGODB_URL  ||   // Railway MongoDB plugin (новый формат)
      process.env.DATABASE_URL;     // универсальный fallback

    if (!uri) {
      const keys = Object.keys(process.env)
        .filter(k => k.toLowerCase().includes('mongo') || k.toLowerCase().includes('db'))
        .join(', ');
      console.error('❌ URI MongoDB не найден. Переменные окружения с "mongo"/"db":', keys || '(нет)');
      throw new Error('MongoDB URI не задан');
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  }
};
