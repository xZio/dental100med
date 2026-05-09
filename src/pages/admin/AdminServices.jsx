import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = { name: '', category: '', price: '', order: 0 };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const load = () => adminApi.getServices().then(setServices).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const categories = [...new Set(services.map((s) => s.category))].sort();
  const filtered = filterCat ? services.filter((s) => s.category === filterCat) : services;

  // Group by category
  const grouped = filtered.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const openAdd = () => { setForm(EMPTY); setEditing(null); setError(''); setModal('edit'); };
  const openEdit = (s) => { setForm({ name: s.name, category: s.category, price: s.price, order: s.order }); setEditing(s); setError(''); setModal('edit'); };
  const closeModal = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = { ...form, price: Number(form.price), order: Number(form.order) };
      if (editing) {
        await adminApi.updateService(editing._id, data);
      } else {
        await adminApi.createService(data);
      }
      await load();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить услугу?')) return;
    await adminApi.deleteService(id);
    load();
  };

  if (loading) return <div className="text-gray-400 text-sm">Загрузка...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Услуги</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} позиций</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Добавить
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterCat('')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!filterCat ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400'}`}
        >
          Все
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterCat === c ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Services by category */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700 text-sm">{cat}</h2>
            </div>
            <table className="w-full">
              <tbody className="divide-y divide-gray-50">
                {items.sort((a, b) => a.order - b.order).map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-800">{s.name}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-teal-700 whitespace-nowrap">
                      {s.price.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-teal-600 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal === 'edit' && (
        <Modal title={editing ? 'Редактировать услугу' : 'Новая услуга'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                list="cats"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <datalist id="cats">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽)</label>
                <input
                  type="number" min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Отмена
              </button>
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
