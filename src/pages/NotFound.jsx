import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO.js';

export default function NotFound() {
  useSEO({ title: 'Страница не найдена' });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-bold text-primary-200 mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Страница не найдена</h1>
        <p className="text-slate-500 mb-8">
          Возможно, она была перемещена или удалена. Вернитесь на главную страницу.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Home size={18} />
            На главную
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-primary-400 text-slate-600 hover:text-primary-700 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
            Назад
          </button>
        </div>
      </motion.div>
    </div>
  );
}
