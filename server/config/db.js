import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // MONGODB_URI — наша переменная, MONGO_URL — автоматическая от Railway
    const uri = process.env.MONGODB_URI || process.env.MONGO_URL;
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  }
};
