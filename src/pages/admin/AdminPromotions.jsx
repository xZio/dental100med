import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import { Plus, Pencil, Tag } from 'lucide-react';
import DeleteButton from '../../components/admin/DeleteButton';

const EMPTY = { title: '', description: '', discount: '', link: '/contacts', active: true, expiresAt: '' };
const MAX_ACTIVE = 3;

export default function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = () => adminApi.getPromotions().then(setPromos).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toDateInput = (iso) => iso ? iso.slice(0, 10) : '';

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setError(''); setModal(true); };
  const openEdit = (p) => {
    setForm({ title: p.title, description: p.description, discount: p.discount, link: p.link || '/contacts', active: p.active, expiresAt: toDateInput(p.expiresAt) });
    setEditing(p); setError(''); setModal(true);
  };
  const closeModal = () => setModal(false);
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = { ...form, expiresAt: form.expiresAt || null };
      if (editing) await adminApi.updatePromotion(editing._id, data);
      else         await adminApi.createPromotion(data);
      await load();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await adminApi.deletePromotion(id);
    await load();
  };

  // Четвёртую активную сервер не пропустит — покажем его ответ над списком
  const toggleActive = async (p) => {
    setNotice('');
    try {
      await adminApi.updatePromotion(p._id, { active: !p.active });
      load();
    } catch (err) {
      setNotice(err.message);
    }
  };

  const activeCount = promos.filter((p) => p.active).length;

  if (loading) return <div className="text-gray-400 text-sm">Загрузка...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Акции</h1>
          <p className="text-gray-500 text-sm mt-1">На сайте {activeCount} из {MAX_ACTIVE} · всего {promos.length}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Добавить
        </button>
      </div>

      {notice && <p className="mb-4 text-sm text-red-500">{notice}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {promos.map((p) => (
          <div key={p._id} className={`bg-white rounded-2xl shadow-sm border p-5 ${p.active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag size={16} className="text-orange-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{p.title}</div>
                  {p.discount && <div className="text-orange-600 text-xs font-medium">{p.discount}</div>}
                </div>
              </div>
              <button
                onClick={() => toggleActive(p)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${p.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {p.active ? 'Активна' : 'Скрыта'}
              </button>
            </div>
            {p.description && <p className="text-gray-600 text-xs mb-3 line-clamp-2">{p.description}</p>}
            {p.expiresAt && (
              <div className="text-gray-400 text-xs mb-3">
                До: {new Date(p.expiresAt).toLocaleDateString('ru-RU')}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors">
                <Pencil size={13} /> Изменить
              </button>
              <DeleteButton label="Удалить акцию" onConfirm={() => handleDelete(p._id)} />
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editing ? 'Редактировать акцию' : 'Новая акция'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Мелкий текст (напр. «Консультация всех врачей»)</label>
              <input value={form.title} onChange={f('title')} required maxLength={40} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Крупный текст (напр. «бесплатно», «4200 ₽», «в рассрочку»)</label>
              <input value={form.discount} onChange={f('discount')} maxLength={20} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Куда ведёт (страница сайта, напр. /contacts или /services)</label>
              <input value={form.link} onChange={f('link')} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Подсказка при наведении (необязательно)</label>
              <textarea value={form.description} onChange={f('description')} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Действует до</label>
              <input type="date" value={form.expiresAt} onChange={f('expiresAt')} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-teal-600" />
              <span className="text-sm text-gray-700">Акция активна</span>
            </label>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Отмена</button>
              <button type="submit" disabled={saving} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60">
                {saving ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
