import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/admin';
import { Lock } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await adminApi.login(form.email, form.password);
      login(token);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Вход в панель</h1>
          <p className="text-gray-500 text-sm mt-1">Dental100med</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              placeholder="admin@dental100med.ru"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
